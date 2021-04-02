const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: "User is required!",
    ref: "User",
  },
  subscriptions: [
    {
      endpoint: {
        type: mongoose.Schema.Types.String,
      },
      keys: {
        auth: {
          type: mongoose.Schema.Types.String,
        },
        p256dh: {
          type: mongoose.Schema.Types.String,
        },
      },
    },
  ],
});

module.export = mongoose.model("Notification", notificationSchema);
