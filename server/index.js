require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const logger = require('./middleware/logger');
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const venueRoutes = require("./routes/venueRoutes");

require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(logger);

// Connect to MongoDB using Mongoose, going to the DB called 'pickup'
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'pickup'
});

// Server Routes
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/skillLevels", async (req, res, next) => {
  try {
    const skillLevels = await mongoose.connection.db.collection('skillLevel').find().toArray();
    res.json(skillLevels);
  } catch (error) {
    next(error);
  }
});
app.use("/api/activities", async (req, res, next) => {
  try {
    const activities = await mongoose.connection.db.collection('activities').find().toArray();
    res.json(activities);
  } catch (error) {
    next(error);
  }
});
app.use("/api/intensityLevels", async (req, res, next) => {
  try {
    const intensityLevels = await mongoose.connection.db.collection('intensityLevel').find().toArray();
    res.json(intensityLevels);
  } catch (error) {
    next(error);
  }
});

// Client routes
app.get("/*", (_, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});