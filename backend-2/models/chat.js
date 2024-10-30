const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // message: {
  //     type: String,
  //     required: true,

  // },
  isRead: {
    type: Boolean,
    default: false,
  },
});

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;

// const mongoose = require("mongoose");

// const chatSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     groupChat: {
//       type: String,
//       default: false,
//     },
//     creator: {
//       type: Types.ObjectId,
//       ref: "User",
//     },

//     members: [
//       {
//         type: Types.ObjectId,
//       },
//     ],
//   },

//   {
//     timestamps: true,
//   }
// );
// export const Chat = models.Chat || model("User", chatSchema);
