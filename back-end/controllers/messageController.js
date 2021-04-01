const mongoose = require("mongoose");
const Message = mongoose.model("Message");

const getMessageFromRoom = async (req, res) => {
  const { roomId, lastDate } = req.query;
  if (!roomId) throw "Invalid Query";
  const perPage = 10;

  const messages = await Message.find({
    chatroom: roomId,
    createdAt: { $lt: Date.parse(lastDate) },
  })
    .sort("-createdAt")
    .limit(perPage);
  res.json(messages);
};

module.exports = { getMessageFromRoom };
