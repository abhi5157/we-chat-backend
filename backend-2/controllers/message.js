const Message = require("../models/message");
const Group = require("../models/group");

exports.sendMessage = async (req, res) => {
  const { groupId, messageText } = req.body;
  const Message = new Message({
    group: groupId,
    sender: req.user.userId,
    content: messageText,
  });

  await message.save();

  const group = await Group.findById(groupId);
  group.participants.forEach((participant) => {});
  res.json({ message });
};

exports.getMessages = async (req, res) => {
  const groupId = req.params.groupId;
  const messages = await Message.find({ group: groupId }).sort({
    createdAt: -1,
  });
  res.json({ messages });
};
