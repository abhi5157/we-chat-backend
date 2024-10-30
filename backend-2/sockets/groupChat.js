const socketIO = require('socket.io');
const Group = require('../models/group');
const Message = require('../models/message');

module.exports = (server) => {
    const io = socketIO(server);
    io.on('connection', (socket) =>{
        console.log('User Connected: ', socket.id);
        socket.on('joinGroup', async({groupId, userId})=>{
            const group = await Group.findById(groupId);
            if(group && group.participants.includes(userId)) {
                socket.join(groupId);
                console.log(`User ${userId} joined the group ${groupId}`);

            }
        });

        socket.on('sendMessage', async({groupId, messageText, senderId}) =>{
            const message = new Message({
                group: groupId,
                sender: senderId,
                content: messageText
            });
            await message.save();

            io.to(groupId).emit('newMessage', message);
        });
        socket.on('disconnect', () =>{
            console.log('User Disconnected', socket.id);
        });
    }); 
};