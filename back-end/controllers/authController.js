const { EMAILREGEX } = require("../constants/index");
const { hash } = require("../helpers/auth");
const crypto = require("crypto");
const jwt = require("jwt-then");
const mongoose = require("mongoose");
const sendEmail = require("../helpers/email/sendEmail");
// Cannot get straight from model file since the model file is used by app.js
const User = mongoose.model("User");
const ResetToken = mongoose.model("ResetToken");

/**
 * handle sign up with email and password
 */
exports.signUp = async (req, res) => {
  const { name, email, password } = req.body;

  if (!EMAILREGEX.test(email)) throw "Email is not correct";
  if (password.length < 5) throw "Password must be atleast 6 characters long.";

  const isUserExist = await User.findOne({ email });

  if (isUserExist) throw "Email is already used";

  const hashedPassword = hash(password);

  const user = new User({ name, email, password: hashedPassword });

  const returnedUser = await user.save();

  res.json(true);
};

/**
 * handle login with email and password
 */
exports.logIn = async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = hash(password);

  const user = await User.findOne({ email, password: hashedPassword });

  if (!user) throw "Email or Password didn't match";

  // sign token to send back to client
  const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({
    message: true,
    token,
    user: {
      name: user.name,
      email: user.email,
      id: user._id,
    },
  });
};

exports.checkLogIn = async (req, res) => {
  try {
    if (!req.headers.authorization) res.json({ authenication: false });
    const token = req.headers.authorization.split(" ")[1];

    // payload contain the id of logined user
    const payload = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: payload.id });
    user
      ? res.json({
          authenication: true,
          user: { email: user.email, name: user.name, id: user._id },
        })
      : res.json({ authenication: false });
  } catch (err) {
    res.json({ authenication: false });
  }
};

exports.requestResetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) throw "Invalid Email!";
  const user = await User.findOne({ email });
  if (!user) throw "Email doesn't exist";

  let resetToken = await ResetToken.findOne({ user: user._id });
  if (resetToken) resetToken.deleteOne();

  let token = crypto.randomBytes(32).toString("hex");
  const hashedToken = hash(token);

  await ResetToken({
    user: user._id,
    token: hashedToken,
    createdAt: Date.now(),
  }).save();

  const link = `http://localhost:3000/passwordReset?token=${token}&id=${user._id}`;

  sendEmail(
    user.email,
    "Password Reset Request",
    { name: user.name, link: link },
    "./template/requestResetPassword.handlebars"
  );
  return res.json({ message: "Reset Link sent!" });
};

exports.resetPassword = async (req, res) => {
  const { userId, token, password } = req.body;

  if (!userId || !token || !password) throw "Invalid Body";

  let resetToken = await ResetToken.findOne({ user: userId });

  if (!resetToken) throw "Invalid or expired reset token";

  const hashedToken = hash(token);

  if (resetToken.token !== hashedToken) throw "Invalid or expired reset token";

  const hashedPassword = hash(password);

  await User.updateOne({ _id: userId }, { $set: { password: hashedPassword } });
  res.json(true);
};
