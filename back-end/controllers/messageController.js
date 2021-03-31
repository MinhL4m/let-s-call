const mongoose = require("mongoose");
const Message = mongoose.model("Message");

const getMessageFromRoom = async (req, res) => {
  const { roomId } = req.query;
  if (!roomId) throw "Invalid Query";
  const perPage = 20;
  const page = req.query?.page > 0 ? req.query.page : 0;

  const messages = await Message.find({ chatroom: roomId })
    .sort("-createdOn")
    .limit(perPage)
    .skip(perPage * page);
  console.log(messages);
  res.json(messages);
};

module.exports = { getMessageFromRoom };
