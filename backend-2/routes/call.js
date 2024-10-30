const express = require("express");
const { initiateCall, endCall } = require("../controllers/chat");
const router = express.Router();

router.post("/initiate", async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    await initiateCall(senderId, receiverId);
    res.status(201).json({ message: "Call initated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error initiating the call" + error.message });
  }
});

router.post("/end", async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    await endCall(senderId, receiverId);
    res.status(200).json({ message: "Call ended" });
  } catch (error) {
    res.status(500).json({ error: "Error ending the call" + error.message });
  }
});

module.exports = router;
