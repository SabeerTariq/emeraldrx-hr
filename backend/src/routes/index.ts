import express from "express";
import employeeRoutes from "./employees.js";
import dashboardRoutes from "./dashboard.js";
import licenseRoutes from "./licenses.js";
import trainingRoutes from "./training.js";
import schedulingRoutes from "./scheduling.js";
import leaveRoutes from "./leave.js";
import onboardingRoutes from "./onboarding.js";
import evaluationRoutes from "./evaluations.js";
import incidentRoutes from "./incidents.js";
import notificationRoutes from "./notifications.js";
import policyRoutes from "./policies.js";
import uploadRoutes from "./upload.js";
import departmentRoutes from "./departments.js";
import roleRoutes from "./roles.js";
import settingsRoutes from "./settings.js";

const router = express.Router();

// API Routes
router.use("/employees", employeeRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/licenses", licenseRoutes);
router.use("/training", trainingRoutes);
router.use("/scheduling", schedulingRoutes);
router.use("/leave", leaveRoutes);
router.use("/onboarding", onboardingRoutes);
router.use("/evaluations", evaluationRoutes);
router.use("/incidents", incidentRoutes);
router.use("/notifications", notificationRoutes);
router.use("/policies", policyRoutes);
router.use("/upload", uploadRoutes);
router.use("/departments", departmentRoutes);
router.use("/roles", roleRoutes);
router.use("/settings", settingsRoutes);

export default router;

