// const express = require("express");
// const router = express.Router();
// const Chat = require("../models/chat");
// const User = require("../models/user");
// const { initiateCall, endCall } = require("../controllers/chat");
// const upload = require("../multerConfig");
// const Media = require("../models/media");

// router.post("/upload", upload.single("mediaFile"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send("No file uploaded");
//   }

//   const newMedia = new Media({
//     sender: req.body.sender,
//     receiver: req.body.receiver,
//     filePath: req.file.path,
//   });

//   newMedia
//     .save()
//     .then(() => res.status(200).json({ message: "File uploaded successfully" }))
//     .catch((err) =>
//       res.status(500).json({ message: "Database error", error: err })
//     );
// });

// router.post("/send", async (req, res) => {
//   const { senderId, receiverId, message } = req.body;

//   try {
//     const newMessage = new Chat({
//       sender: senderId,
//       receiver: receiverId,
//       //message
//     });

//     await newMessage.save();
//     res.status(201).json({ success: true, message: "Sent Successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// router.get("/history/:senderId/:receiverId", async (req, res) => {
//   const { senderId, receiverId } = req.params;

//   try {
//     const chatHistory = await Chat.find({
//       $or: [
//         { sender: senderId, receiver: receiverId },
//         { sender: receiverId, receiver: senderId },
//       ],
//     }).sort({ createdAt: 1 });

//     res.status(200).json(chatHistory);
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// router.post("/read", async (req, res) => {
//   const { senderId, receiverId } = req.body;

//   try {
//     await Chat.updateMany(
//       { sender: senderId, receiver: receiverId, isRead: false },
//       { $set: { isRead: true } }
//     );
//     res
//       .status(200)
//       .json({ success: true, message: "messages are marked as read" });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// router.put("/block-user/:id", async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const { blocked } = req.body;

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     user.blocked = blocked;
//     await user.save();

//     return res
//       .status(200)
//       .json({ message: "User has been ${blocked ? 'blocked' : 'unblocked'}" });
//   } catch (error) {
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// module.exports = router;

// routes/chat.js
const express = require("express");
const Chat = require("../models/chat");
const multer = require("multer");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Send a message
router.post("/send-message", async (req, res) => {
  const { senderId, receiverId, content, type } = req.body;

  try {
    const message = new Chat({ senderId, receiverId, content, type });
    await message.save();

    res
      .status(201)
      .json({ message: "Message sent successfully", data: message });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error sending message: ${error.message}` });
  }
});

// Get chat history between two users
router.get("/history/:userId/:contactId", async (req, res) => {
  const { userId, contactId } = req.params;

  try {
    const chatHistory = await Chat.find({
      $or: [
        { senderId: userId, receiverId: contactId },
        { senderId: contactId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(chatHistory);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching chat history: ${error.message}` });
  }
});

// Upload media file
router.post("/upload", upload.single("file"), (req, res) => {
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;

  res.status(200).json({ message: "File uploaded successfully", url: fileUrl });
});

// Get recent chats for a user
router.get("/recent/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const recentChats = await Chat.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json(recentChats);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching recent chats: ${error.message}` });
  }
});

module.exports = router;
