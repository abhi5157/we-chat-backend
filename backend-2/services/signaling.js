// // signaling.js
// const WebSocket = require("ws");

// const signalingServer = (io) => {
//   const activeCalls = {};

//   io.on("connection", (socket) => {
//     console.log("New signaling connection:", socket.id);

//     socket.on("message", async (data) => {
//       const message = JSON.parse(data);

//       switch (message.type) {
//         case "offer":
//           activeCalls[message.receiverId] = { socket, offer: message.offer };
//           socket.emit("offer", { offer: message.offer, senderId: message.senderId });
//           break;
//         case "answer":
//           if (activeCalls[message.senderId]) {
//             activeCalls[message.senderId].socket.emit("answer", { answer: message.answer });
//           }
//           break;
//         case "ice-candidate":
//           if (activeCalls[message.peerId]) {
//             activeCalls[message.peerId].socket.emit("ice-candidate", { candidate: message.candidate });
//           }
//           break;
//         case "endCall":
//           handleEndCall(message.receiverId);
//           break;
//         case "mute":
//           handleMute(message.receiverId);
//           break;
//         default:
//           console.log("Unknown message type");
//       }
//     });

//     socket.on("disconnect", () => {
//       for (const [receiverId, call] of Object.entries(activeCalls)) {
//         if (call.socket === socket) delete activeCalls[receiverId];
//       }
//       console.log("User disconnected");
//     });
//   });

//   const handleEndCall = (receiverId) => {
//     if (activeCalls[receiverId]) {
//       activeCalls[receiverId].socket.emit("endCall");
//       delete activeCalls[receiverId];
//     }
//   };

//   const handleMute = (receiverId) => {
//     if (activeCalls[receiverId]) {
//       activeCalls[receiverId].socket.emit("mute");
//     }
//   };
// };

// module.exports = signalingServer;

const userSocketMap = new Map(); // Map to store user socket connections

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Register user with their socket ID
    socket.on("register", (userId) => {
      userSocketMap.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
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
