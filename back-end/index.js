// src/index.js
const express = require('express');
// const config = require('./config/config');
//const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(express.json());

// Routes
//app.use('/api/users', userRoutes);

// Start the server
app.listen( () => {
  console.log(`Server is running on port ${3000}`);
});
