const path = require("path");
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: true, credentials: true },
  transports: ["websocket", "polling"]
});

const PORT = Number(process.env.PORT) || 3000;
const MAX_ROOM_PLAYERS = 2;
const GAME_KEYS = new Set(["rps", "ttt", "pong"]);

const users = new Map();   // username -> { socketId, roomId }
const sockets = new Map(); // socketId -> username
const rooms = new Map();   // roomId -> room
const profiles = new Map(); // username -> live arcade profile

app.get("/health", (_req, res) => res.status(200).json({ ok: true, service: "pixel-playground" }));
app.use(express.static(path.join(__dirname, "public")));
app.get("/join/:room", (_req, res) => res.sendFile(path.join(__dirname, "public", "join.html")));
app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

function cleanUsername(value) {
  return String(value ?? "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 16);
}
function makeUsername(requested) {
  const base = cleanUsername(requested) || "PLAYER";
  if (!users.has(base)) return base;
  for (let n = 2; n <= 9999; n++) {
    const candidate = `${base}_${n}`;
    if (!users.has(candidate)) return candidate;
  }
  return `PLAYER_${Math.floor(1000 + Math.random() * 9000)}`;
}
function makeRoomId() {
  let id;
  do id = Math.random().toString(36).slice(2, 8).toUpperCase();
  while (rooms.has(id));
  return id;
}
function getUser(socket) {
  const name = sockets.get(socket.id);
  return name ? users.get(name) : null;
}
function getRoom(socket) {
  const user = getUser(socket);
  return user?.roomId ? rooms.get(user.roomId) : null;
}
function roomPlayers(room) {
  return room.players.map(p => p.username);
}
function emitLobby() {
  io.emit("lobby:update", {
    onlineUsers: [...users.keys()].sort().slice(0, 100),
    openRooms: [...rooms.values()]
      .filter(r => r.players.length < MAX_ROOM_PLAYERS)
      .map(r => ({ id: r.id, game: r.game, host: r.players[0]?.username ?? "PLAYER", players: r.players.length }))
  });
}
function removeSocketFromRoom(socket, notify = true) {
  const name = sockets.get(socket.id);
  const user = name ? users.get(name) : null;
  if (!user?.roomId) return;

  const room = rooms.get(user.roomId);
  user.roomId = null;

  if (!room) return;
  room.players = room.players.filter(p => p.socketId !== socket.id);
  socket.leave(room.id);

  if (notify && room.players.length) {
    io.to(room.id).emit("room:playerLeft", { username: name, players: roomPlayers(room) });
  }
  if (room.players.length === 0) rooms.delete(room.id);
  else resetGameForRoom(room);
  emitLobby();
}
function resetGameForRoom(room) {
  if (room.game === "rps") room.rps = {};
  if (room.game === "ttt") room.ttt = makeTttState();
  if (room.game === "pong") room.pong = makePongState();
}

function makeTttState() {
  return { board: Array(9).fill(""), turn: "X", winner: "", over: false };
}
function tttWinner(board) {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a,b,c] of lines) if (board[a] && board[a] === board[b] && board[b] === board[c]) return board[a];
  return "";
}
function makePongState() {
  return {
    ball: { x: 360, y: 220, vx: 5, vy: 3 },
    paddles: { left: 180, right: 180 },
    scores: [0, 0]
  };
}
function resetPongBall(p) {
  p.ball = {
    x: 360, y: 220,
    vx: Math.random() < 0.5 ? 5 : -5,
    vy: Math.random() < 0.5 ? 3 : -3
  };
}

