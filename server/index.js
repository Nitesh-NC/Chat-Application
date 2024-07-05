require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectionDB = require("./config/connectDB");
const router = require("./routers/index");
const cookiesParser = require('cookie-parser')
//socket
const{app,server} = require('./socket/index')

// const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookiesParser())

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.json({
    message: `Server running at ${PORT}`,
  });
});

//api endpoint
app.use("/api", router);

connectionDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running at ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });
