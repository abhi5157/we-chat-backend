// services/audioSignal.js

module.exports = (io, userSocketMap) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Register user with their socket ID
    socket.on("register", (userId) => {
      userSocketMap.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    //   // Handle private messages
    socket.on("private-message", ({ senderId, receiverId, message }) => {
      const receiverSocketId = userSocketMap.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive-message", {
          senderId,
          message,
          timestamp: new Date(),
        });
      }
    });

    // Initiate an audio call
    socket.on("initiate-audio-call", ({ callerId, receiverId, signalData }) => {
      const receiverSocketId = userSocketMap.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("incoming-audio-call", {
          callerId,
          signalData,
        });
      } else {
        socket.emit("call-error", { message: "User is unavailable" });
      }
    });

    // Answer a call
    socket.on("answer-audio-call", ({ receiverId, signalData }) => {
      const callerSocketId = userSocketMap.get(receiverId);
      if (callerSocketId) {
        io.to(callerSocketId).emit("audio-call-answered", { signalData });
      }
    });

    // Reject a call
    socket.on("reject-audio-call", ({ receiverId }) => {
      const callerSocketId = userSocketMap.get(receiverId);
      if (callerSocketId) {
        io.to(callerSocketId).emit("audio-call-rejected");
      }
    });

    // End an audio call
    socket.on("end-audio-call", ({ otherUserId }) => {
      const otherSocketId = userSocketMap.get(otherUserId);
      if (otherSocketId) {
        io.to(otherSocketId).emit("audio-call-ended");
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });
};
