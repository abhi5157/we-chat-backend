const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
    required: true,
    createdAt: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Message", messageSchema);
