const mongoose = require("mongoose");

const chatRoomSchema = mongoose.Schema(
  {
    chatroom: {
      // get Id of ref schema
      type: mongoose.Schema.Types.ObjectId,
      required: "Chatroom is required!",
      ref: "Chatroom",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Chatroom is required!",
      ref: "User",
    },
    message: {
      type: String,
      required: "Message is required",
    },
    name: {
      type: String,
      required: "Name is required",
    },
  },
  {
    timestamps: true,
  }
);

module.export = mongoose.model("Message", chatRoomSchema);
