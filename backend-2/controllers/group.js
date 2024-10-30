const Group = require('../models/group');
const User = require('../models/user');

exports.createGroup = async (req, res) =>{
    const {groupName, members} = req.body; 
    const gorup = new Group({
        name: groupName,
        participants: members,
        owner: req.user.userId
    });
    await group.save();
    res.json({ group });

};

exports.removeMember = async(req,res) => {
    const groupId = req.params.groupId;
    const {userId} = req.body;
    await Group.findByIdAndUpdate(groupId, { $pull: {participants: userId}});
    res.json({message: 'Member removed Successfully'});

};

