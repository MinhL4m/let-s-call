const mongoose = require("mongoose");
const Message = mongoose.model("Message");
const User = mongoose.model("User");
const Notification = mongoose.model("Notification");
const Room = mongoose.model("Chatroom");
const webpush = require("web-push");

const onConnection = (socket, io) => {
  console.log("Connected: " + socket.userId);

  socket.on("disconnect", () => {
    console.log("Disconnect:" + socket.userId);
  });

  socket.on("joinRoom", ({ chatroomId }) => {
    // make socket join chatroomid room
    socket.join(chatroomId);
    console.log("A user joined chatroom: " + chatroomId);
  });

  socket.on("leaveRoom", ({ chatroomId }) => {
    //make socket leave the chatroomid room
    socket.leave(chatroomId);
    console.log("A user left chatroom: " + chatroomId);
  });

  socket.on("chatroomMessage", async ({ chatroomId, message }) => {
    console.log(chatroomId);
    if (message.trim().length > 0) {
      const user = await User.findOne({ _id: socket.userId });
      const newMessage = new Message({
        chatroom: chatroomId,
        user: socket.userId,
        name: user.name,
        message,
      });
      await newMessage.save((err, savedMessage) => {
        // to all socket in chatroom, emit message
        io.to(chatroomId).emit("newMessage", {
          message: savedMessage,
        });
        sentNotification(chatroomId, socket.userId, user.name, message);
      });
    }
  });

const sentNotification = async (chatroomId, userId, name, message) => {
  const room = await Room.findOne({ _id: chatroomId });
  const anotherUser = room.owners.find((owner) => {
    return owner != userId;
  });

  const notification = await Notification.findOne({ user: anotherUser });
  const payload = JSON.stringify({
    title: `${name} send you message!`,
    body:
      message.length > 15
        ? `${message.substr(0, 15)}...`
        : message.substr(0, 15),
  });
  if (notification) {
    for (subscription of notification.subscriptions) {
      webpush
        .sendNotification(subscription, payload)
        .catch((e) => console.log(e.stack));
    }
  }
};

module.exports = { onConnection };
