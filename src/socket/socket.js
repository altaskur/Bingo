const httpServer = require("http").createServer();
const io = require("socket.io")(
  (httpServer,
  {
    cors: {
      origin: "http://localhost:5173",
    },
  })
);

io.on("connection", (client) => {
  client.on("connect", () => {
    console.log("Client connected");
  });

  client.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

module.exports = io;
