require('dotenv').config();
//const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const logger = require('./middleware/logger');
const sbdb = require('./db');
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const venueRoutes = require("./routes/venueRoutes");
const skillLevelRoutes = require("./routes/skillLevelRoutes");
const activityRoutes = require("./routes/activityRoutes");
const intensityLevelRoutes = require("./routes/intensityLevelRoutes");

require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(logger);

// Connect to MongoDB using Mongoose, going to the DB called 'pickup'
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   dbName: 'pickup'
// });

// Server Routes
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