const Call = require('../models/call');

const initiateCall = async(senderId, receiverId) => {
    const newCall = new Call({
        callerId: senderId,
        receiverId: receiverId,
        startTime: new Date(),
    });
    await newCall.save();
};

const endCall = async(senderId, receiverId) =>{
    const call = await Call.findOneAndUpdate(
        {
            callerId: senderId,
            receiverId: receiverId,
            callStatus: 'started'
        },
        {
            endTime: new Date(),
            callStatus: 'ended'
        },
        {
            new: true
        }
    );
    if (call){
        const duration = Math.round((call.endTime - call.startTime)/ 1000);
        call.duration = duration;
        await call.save();
    }
};

module.exports = {initiateCall, endCall};