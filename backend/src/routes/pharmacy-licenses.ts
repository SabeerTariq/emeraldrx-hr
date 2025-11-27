import express from "express";
import { query } from "../config/database.js";
import { authenticate } from "../middleware/auth.js";
import { requirePermission } from "../middleware/rbac.js";

const router = express.Router();

/**
 * GET /api/pharmacy-licenses
 * Get all pharmacy licenses
 */
router.get("/", authenticate, requirePermission("pharmacy_licenses:read"), async (req, res) => {
  try {
    const licenses = await query(`
      SELECT 
        pl.*,
        DATEDIFF(pl.expirationDate, CURDATE()) as daysUntilExpiry
      FROM pharmacy_licenses pl
      WHERE pl.isActive = 1
      ORDER BY pl.expirationDate ASC
    `) as any[];
    
    res.json({ success: true, data: licenses });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/pharmacy-licenses/:id
 * Get single pharmacy license
 */
router.get("/:id", authenticate, requirePermission("pharmacy_licenses:read"), async (req, res) => {
  try {
    const license = await query(
      `SELECT 
        pl.*,
        DATEDIFF(pl.expirationDate, CURDATE()) as daysUntilExpiry
       FROM pharmacy_licenses pl
       WHERE pl.id = ?`,
      [req.params.id]
    ) as any[];
    
    if (Array.isArray(license) && license.length === 0) {
      return res.status(404).json({ success: false, error: "Pharmacy license not found" });
    }
    
    res.json({ success: true, data: license[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/pharmacy-licenses
 * Create new pharmacy license
 */
router.post("/", authenticate, requirePermission("pharmacy_licenses:create"), async (req, res) => {
  try {
    const {
      licenseName,
      licenseNumber,
      state,
      issueDate,
      expirationDate,
      documentUrl,
      notes,
    } = req.body;

    const uuid = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    const licenseId = uuid();

    await query(
      `INSERT INTO pharmacy_licenses (id, licenseName, licenseNumber, state, issueDate, expirationDate, documentUrl, notes, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
      [
        licenseId,
        licenseName,
        licenseNumber,
        state,
        issueDate,
        expirationDate,
        documentUrl || null,
        notes || null,
      ]
    );

    // Check if expiry is within 90 days and create notifications
    const daysUntilExpiry = Math.floor(
      (new Date(expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiry <= 90 && daysUntilExpiry >= 0) {
      // Get HR Admin and Compliance Manager roles
      const admins = await query(`
        SELECT DISTINCT e.id
        FROM employees e
        JOIN employee_roles er ON e.id = er.employeeId
        JOIN roles r ON er.roleId = r.id
        WHERE r.name IN ('HR Admin', 'Compliance Manager') AND e.isActive = 1
      `) as any[];

      // Create notifications for admins
      for (const admin of admins) {
        const notificationId = uuid();
        await query(
          `INSERT INTO notifications (id, employeeId, type, title, message, link, createdAt)
           VALUES (?, ?, 'license_expiry', ?, ?, ?, NOW())`,
          [
            notificationId,
            admin.id,
            `Pharmacy License Expiring: ${licenseName}`,
            `Pharmacy license "${licenseName}" (${licenseNumber}) expires in ${daysUntilExpiry} days.`,
            `/pharmacy-licenses/${licenseId}`,
          ]
        );
      }
    }

    res.json({ success: true, data: { id: licenseId } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/pharmacy-licenses/:id
 * Update pharmacy license
 */
router.put("/:id", authenticate, requirePermission("pharmacy_licenses:update"), async (req, res) => {
  try {
    const {
      licenseName,
      licenseNumber,
      state,
      issueDate,
      expirationDate,
      documentUrl,
      notes,
      isActive,
    } = req.body;

    const updateFields: string[] = [];
    const params: any[] = [];

    if (licenseName) {
      updateFields.push("licenseName = ?");
      params.push(licenseName);
    }
    if (licenseNumber) {
      updateFields.push("licenseNumber = ?");
      params.push(licenseNumber);
    }
    if (state) {
      updateFields.push("state = ?");
      params.push(state);
    }
    if (issueDate) {
      updateFields.push("issueDate = ?");
      params.push(issueDate);
    }
    if (expirationDate) {
      updateFields.push("expirationDate = ?");
      params.push(expirationDate);
    }
    if (documentUrl !== undefined) {
      updateFields.push("documentUrl = ?");
      params.push(documentUrl);
    }
    if (notes !== undefined) {
      updateFields.push("notes = ?");
      params.push(notes);
    }
    if (isActive !== undefined) {
      updateFields.push("isActive = ?");
      params.push(isActive ? 1 : 0);
    }

    updateFields.push("updatedAt = NOW()");
    params.push(req.params.id);

    await query(
      `UPDATE pharmacy_licenses SET ${updateFields.join(", ")} WHERE id = ?`,
      params
    );

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/pharmacy-licenses/:id
 * Delete pharmacy license (soft delete)
 */
router.delete("/:id", authenticate, requirePermission("pharmacy_licenses:delete"), async (req, res) => {
  try {
    await query(
      `UPDATE pharmacy_licenses SET isActive = 0, updatedAt = NOW() WHERE id = ?`,
      [req.params.id]
    );

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/pharmacy-licenses/expiring
 * Get licenses expiring within specified days (default 90)
 */
router.get("/expiring/:days?", authenticate, requirePermission("pharmacy_licenses:read"), async (req, res) => {
  try {
    const days = parseInt(req.params.days || "90");
    const licenses = await query(
      `SELECT 
        pl.*,
        DATEDIFF(pl.expirationDate, CURDATE()) as daysUntilExpiry
       FROM pharmacy_licenses pl
       WHERE pl.isActive = 1
         AND pl.expirationDate BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
       ORDER BY pl.expirationDate ASC`,
      [days]
    ) as any[];
    
    res.json({ success: true, data: licenses });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

