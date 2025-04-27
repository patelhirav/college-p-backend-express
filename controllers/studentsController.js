const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Get all students (Super Admin only)
exports.getAllStudents = async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: {
        role: "USER",
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get students for a specific branch (Admin only)
exports.getBranchStudents = async (req, res) => {
  try {
    const { branch } = req.user; // assuming admin's branch is set in req.user

    const students = await prisma.user.findMany({
      where: {
        role: "USER",
        branch: branch,
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
