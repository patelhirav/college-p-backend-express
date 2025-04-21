const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDF files are allowed"), false);
};

const upload = multer({ storage, fileFilter });

router.post("/add", upload.single("file"), assignmentController.addAssignment);
router.get("/all", assignmentController.getAllAssignments);

module.exports = router;
