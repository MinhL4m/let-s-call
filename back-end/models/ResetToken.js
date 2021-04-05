const mongoose = require("mongoose");
const resetTokenSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 7200,
  },
});
resetTokenSchema.index({ "createdAt": 1 }, { expireAfterSeconds: 7200 });
module.exports = mongoose.model("ResetToken", resetTokenSchema);
