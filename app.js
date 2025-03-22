const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const otpRoutes = require('./routes/otpRoutes')

const app = express();

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/otp', otpRoutes);

app.get("/", (req, res) => {
  res.send(`
      <h1>Welcome to College API 🎓</h1>
      <p>This is a backend service for OTP authentication.</p>
      <p>Check <a href="/api-docs">API Documentation</a> for available endpoints.</p>
      <p>Singup - https://college-p-backend-express.onrender.com/auth/signup </p>
      <p>Login - https://college-p-backend-express.onrender.com/auth/login </p>
      <p>Send-otp - https://college-p-backend-express.onrender.com/otp/send-otp </p>
      <p>Verify-otp - https://college-p-backend-express.onrender.com/otp/verify-otp </p>
      <p>Reset-Password - https://college-p-backend-express.onrender.com/otp/reset-password </p>
  `);
});


app.listen(4040, () => {
  console.log('Server running at http://localhost:4040');
})

module.exports = app;