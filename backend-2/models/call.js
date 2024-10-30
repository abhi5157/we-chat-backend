const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
    callerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: { 
        type: Date,
    },
    duration: {
        type: Number,
    },
    callStatus: {
        type: String,
        enum: ['started', 'ended'],
        default: 'started'
    }
});

const Call = mongoose.model('Call', callSchema);
module.exports = Call;