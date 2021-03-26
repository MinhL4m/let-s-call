const mongoose = require("mongoose");

const chatRoomSchema = mongoose.Schema({
  name: {
    type: String,
    required: "Name is required",
  },
});

module.export = mongoose.model("Chatroom", chatRoomSchema);
