const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: "Name is required",
    },
    email: {
      type: String,
      required: "Email is required",
    },
    password: {
      type: String,
      required: "password is required",
    },
  },
  {
    timestamps: true,
  }
);

module.export = mongoose.model("User", userSchema);
