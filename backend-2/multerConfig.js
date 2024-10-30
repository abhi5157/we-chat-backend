const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        const chatDir = `uploads/${req.body.chatId}`;
        fs.mkdirSync(chatDir, {recursive : true});
        cb(null, chatDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()} - ${file.originalname}`);
    }
});

const uploads = multer({
    storage: storage,
    limits: { fileSize : 10 * 1024 * 1024},
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif|mp4/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);
        if(mimeType && extname) return cb(null, true);
        cb(new Error('Only images and videos are allowed'));
    }
});

module.exports = uploads;