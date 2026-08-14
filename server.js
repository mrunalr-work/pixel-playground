const path = require("path");
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: true, credentials: true } });

app.get("/health", (req, res) => res.json({ ok: true, service: "pixel-playground" }));
app.use(express.static(path.join(__dirname, "public")));
app.get("/join/:room", (req, res) => res.sendFile(path.join(__dirname, "public", "join.html")));
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

const users = new Map();       // username -> { id, roomId, online }
const sockets = new Map();     // socket.id -> username
const rooms = new Map();       // roomId -> room state

const games = {
  rps: "Rock Paper Scissors",
  ttt: "Tic-Tac-Toe",
  pong: "Pong"
};

function cleanName(name) {
  return String(name || "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 16);
}
function uniqueName(name) {
  const base = cleanName(name) || "PLAYER";
  if (!users.has(base)) return base;
  for (let i = 2; i < 1000; i++) {
    const candidate = `${base}_${i}`;
    if (!users.has(candidate)) return candidate;
  }
  return `${base}_${Date.now()}`;
}
function roomCode() {
  let code;
  do code = Math.random().toString(36).slice(2, 8).toUpperCase();
  while (rooms.has(code));
  return code;
}
function publicRooms() {
  return [...rooms.values()]
    .filter(r => r.players.length < 2)
    .map(r => ({
      id: r.id,
      game: r.game,
      host: r.players[0]?.username || "PLAYER",
      players: r.players.length
    }));
}
function emitLobby() {
  io.emit("lobby:update", { users: [...users.keys()].slice(0, 100), rooms: publicRooms() });
}
function getRoom(socket) {
  const username = sockets.get(socket.id);
  const user = users.get(username);
  return user?.roomId ? rooms.get(user.roomId) : null;
}
function otherPlayer(room, socketId) {
  return room.players.find(p => p.id !== socketId);
}

io.on("connection", socket => {
  socket.on("auth", ({ username }) => {
    const name = uniqueName(username);
    users.set(name, { id: socket.id, roomId: null, online: true });
    sockets.set(socket.id, name);
    socket.emit("auth:ok", { username: name });
    emitLobby();
  });

  socket.on("lobby:search", ({ query }) => {
    const q = cleanName(query).toLowerCase();
    const results = [...users.entries()]
      .filter(([name, u]) => u.online && name.toLowerCase().includes(q))
      .slice(0, 20)
      .map(([name]) => name);
    socket.emit("lobby:searchResults", results);
  });

  socket.on("room:create", ({ game, targetUsername }) => {
    const username = sockets.get(socket.id);
    if (!username || !games[game]) return;
    const id = roomCode();
    const room = {
      id, game, players: [{ id: socket.id, username }],
      createdAt: Date.now(), state: null, rps: {}, ttt: null, pong: null
    };
    rooms.set(id, room);
    users.get(username).roomId = id;

    if (targetUsername && users.has(targetUsername) && users.get(targetUsername).online) {
      const target = users.get(targetUsername);
      io.to(target.id).emit("friend:invite", { roomId: id, game, from: username });
    }
    socket.join(id);
    socket.emit("room:created", { roomId: id, game, invitePath: `/join/${id}` });
    emitLobby();
  });

  socket.on("room:join", ({ roomId }) => {
    const username = sockets.get(socket.id);
    const room = rooms.get(String(roomId || "").toUpperCase());
    if (!username || !room) return socket.emit("room:error", "Room not found.");
    if (room.players.length >= 2) return socket.emit("room:error", "That room is full.");

    room.players.push({ id: socket.id, username });
    users.get(username).roomId = room.id;
    socket.join(room.id);

    io.to(room.id).emit("room:joined", {
      roomId: room.id,
      game: room.game,
      players: room.players.map(p => p.username)
    });
    if (room.game === "rps") initRps(room);
    if (room.game === "ttt") initTtt(room);
    if (room.game === "pong") initPong(room);
    emitLobby();
  });

  socket.on("room:leave", () => leaveRoom(socket));

  // RPS: server resolves both moves.
  socket.on("rps:move", move => {
    const room = getRoom(socket);
    if (!room || room.game !== "rps" || !room.players.some(p => p.id === socket.id)) return;
    room.rps[socket.id] = move;
    if (Object.keys(room.rps).length < 2) return socket.emit("game:waiting", "Waiting for your opponent.");
    const [a,b] = room.players;
    const ma = room.rps[a.id], mb = room.rps[b.id];
    const winner = ma === mb ? null :
      ((ma === "ROCK" && mb === "SCISSORS") || (ma === "PAPER" && mb === "ROCK") || (ma === "SCISSORS" && mb === "PAPER")) ? a.id : b.id;
    room.state = room.state || { scores: {} };
    room.state.scores[a.id] = room.state.scores[a.id] || 0;
    room.state.scores[b.id] = room.state.scores[b.id] || 0;
    if (winner) room.state.scores[winner]++;
    io.to(room.id).emit("rps:result", {
      moves: { [a.id]: ma, [b.id]: mb },
      winner,
      scores: room.state.scores
    });
    room.rps = {};
  });

  // Tic Tac Toe: server owns board/turn.
  socket.on("ttt:move", index => {
    const room = getRoom(socket);
    if (!room || room.game !== "ttt" || !room.ttt || room.ttt.over) return;
    const pIndex = room.players.findIndex(p => p.id === socket.id);
    const mark = pIndex === 0 ? "X" : "O";
    if (room.ttt.turn !== mark || room.ttt.board[index]) return;
    room.ttt.board[index] = mark;
    const winner = tttWinner(room.ttt.board);
    if (winner || room.ttt.board.every(Boolean)) room.ttt.over = true;
    else room.ttt.turn = mark === "X" ? "O" : "X";
    io.to(room.id).emit("ttt:state", room.ttt);
  });
  socket.on("ttt:reset", () => {
    const room = getRoom(socket);
    if (room?.game === "ttt") { initTtt(room); io.to(room.id).emit("ttt:state", room.ttt); }
  });

  // Pong: server is authoritative for physics; clients send paddle intent.
  socket.on("pong:input", y => {
    const room = getRoom(socket);
    if (!room || room.game !== "pong" || !room.pong) return;
    const side = room.players[0].id === socket.id ? "left" : "right";
    room.pong[side].y = Math.max(0, Math.min(360, Number(y) || 0));
  });

  socket.on("disconnect", () => {
    const username = sockets.get(socket.id);
    leaveRoom(socket, true);
    if (username) {
      users.delete(username);
      sockets.delete(socket.id);
    }
    emitLobby();
  });

  emitLobby();
});

function initRps(room) {
  room.rps = {};
  room.state = { scores: Object.fromEntries(room.players.map(p => [p.id, 0])) };
  io.to(room.id).emit("rps:state", { scores: room.state.scores });
}
function tttWinner(b) {
  return [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
    .find(([a,c,d]) => b[a] && b[a] === b[c] && b[c] === b[d]) ? b[[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
    .find(([a,c,d]) => b[a] && b[a] === b[c] && b[c] === b[d])[0]] : null;
}
function initTtt(room) {
  room.ttt = { board: Array(9).fill(""), turn: "X", over: false };
}
function initPong(room) {
  room.pong = {
    x: 360, y: 220, vx: 5, vy: 3,
    left: { y: 180 }, right: { y: 180 },
    scores: [0, 0]
  };
  io.to(room.id).emit("pong:state", room.pong);
}
function leaveRoom(socket, silent=false) {
  const username = sockets.get(socket.id);
  const user = username ? users.get(username) : null;
  if (!user?.roomId) return;
  const room = rooms.get(user.roomId);
  if (room) {
    room.players = room.players.filter(p => p.id !== socket.id);
    socket.leave(room.id);
    io.to(room.id).emit("room:left", { username });
    if (room.players.length === 0) rooms.delete(room.id);
  }
  user.roomId = null;
  if (!silent) socket.emit("room:left");
  emitLobby();
}

setInterval(() => {
  for (const room of rooms.values()) {
    if (room.game !== "pong" || room.players.length !== 2 || !room.pong) continue;
    const p = room.pong;
    p.x += p.vx; p.y += p.vy;
    if (p.y < 8 || p.y > 432) p.vy *= -1;
    if (p.x < 32 && p.y > p.left.y && p.y < p.left.y + 80) { p.vx = Math.abs(p.vx); p.x = 32; }
    if (p.x > 680 && p.y > p.right.y && p.y < p.right.y + 80) { p.vx = -Math.abs(p.vx); p.x = 680; }
    if (p.x < 0) { p.scores[1]++; resetBall(p); }
    if (p.x > 720) { p.scores[0]++; resetBall(p); }
    io.to(room.id).emit("pong:state", p);
  }
}, 1000 / 60);

function resetBall(p) {
  p.x = 360; p.y = 220;
  p.vx = Math.random() > .5 ? 5 : -5;
  p.vy = Math.random() > .5 ? 3 : -3;
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Pixel Playground running on port ${PORT}`));
