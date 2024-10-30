module.exports = (io, userSocketMap) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("register", (userId) => {
      userSocketMap.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });
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

    // Initiate a call
    socket.on("callUser", ({ userToCall, signalData, from }) => {
      const socketId = userSocketMap.get(userToCall);
      if (socketId) {
        console.log(`for calling user we need there socket it ${socketId}`);
        io.to(socketId).emit("callUser", { signal: signalData, from });
      }
    });

    // Answer a call
    socket.on("answerCall", ({ to, signal }) => {
      const socketId = userSocketMap.get(to);
      if (socketId) {
        console.log(`Signal and to: ${signal}, Socket ID: ${socketId}`);
        io.to(socketId).emit("callAccepted", signal);
        console.log("call accepted");
      }
    });

    // Reject a call
    socket.on("rejectCall", ({ to }) => {
      const socketId = userSocketMap.get(to);
      if (socketId) {
        io.to(socketId).emit("callRejected");
      }
    });

    // End a call
    socket.on("endCall", ({ to }) => {
      const socketId = userSocketMap.get(to);
      if (socketId) {
        io.to(socketId).emit("callEnded");
      }
    });

    socket.on("disconnect", () => {
      // Remove user from socket map
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
