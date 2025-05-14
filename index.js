const express = require("express");
require("dotenv").config();
const connectdb = require("./src/config/db");
const mainRouter = require("./src/routers/router");
const emailRouter = require("./src/routers/emailRouter");
const https = require("https");
var cors = require("cors");

var PORT = process.env.PORT || 4000;
connectdb();
const app = express();
const server = require("http").createServer(app);

app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());
app.use("/api", mainRouter);
app.use("/api/email", emailRouter);

// azureOpenAi();
// openAiWithAzureKeys();

server.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
