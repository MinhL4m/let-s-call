// -------- Import Library ---------
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
require("dotenv").config();
const webpush = require("web-push");

// ----------- Config connection to Mongo---------
const mongoose = require("mongoose");
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    autoIndex: true,
  })
  .then(() => console.log("Mongooes Connected"))
  .catch((e) => console.log(e.message));
require("./models/Chatroom");
require("./models/Message");
require("./models/User");
require("./models/Notification");
require("./models/ResetToken");

// --------------Expres-------
var app = express();

// Add middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
webpush.setVapidDetails(
  process.env.WEB_PUSH_CONTACT,
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
);
// Route
app.use("/auth", require("./routes/auth"));
app.use("/chatroom", require("./routes/chatroom"));
app.use("/friend", require("./routes/friend"));
app.use("/message", require("./routes/message"));
app.use("/notification", require("./routes/notification"));

// Error Handler
const errorHandlers = require("./handlers/errorHandler");
app.use(errorHandlers.notFound);
app.use(errorHandlers.mongoseErrors);

if (process.env.ENV === "DEVELOPMENT") {
  app.use(errorHandlers.developmentErrors);
} else {
  app.use(errorHandlers.productionErrors);
}

module.exports = app;
