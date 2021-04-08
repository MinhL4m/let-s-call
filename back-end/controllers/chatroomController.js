const { NAMEREGEX } = require("../constants/index");
const mongoose = require("mongoose");
const Chatroom = mongoose.model("Chatroom");
const User = mongoose.model("User");

const createChatroom = async (req, res) => {
  const { userId, userName, friendString } = req.body;

  if(!friendString) throw "Friend Name cannot be empty"

  //[0]: name, [1]: email
  const friendInfo = friendString.split(";");

  const friend = await User.findOne({ name: friendInfo[0], email: friendInfo[1] });

  if(!friend) throw "User doesn't exist"

  const chatroomExists = await Chatroom.findOne({
    owners: { $all: [userId, friend._id] },
  });

  if (chatroomExists) {
    res.json({
      room: chatroomExists,
      new: false,
    });
  } else {
    const chatroom = new Chatroom({
      name: `${userName}, ${friend.name}`,
      owners: [userId, friend._id],
    });

    await chatroom.save((err, room) => {
      res.json({
        room,
        new: true,
      });
    });
  }
};

const getAllChatroom = async (req, res) => {
  const { userId } = req.query;
  if (!userId) throw "invalid query";
  const chatrooms = await Chatroom.find({ owners: { $in: [userId] } });

  res.json(chatrooms);
};

module.exports = { createChatroom, getAllChatroom };
