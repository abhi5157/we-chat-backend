const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    sender : {
        type: String,
        required: true
    },
    receiver:{
        type: String,
        required: true
    },
    filePath:{
        type: String,
        required: true
    },

});

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;