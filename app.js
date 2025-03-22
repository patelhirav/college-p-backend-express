const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(bodyParser.json());
app.use('/auth', authRoutes);

app.listen(4040, () => {
  console.log('Server running at http://localhost:4040');
})

module.exports = app;