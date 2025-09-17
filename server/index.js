
require('dotenv').config();
const express = require('express');
const logger = require('./middleware/logger');
const sbdb = require('./db');
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const venueRoutes = require("./routes/venueRoutes");
const skillLevelRoutes = require("./routes/skillLevelRoutes");
const activityRoutes = require("./routes/activityRoutes");
const intensityLevelRoutes = require("./routes/intensityLevelRoutes");
const path = require('path');
const uploadRoutes = require("./routes/uploadRoutes");
const { Storage } = require('@google-cloud/storage');


require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(logger);


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
app.use("/api/skillLevels", skillLevelRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/intensityLevels", intensityLevelRoutes);

// Client routes
app.get("/*", (_, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});