const mongoose = require("mongoose");

const chatRoomSchema = mongoose.Schema({
  name: {
    type: String,
    required: "Name is required",
  },
  owners: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.export = mongoose.model("Chatroom", chatRoomSchema);
