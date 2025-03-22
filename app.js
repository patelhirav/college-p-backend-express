const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const otpRoutes = require('./routes/otpRoutes')

const app = express();

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/otp', otpRoutes);

app.listen(4040, () => {
  console.log('Server running at http://localhost:4040');
})

module.exports = app;