import express from "express";
import employeeRoutes from "./employees.js";
import dashboardRoutes from "./dashboard.js";
import licenseRoutes from "./licenses.js";
import pharmacyLicenseRoutes from "./pharmacy-licenses.js";
import trainingRoutes from "./training.js";
import schedulingRoutes from "./scheduling.js";
import leaveRoutes from "./leave.js";
import attendanceRoutes from "./attendance.js";
import notificationRoutes from "./notifications.js";
import policyRoutes from "./policies.js";
import uploadRoutes from "./upload.js";
import departmentRoutes from "./departments.js";
import roleRoutes from "./roles.js";
import settingsRoutes from "./settings.js";
import ptoRoutes from "./pto.js";
import hrDocumentsRoutes from "./hr-documents.js";
import authRoutes from "./auth.js";

const router = express.Router();

// Public routes (no authentication required)
router.use("/auth", authRoutes);

// API Routes (authentication can be added per route as needed)
router.use("/employees", employeeRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/licenses", licenseRoutes);
router.use("/pharmacy-licenses", pharmacyLicenseRoutes);
router.use("/training", trainingRoutes);
router.use("/scheduling", schedulingRoutes);
router.use("/leave", leaveRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/notifications", notificationRoutes);
router.use("/policies", policyRoutes);
router.use("/upload", uploadRoutes);
router.use("/departments", departmentRoutes);
router.use("/roles", roleRoutes);
router.use("/settings", settingsRoutes);
router.use("/pto", ptoRoutes);
router.use("/hr-documents", hrDocumentsRoutes);

export default router;

