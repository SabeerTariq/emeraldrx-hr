import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * Authentication Middleware
 * Verifies JWT token from Authorization header
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        success: false, 
        error: "No token provided. Please log in." 
      });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix
    
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not configured");
      return res.status(500).json({ 
        success: false, 
        error: "Server configuration error" 
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
      (req as any).user = decoded; // Attach user info to request
      (req as any).employeeId = decoded.employeeId || decoded.id;
      next();
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ 
          success: false, 
          error: "Token expired. Please log in again." 
        });
      }
      return res.status(401).json({ 
        success: false, 
        error: "Invalid token. Please log in again." 
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Optional Authentication Middleware
 * Verifies token if present, but doesn't require it
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      
      if (process.env.JWT_SECRET) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
          (req as any).user = decoded;
          (req as any).employeeId = decoded.employeeId || decoded.id;
        } catch (error) {
          // Token invalid, but continue without auth
        }
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};

