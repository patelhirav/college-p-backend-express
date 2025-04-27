const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentsController");
const { authMiddleware, checkRole } = require("../middlewares/authMiddleware");

// Get all students — SUPERADMIN only
router.get(
  "/all",
  authMiddleware,
  checkRole(["SUPERADMIN"]),
  studentController.getAllStudents,
);

// Get students of admin's branch — ADMIN only
router.get(
  "/branch",
  authMiddleware,
  checkRole(["ADMIN"]),
  studentController.getBranchStudents,
);

module.exports = router;
