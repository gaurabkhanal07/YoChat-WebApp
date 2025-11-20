require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.use(express.json());


// Allow frontend origins for development (configurable via FRONTEND_ORIGIN)
const defaultOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
const allowedOrigins = [defaultOrigin, "http://localhost:3001"];
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
      return callback(new Error("CORS policy: This origin is not allowed."));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const routes = require("./routes/routes");
app.use("/", routes);

app.get("/", (req, res) => {
  res.send("YoChat API is running!");
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

require("./sockets/chat")(io);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
