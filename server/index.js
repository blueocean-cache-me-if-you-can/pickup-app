const express = require('express');
const logger = require('./middleware/logger');
const path = require('path');
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const venueRoutes = require("./routes/venueRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const { Storage } = require('@google-cloud/storage');
const mongoose = require('mongoose');

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

// Connecting to google cloud storage to upload images, creating a storage instance
const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  keyFilename: path.join(__dirname, process.env.PATH_TO_GCS_KEY),
});
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

// Server Routes
app.use('/api/upload', uploadRoutes);
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