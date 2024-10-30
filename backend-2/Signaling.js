const socketIo = require("socket.io");
function initializeSignalingServer(io) {
  const onlineUsers = new Map();
  const activeCallRequests = new Map();

  io.on("connection", (socket) => {
    console.log("User connected to signaling server:", socket.id);

    // User registers with their MongoDB ID
    socket.on("register", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    // Handle call request
    socket.on("call-request", ({ callerId, receiverId, callerName }) => {
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        // Store call request
        activeCallRequests.set(receiverId, { callerId, callerName });

        // Notify receiver of incoming call
        io.to(receiverSocket).emit("incoming-call-request", {
          callerId,
          callerName,
        });
      } else {
        // Notify caller that receiver is offline
        socket.emit("call-failed", { message: "User is offline" });
      }
    });

    // Handle call acceptance
    socket.on("call-accepted", ({ callerId, receiverId }) => {
      const callerSocket = onlineUsers.get(callerId);
      if (callerSocket) {
        activeCallRequests.delete(receiverId);
        io.to(callerSocket).emit("call-accepted", { receiverId });
      }
    });

    // Handle call rejection
    socket.on("call-rejected", ({ callerId, receiverId }) => {
      const callerSocket = onlineUsers.get(callerId);
      if (callerSocket) {
        activeCallRequests.delete(receiverId);
        io.to(callerSocket).emit("call-rejected", {
          receiverId,
          message: "Call was rejected",
        });
      }
    });

    // Handle WebRTC signaling
    socket.on("webrtc-offer", ({ callerId, receiverId, offer }) => {
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit("webrtc-offer", {
          callerId,
          offer,
        });
      }
    });

    socket.on("webrtc-answer", ({ callerId, receiverId, answer }) => {
      const callerSocket = onlineUsers.get(callerId);
      if (callerSocket) {
        io.to(callerSocket).emit("webrtc-answer", { answer });
      }
    });

    socket.on("ice-candidate", ({ userId, candidate }) => {
      const userSocket = onlineUsers.get(userId);
      if (userSocket) {
        io.to(userSocket).emit("ice-candidate", { candidate });
      }
    });

    socket.on("end-call", ({ userId }) => {
      const userSocket = onlineUsers.get(userId);
      if (userSocket) {
        io.to(userSocket).emit("call-ended");
      }
    });

    socket.on("disconnect", () => {
      // Clean up user's active calls and online status
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          activeCallRequests.delete(userId);
          break;
        }
      }
    });
  });
}

module.exports = initializeSignalingServer;
