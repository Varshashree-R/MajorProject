import express from "express";
import dotenv from "dotenv";
import "express-async-errors";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

import connectDB from "./database/connectDB.js";

import authRoutes from "./routes/authRoutes.js";
import ownerPropertyRoutes from "./routes/ownerPropertyRoutes.js";
import tenantPropertyRoutes from "./routes/tenantPropertyRoutes.js";
import ownerUserRoutes from "./routes/ownerUserRoutes.js";
import tenantUserRoutes from "./routes/tenantUserRoutes.js";
import emailSenderRoutes from "./routes/emailSenderRoutes.js";
import contractRoutes from "./routes/contractRoutes.js";
import ownerRentDetailRoutes from "./routes/rentDetailOwnerRoutes.js";
import tenantRentDetailRoutes from "./routes/rentDetailTenantRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

import routeNotFoundMiddleware from "./middleware/route-not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import { authorizeOwnerUser, authorizeTenantUser } from "./middleware/userAuthorization.js";

import { Server } from "socket.io";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// ✅ Logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ✅ CLEAN + CORRECT CORS (ONLY THIS)
app.use(
  cors({
    origin: "https://frontend-rc9t.onrender.com",
    credentials: true,
    methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  })
);

// ✅ Allow preflight for all routes
app.options("*", cors());

// ✅ Basic security middlewares
app.use(express.json());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(xss());
app.use(mongoSanitize());
app.set("trust proxy", 1);
app.use(cookieParser());

// ✅ Static build — production
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, "../client/dist")));

// ✅ Health check
app.get("/test-backend", (req, res) => {
  res.send("Backend is working!");
});

// ✅ ====== ROUTES WITH PRE-FLIGHT FIXES ======

// AUTH (no protection)
app.use("/api/auth", authRoutes);

// OWNER routes
app.options("/api/owner/real-estate", cors());
app.use("/api/owner/real-estate", authorizeOwnerUser, ownerPropertyRoutes);

app.options("/api/owner", cors());
app.use("/api/owner", authorizeOwnerUser, ownerUserRoutes);

app.options("/api/rentDetail", cors());
app.use("/api/rentDetail", authorizeOwnerUser, ownerRentDetailRoutes);

// TENANT routes
app.options("/api/tenant/real-estate", cors());
app.use("/api/tenant/real-estate", authorizeTenantUser, tenantPropertyRoutes);

app.options("/api/tenant", cors());
app.use("/api/tenant", authorizeTenantUser, tenantUserRoutes);

app.options("/api/rentDetailTenant", cors());
app.use("/api/rentDetailTenant", authorizeTenantUser, tenantRentDetailRoutes);

// Email + Contract + Chat
app.use("/api/sendEmail", emailSenderRoutes);
app.use("/api/contract", contractRoutes);
app.use("/api/chat", chatRoutes);

// ✅ Frontend route
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
});

// ✅ Error handlers
app.use(errorHandlerMiddleware);
app.use(routeNotFoundMiddleware);

// ✅ Start server
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.log("❌ DB error:", err);
  }
};
start();

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// ✅ SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "https://frontend-rc9t.onrender.com",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("sendMsg", (data) => {
    const sendUserSocketId = onlineUsers.get(data.to);
    if (sendUserSocketId) {
      socket.to(sendUserSocketId).emit("receiveMsg", data.message);
    }
  });
});
