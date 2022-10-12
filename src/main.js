const app = require("./express/express.js");
const io = require("./socket/socket.js");

app.listen(5173, function () {
  console.log("Example app listening on port 5173!");
});

io.listen(5174, () => {
  console.log("Socket-io server on port ", 5174);
});
