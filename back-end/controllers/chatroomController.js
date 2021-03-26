const { NAMEREGEX } = require("../constants/index");
const mongoose = require("mongoose");
const Chatroom = mongoose.model("Chatroom");

const createChatroom = async (req, res) => {
  const { name } = req.body;

  if (!NAMEREGEX.test(name)) throw "Name can not contain alphabets";

  const chatroomExists = await Chatroom.findOne({ name });

  if (chatroomExists) throw "Name already exist";

  const chatroom = new Chatroom({ name });

  await chatroom.save();

  res.json({
    message: true,
  });
};

module.exports = { createChatroom };
