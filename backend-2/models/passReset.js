const mongoose = require('mongoose');


const passwordResetSchema = new mongoose.Schema({
    userName: { 
        type: String, 
        required: true, 
        unique: true 
    },
    newPassCode: { 
        type: String, 
        //required: true 
    }, 
    resetToken: { 
        type: String, 
        //required: true 
    },  
    createdAt: { 
        type: Date, 
        default: Date.now, 
        expires: '1h' 
    } 
});


const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);
module.exports = PasswordReset;
