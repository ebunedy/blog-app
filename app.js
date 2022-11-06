const express = require("express");
const app = express();
const passport = require("passport");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require("./auth/auth");

/** application routes */
const authRouter = require("./routes/auth.user.route");
const userRouter = require("./routes/user.routes");
const tagRouter = require("./routes/tag.route");
const postRouter = require("./routes/post.route");

app.use("/api/v1/user-auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/tag", tagRouter);
app.use("/api/v1/post", postRouter);

app.get("/", (req, res) => {
  res.send(`welcome to dyblog ${req.session.cookie}`);
});

// Handle errors.
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500);
  res.json({ error: err.message });
});

module.exports = app;
