const { NAMEREGEX } = require("../constants/index");
const mongoose = require("mongoose");
const Chatroom = mongoose.model("Chatroom");

const createChatroom = async (req, res) => {
  const { userId, friendId, userName, friendName } = req.body;
  const chatroomExists = await Chatroom.findOne({
    owners: { $all: [userId, friendId] },
  });

  if (chatroomExists) {
    res.json({
      room: chatroomExists,
      new: false,
    });
  } else {
    const chatroom = new Chatroom({
      name: `${userName}, ${friendName}`,
      owners: [userId, friendId],
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
