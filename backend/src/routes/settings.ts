import express from "express";
import { query } from "../config/database.js";

const router = express.Router();

const SETTINGS_KEYS = {
  SIDEBAR_THEME: "sidebar_theme",
  SIDEBAR_LOGO: "sidebar_logo",
} as const;

// Default values
const DEFAULT_THEME = {
  backgroundColor: "#ffffff",
  textColor: "#6b7280",
  activeColor: "#22c55e",
  activeTextColor: "#ffffff",
};

/**
 * GET /api/settings/:key
 * Get a specific setting by key
 */
router.get("/:key", async (req, res) => {
  try {
    const { key } = req.params;
    
    const results = await query(
      `SELECT settingValue FROM system_settings WHERE settingKey = ?`,
      [key]
    );
    
    if (results.length === 0) {
      // Return default values if not found
      if (key === SETTINGS_KEYS.SIDEBAR_THEME) {
        return res.json({
          success: true,
          data: DEFAULT_THEME,
        });
      }
      if (key === SETTINGS_KEYS.SIDEBAR_LOGO) {
        return res.json({
          success: true,
          data: null,
        });
      }
      return res.status(404).json({ success: false, error: "Setting not found" });
    }
    
    const settingValue = results[0].settingValue;
    // If it's a JSON string, parse it; otherwise return as-is
    let value;
    try {
      value = typeof settingValue === "string" ? JSON.parse(settingValue) : settingValue;
    } catch (parseError) {
      // If JSON parsing fails, return the raw value
      value = settingValue;
    }
    
    res.json({ success: true, data: value });
  } catch (error: any) {
    console.error(`Error fetching setting ${req.params.key}:`, error);
    // Check if it's a table doesn't exist error
    if (error.code === "ER_NO_SUCH_TABLE" || error.message?.includes("doesn't exist")) {
      console.error("⚠️  system_settings table does not exist. Please run: npm run db:migrate");
      return res.status(500).json({ 
        success: false, 
        error: "Database table not found. Please run database migration: npm run db:migrate" 
      });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/settings/:key
 * Update a specific setting by key
 */
router.put("/:key", async (req, res) => {
  try {
    const { key } = req.params;
    const { value, description } = req.body;
    
    // Allow null values (for logo removal), but reject undefined
    if (value === undefined) {
      return res.status(400).json({ success: false, error: "Value is required" });
    }
    
    // Generate UUID
    const uuid = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };
    
    // Check if setting exists
    const existing = await query(
      `SELECT id FROM system_settings WHERE settingKey = ?`,
      [key]
    );
    
    if (existing.length > 0) {
      // Update existing
      await query(
        `UPDATE system_settings 
         SET settingValue = ?, description = ?, updatedAt = NOW()
         WHERE settingKey = ?`,
        [JSON.stringify(value), description || null, key]
      );
    } else {
      // Insert new
      await query(
        `INSERT INTO system_settings (id, settingKey, settingValue, description, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [uuid(), key, JSON.stringify(value), description || null]
      );
    }
    
    res.json({ success: true, data: value });
  } catch (error: any) {
    console.error(`Error updating setting ${req.params.key}:`, error);
    // Check if it's a table doesn't exist error
    if (error.code === "ER_NO_SUCH_TABLE" || error.message?.includes("doesn't exist")) {
      console.error("⚠️  system_settings table does not exist. Please run: npm run db:migrate");
      return res.status(500).json({ 
        success: false, 
        error: "Database table not found. Please run database migration: npm run db:migrate" 
      });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/settings
 * Get all settings
 */
router.get("/", async (req, res) => {
  try {
    const results = await query(
      `SELECT settingKey, settingValue, description FROM system_settings`
    );
    
    const settings: Record<string, any> = {};
    results.forEach((row: any) => {
      try {
        const value = typeof row.settingValue === "string" 
          ? JSON.parse(row.settingValue) 
          : row.settingValue;
        settings[row.settingKey] = value;
      } catch (parseError) {
        settings[row.settingKey] = row.settingValue;
      }
    });
    
    res.json({ success: true, data: settings });
  } catch (error: any) {
    console.error("Error fetching all settings:", error);
    // Check if it's a table doesn't exist error
    if (error.code === "ER_NO_SUCH_TABLE" || error.message?.includes("doesn't exist")) {
      console.error("⚠️  system_settings table does not exist. Please run: npm run db:migrate");
      return res.status(500).json({ 
        success: false, 
        error: "Database table not found. Please run database migration: npm run db:migrate" 
      });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

