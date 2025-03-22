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
      <p>Login - https://college-p-backend-express.onrender.com/login </p>
      <p>Login - https://college-p-backend-express.onrender.com/signup </p>
  `);
});


app.listen(4040, () => {
  console.log('Server running at http://localhost:4040');
})

module.exports = app;