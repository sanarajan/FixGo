// simulate-client.ts
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:5000", {
  autoConnect: false, // Important: prevent auto connection
  transports: ["websocket"],
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("✅ [SIMULATED CLIENT] Connected as:", socket.id);

  // Emit register event with a valid userId
 const userId = "684ed8f311a58f8ba3f31776"; // 🔁 Replace with valid ObjectId
  socket.emit("registerUser", userId);
  console.log("📤 [SIMULATED CLIENT] Sent 'register' with userId:", userId);
});

// Catch all events from server (debugging)
socket.onAny((event, ...args) => {
  console.log(`📡 [SIMULATED CLIENT] Received event '${event}':`, args);
});

socket.on("disconnect", () => {
  console.log("🔌 [SIMULATED CLIENT] Disconnected");
});

// Optional: Log connection errors
socket.on("connect_error", (err) => {
  console.error("❌ [SIMULATED CLIENT] Connection error:", err.message);
});

export default socket;