io.on("connection", socket => {
  socket.on("auth", ({ username } = {}) => {
    if (sockets.has(socket.id)) return;
    const name = makeUsername(username);
    users.set(name, { socketId: socket.id, roomId: null });
    sockets.set(socket.id, name);
    if (!profiles.has(name)) profiles.set(name, { points: 0, plays: 0, wins: 0 });
    socket.emit("auth:ok", { username: name });
    emitLobby();
  });

  socket.on("lobby:search", ({ query } = {}) => {
    const q = cleanUsername(query).toLowerCase();
    const results = [...users.keys()]
      .filter(name => name.toLowerCase().includes(q))
      .slice(0, 20);
    socket.emit("lobby:searchResults", results);
  });


  socket.on("profile:report", ({ points, plays, wins } = {}) => {
    const username = sockets.get(socket.id);
    if (!username) return;
    const p = profiles.get(username) || { points: 0, plays: 0, wins: 0 };
    p.points = Math.max(p.points, Math.min(1000000, Number(points) || 0));
    p.plays = Math.max(p.plays, Math.min(100000, Number(plays) || 0));
    p.wins = Math.max(p.wins, Math.min(100000, Number(wins) || 0));
    profiles.set(username, p);
    socket.emit("leaderboard:data", [...profiles.entries()]
      .map(([name, value]) => ({ username: name, ...value }))
      .sort((a,b) => b.points-a.points || b.wins-a.wins)
      .slice(0, 20));
  });

  socket.on("leaderboard:request", () => {
    socket.emit("leaderboard:data", [...profiles.entries()]
      .map(([name, value]) => ({ username: name, ...value }))
      .sort((a,b) => b.points-a.points || b.wins-a.wins)
      .slice(0, 20));
  });

  socket.on("room:create", ({ game, invitee } = {}) => {
    const username = sockets.get(socket.id);
    if (!username) return socket.emit("room:error", "Please log in first.");
    if (!GAME_KEYS.has(game)) return socket.emit("room:error", "That game is not multiplayer.");
    removeSocketFromRoom(socket, false);

    const id = makeRoomId();
    const room = {
      id,
      game,
      players: [{ socketId: socket.id, username }],
      rps: {},
      ttt: makeTttState(),
      pong: makePongState()
    };
    rooms.set(id, room);
    users.get(username).roomId = id;
    socket.join(id);

    const inviteUrl = `/join/${id}`;
    socket.emit("room:created", { roomId: id, game, inviteUrl, players: roomPlayers(room) });

    if (invitee) {
      const target = users.get(cleanUsername(invitee));
      if (target && target.socketId !== socket.id) {
        io.to(target.socketId).emit("friend:invite", { roomId: id, game, from: username });
      }
    }
    emitLobby();
  });

  socket.on("room:join", ({ roomId } = {}) => {
    const username = sockets.get(socket.id);
    if (!username) return socket.emit("room:error", "Please log in first.");

    const id = String(roomId ?? "").trim().toUpperCase();
    const room = rooms.get(id);
    if (!room) return socket.emit("room:error", "Room not found. Ask your friend for a new link.");
    if (room.players.some(p => p.socketId === socket.id)) return;
    if (room.players.length >= MAX_ROOM_PLAYERS) return socket.emit("room:error", "That room is full.");

    removeSocketFromRoom(socket, false);
    room.players.push({ socketId: socket.id, username });
    users.get(username).roomId = room.id;
    socket.join(room.id);

    io.to(room.id).emit("room:joined", {
      roomId: room.id,
      game: room.game,
      players: roomPlayers(room)
    });

    if (room.game === "rps") {
      room.rps = {};
      io.to(room.id).emit("rps:state", { scores: [0, 0], players: roomPlayers(room) });
    }
    if (room.game === "ttt") {
      room.ttt = makeTttState();
      io.to(room.id).emit("ttt:state", room.ttt);
    }
    if (room.game === "pong") {
      room.pong = makePongState();
      io.to(room.id).emit("pong:state", room.pong);
    }
    emitLobby();
  });

  socket.on("room:leave", () => removeSocketFromRoom(socket, true));

  socket.on("rps:move", move => {
    const room = getRoom(socket);
    if (!room || room.game !== "rps" || room.players.length !== 2) return;
    if (!["ROCK", "PAPER", "SCISSORS"].includes(move)) return;
    room.rps[socket.id] = move;
    socket.emit("rps:waiting");
    if (Object.keys(room.rps).length !== 2) return;

    const [a,b] = room.players;
    const ma = room.rps[a.socketId], mb = room.rps[b.socketId];
    let winner = "";
    if (ma !== mb) {
      const aWins =
        (ma === "ROCK" && mb === "SCISSORS") ||
        (ma === "PAPER" && mb === "ROCK") ||
        (ma === "SCISSORS" && mb === "PAPER");
      winner = aWins ? a.socketId : b.socketId;
    }
    room.rps.scores ??= [0, 0];
    if (winner) room.rps.scores[winner === a.socketId ? 0 : 1]++;
    io.to(room.id).emit("rps:result", {
      moves: { [a.socketId]: ma, [b.socketId]: mb },
      winner,
      scores: room.rps.scores
    });
    room.rps = { scores: room.rps.scores };
  });

  socket.on("ttt:move", rawIndex => {
    const room = getRoom(socket);
    if (!room || room.game !== "ttt" || room.players.length !== 2 || room.ttt.over) return;
    const index = Number(rawIndex);
    if (!Number.isInteger(index) || index < 0 || index > 8 || room.ttt.board[index]) return;

    const playerIndex = room.players.findIndex(p => p.socketId === socket.id);
    const mark = playerIndex === 0 ? "X" : "O";
    if (room.ttt.turn !== mark) return;

    room.ttt.board[index] = mark;
    room.ttt.winner = tttWinner(room.ttt.board);
    room.ttt.over = Boolean(room.ttt.winner) || room.ttt.board.every(Boolean);
    if (!room.ttt.over) room.ttt.turn = mark === "X" ? "O" : "X";
    io.to(room.id).emit("ttt:state", room.ttt);
  });

  socket.on("ttt:reset", () => {
    const room = getRoom(socket);
    if (!room || room.game !== "ttt" || room.players.length !== 2) return;
    room.ttt = makeTttState();
    io.to(room.id).emit("ttt:state", room.ttt);
  });

  socket.on("pong:input", rawY => {
    const room = getRoom(socket);
    if (!room || room.game !== "pong" || room.players.length !== 2) return;
    const y = Math.max(0, Math.min(360, Number(rawY)));
    if (!Number.isFinite(y)) return;
    const side = room.players[0].socketId === socket.id ? "left" : "right";
    room.pong.paddles[side] = y;
  });

  socket.on("disconnect", () => {
    const username = sockets.get(socket.id);
    removeSocketFromRoom(socket, true);
    if (username) users.delete(username);
    sockets.delete(socket.id);
    emitLobby();
  });
});

// Authoritative Pong physics.
setInterval(() => {
  for (const room of rooms.values()) {
    if (room.game !== "pong" || room.players.length !== 2) continue;
    const p = room.pong;
    p.ball.x += p.ball.vx;
    p.ball.y += p.ball.vy;

    if (p.ball.y <= 8 || p.ball.y >= 432) p.ball.vy *= -1;

    if (p.ball.x <= 32 && p.ball.x >= 20 &&
        p.ball.y >= p.paddles.left && p.ball.y <= p.paddles.left + 80) {
      p.ball.vx = Math.abs(p.ball.vx);
      p.ball.x = 32;
    }
    if (p.ball.x >= 688 && p.ball.x <= 700 &&
        p.ball.y >= p.paddles.right && p.ball.y <= p.paddles.right + 80) {
      p.ball.vx = -Math.abs(p.ball.vx);
      p.ball.x = 688;
    }

    if (p.ball.x < 0) { p.scores[1]++; resetPongBall(p); }
    if (p.ball.x > 720) { p.scores[0]++; resetPongBall(p); }

    io.to(room.id).emit("pong:state", p);
  }
}, 1000 / 60);

server.listen(PORT, () => console.log(`Pixel Playground running on port ${PORT}`));
