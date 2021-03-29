const { EMAILREGEX } = require("../constants/index");
const { hash } = require("../helpers/auth");
const jwt = require("jwt-then");
const mongoose = require("mongoose");
// Cannot get straight from model file since the model file is used by app.js
const User = mongoose.model("User");

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
          user: { email: user.email, name: user.name },
        })
      : res.json({ authenication: false });
  } catch (err) {
    res.json({ authenication: false });
  }
};
