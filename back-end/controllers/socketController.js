const mongoose = require("mongoose");
const Message = mongoose.model("Message");
const User = mongoose.model("User");

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
      });
    }
  });
};

module.exports = { onConnection };
