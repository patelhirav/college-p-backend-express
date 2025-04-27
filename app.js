const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const otpRoutes = require("./routes/otpRoutes");
const path = require("path");
const adminRoutes = require("./routes/adminRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const app = express();
const studentsRoutes = require("./routes/studentsRoutes");

const cors = require("cors");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  }),
);
app.use(bodyParser.json());
app.use("/auth", authRoutes);
app.use("/otp", otpRoutes);
app.use("/admin", adminRoutes);
app.use("/assignments", assignmentRoutes);
app.use("/api/students", studentsRoutes);

app.get("/", (req, res) => {
  res.send(`
      <h1>Welcome to College API 🎓</h1>
      <p>This is a backend service for OTP authentication.</p>
      <p>Check <a href="/api-docs">API Documentation</a> for available endpoints.</p><br/>
      <h1>Authentication API</h1>
      <h2>Singup - <a href="/">https://college-p-backend-express.onrender.com/auth/signup</a></h2>
      <h2>Login - <a href="/">https://college-p-backend-express.onrender.com/auth/login</a></h2>
      <h2>Send-otp - <a href="/">https://college-p-backend-express.onrender.com/otp/send-otp<a/>  </h2>
      <h2>Verify-otp - <a href="/">https://college-p-backend-express.onrender.com/otp/verify-otp</a> </h2>
      <h2>Reset-Password - <a href="/">https://college-p-backend-express.onrender.com/otp/reset-password</a> </h2>

      <h1>Add Admin API</h1>
      <h2>Add Admin - https://college-p-backend-express.onrender.com/admin/add-admin </h2>
      <h2>Get Admin - https://college-p-backend-express.onrender.com/admin/admin-list</h2>
      <h2>Edit Admin - https://college-p-backend-express.onrender.com/admin/edit-admin</h2>
      <h2>Delete Admin - https://college-p-backend-express.onrender.com/admin/delete-admin</h2>

      <h1>Assignment API</h1>
      <h2>Add assignment -https://college-p-backend-express.onrender.com/assignments/add <h2/>
      <h2>Get assignment -https://college-p-backend-express.onrender.com/assignments/all <h2/>
  `);
});

app.listen(3100, () => {
  console.log("Server running at http://localhost:3100");
});

module.exports = app;
