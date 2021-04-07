const mongoose = require("mongoose");

const User = mongoose.model("User");
const Message = mongoose.model("Message");
const Chatroom = mongoose.model("Chatroom");

const getFriendsByName = async (req, res) => {
  const { name, userId } = req.query;
  if (!name || !userId) throw "invalid query";
  const currentUser = await User.findOne({ _id: userId });

  const listUser = await User.find({
    name: { $regex: name, $options: "i" },
    _id: { $in: [...currentUser.friends] },
  });
  const returnList = listUser.map((user) => ({
    _id: user._id,
    email: user.email,
    name: user.name,
  }));
  res.json(returnList);
};

const getAllFriends = async (req, res) => {
  const { userId } = req.query;
  if (!userId) throw "invalid query";
  const currentUser = await User.findOne({ _id: userId });

  const listUser = await User.find({
    _id: { $in: [...currentUser.friends] },
  });
  const returnList = listUser.map((user) => ({
    _id: user._id,
    email: user.email,
    name: user.name,
  }));
  res.json(returnList);
};

const addFriend = async (req, res) => {
  const { userId, friendId } = req.body;
  if (!userId || !friendId) throw "invalid query";
  if (userId === friendId) throw "Invalid ID";
  const friendUser = await User.findOne({ _id: friendId });

  if (!friendUser) throw "User does not exist";

  if (friendUser.friends.includes(userId)) throw "Already friend";

  await User.updateOne({ _id: userId }, { $addToSet: { friends: [friendId] } });
  const friend = await User.findOneAndUpdate(
    { _id: friendId },
    { $addToSet: { friends: [userId] } },
    { new: true }
  );

  res.json({ _id: friend._id, email: friend.email, name: friend.name });
};

const unFriend = async (req, res) => {
  const { userId, friendId } = req.body;
  if (!userId || !friendId) throw "invalid query";
  const friendUser = await User.findOne({ _id: friendId });

  if (!friendUser) throw "User does not exist";
  await User.updateOne(
    { _id: userId },
    { $pull: { friends: { $in: [friendId] } } }
  );
  await User.updateOne(
    { _id: friendId },
    { $pull: { friends: { $in: [userId] } } }
  );
  const room = await Chatroom.findOne({
    owners: { $all: [userId, friendId] },
  });
  if (room) {
    await Chatroom.deleteMany({ _id: room._id });
    await Message.deleteMany({ chatroom: room._id });
  }
  res.json(true);
};

module.exports = { getFriendsByName, addFriend, unFriend, getAllFriends };
