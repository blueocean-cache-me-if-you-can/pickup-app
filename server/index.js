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

// const eventController = require('./controllers/eventController');

const sendMail = require('./controllers/sendMail');


require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(logger);

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

// Function to send reminder emails at regular intervals
let lastReminderSent = Date.now();
function sendReminders(interval) {
  let period = interval ? process.env.EMAIL_REMINDER_INTERVAL_INITIAL_MINS : process.env.EMAIL_REMINDER_INTERVAL_SUBSEQUENT_MINS ;

  interval = interval || process.env.EMAIL_REMINDER_INTERVAL_SUBSEQUENT_MINS * 60 * 1000;
  let startDate = lastReminderSent
  lastReminderSent += interval;


  sendMail.sendEventReminders(startDate, lastReminderSent);

  //const oneYearLater = Date.UTC(new Date().getUTCFullYear() + 1, new Date().getUTCMonth(), new Date().getUTCDate());
  //sendMail.sendEventReminders(lastReminderSent, oneYearLater);

}
sendReminders(process.env.EMAIL_REMINDER_INTERVAL_INITIAL_MINS * 60 * 1000);
setInterval(sendReminders, process.env.EMAIL_REMINDER_INTERVAL_SUBSEQUENT_MINS * 60 * 1000);

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});