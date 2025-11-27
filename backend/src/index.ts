import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
})); // Security headers

// CORS configuration - allow multiple origins in development
const allowedOrigins = process.env.NODE_ENV === "production"
  ? [process.env.FRONTEND_URL || "http://localhost:3000"]
  : [
      "http://localhost:3000",
      "http://localhost:1206",
      "http://localhost:3001",
      process.env.FRONTEND_URL,
    ].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    // But when credentials are required, we need to be more careful
    if (!origin) {
      // In development, allow requests without origin
      if (process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    }
    
    // In development, allow any localhost port
    if (process.env.NODE_ENV !== "production") {
      if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
        // Return the exact origin string (required when credentials: true)
        return callback(null, origin);
      }
    }
    
    // Check against allowed origins list
    if (allowedOrigins.includes(origin)) {
      // Return the exact origin string (required when credentials: true)
      callback(null, origin);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));
app.use(compression()); // Compress responses
app.use(morgan("dev")); // Logging
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve uploaded files with proper CORS headers
// Use process.cwd() to ensure correct path regardless of build location
const uploadsPath = path.join(process.cwd(), "uploads");
console.log(`📁 Serving uploads from: ${uploadsPath}`);

app.use("/uploads", (req, res, next) => {
  const origin = req.headers.origin;
  // In development, allow any localhost origin
  if (process.env.NODE_ENV === "development" && origin && 
      (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:"))) {
    res.header("Access-Control-Allow-Origin", origin);
  } else if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  } else {
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "http://localhost:1206");
  }
  res.header("Access-Control-Allow-Credentials", "true");
  next();
}, express.static(uploadsPath));

// Debug endpoint to check uploads directory
app.get("/debug/uploads", (req, res) => {
  const fs = require("fs");
  try {
    const files = fs.readdirSync(uploadsPath);
    res.json({
      uploadsPath,
      files: files.slice(0, 10), // First 10 files
      count: files.length
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
      uploadsPath
    });
  }
});

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    const { testConnection } = await import("./config/database.js");
    const dbConnected = await testConnection();
    res.json({ 
      status: "ok", 
      database: dbConnected ? "connected" : "disconnected",
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      message: "Health check failed",
      timestamp: new Date().toISOString() 
    });
  }
});

// API Routes
import apiRoutes from "./routes/index.js";
app.use("/api", apiRoutes);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;

