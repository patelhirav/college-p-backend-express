const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.addAssignment = async (req, res) => {
  try {
    const { title, subject, description, year, branch, sem, adminId } =
      req.body;

    // if (!req.file)
    //   return res.status(400).json({ message: "PDF file is required" });

    // const fileUrl = `/uploads/${req.file.filename}`;

    const newAssignment = await prisma.assignment.create({
      data: {
        title,
        subject,
        description,
        year: parseInt(year),
        branch,
        sem: parseInt(sem),
        fileUrl,
        adminId,
      },
    });

    res.status(201).json({
      message: "Assignment added successfully",
      assignment: newAssignment,
    });
  } catch (error) {
    console.error("Add Assignment Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await prisma.assignment.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(assignments);
  } catch (error) {
    console.error("Get Assignments Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
