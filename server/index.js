const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const logger = require('./middleware/logger');
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");

require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(logger);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Server Routes
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);

// Client routes
app.get("/*", (_, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});