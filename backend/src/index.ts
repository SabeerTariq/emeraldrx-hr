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

// CORS configuration - allow multiple origins
const getAllowedOrigins = () => {
  const origins: string[] = [];
  
  // Production origins (always allowed)
  const productionOrigins = [
    "https://emeraldsrxhr.sitestaginglink.com",
    // Add more production domains here as needed
  ];
  origins.push(...productionOrigins);
  
  // Add FRONTEND_URL if set (remove trailing slash if present)
  if (process.env.FRONTEND_URL) {
    const frontendUrl = process.env.FRONTEND_URL.replace(/\/$/, ""); // Remove trailing slash
    origins.push(frontendUrl);
  }
  
  // Add additional production origins if set (comma-separated)
  if (process.env.ALLOWED_ORIGINS) {
    const additionalOrigins = process.env.ALLOWED_ORIGINS
      .split(",")
      .map(o => o.trim().replace(/\/$/, "")) // Remove trailing slashes
      .filter(Boolean);
    origins.push(...additionalOrigins);
  }
  
  // In development, add localhost origins
  if (process.env.NODE_ENV !== "production") {
    origins.push(
      "http://localhost:3000",
      "http://localhost:1206",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:1206",
      "http://127.0.0.1:3001"
    );
  }
  
  // Remove duplicates and normalize (remove trailing slashes)
  return [...new Set(origins.filter(Boolean).map(o => o.replace(/\/$/, "")))];
};

const allowedOrigins = getAllowedOrigins();
console.log(`🌐 Allowed CORS origins: ${allowedOrigins.join(", ")}`);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    // But when credentials are required, we need to be more careful
    if (!origin) {
      // In development, allow requests without origin
      if (process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      // In production, reject requests without origin for security
      return callback(new Error("Not allowed by CORS - no origin"));
    }
    
    // Normalize origin (remove trailing slash for comparison)
    const normalizedOrigin = origin.replace(/\/$/, "");
    
    // In development, allow any localhost port
    if (process.env.NODE_ENV !== "production") {
      if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
        // Return the exact origin string (required when credentials: true)
        return callback(null, origin);
      }
    }
    
    // Check against allowed origins list (normalized)
    if (allowedOrigins.includes(normalizedOrigin)) {
      // Return the exact origin string (required when credentials: true)
      callback(null, origin);
    } else {
      // Log rejected origin for debugging
      console.warn(`🚫 CORS rejected origin: ${origin}`);
      console.warn(`   Allowed origins: ${allowedOrigins.join(", ")}`);
      callback(new Error(`Not allowed by CORS - origin: ${origin}`));
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
  if (process.env.NODE_ENV !== "production" && origin && 
      (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:"))) {
    res.header("Access-Control-Allow-Origin", origin);
  } else if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  } else if (allowedOrigins.length > 0) {
    // Fallback to first allowed origin
    res.header("Access-Control-Allow-Origin", allowedOrigins[0]);
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

