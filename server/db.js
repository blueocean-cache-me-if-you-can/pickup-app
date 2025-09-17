const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB using Mongoose, going to the DB called 'pickup'
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'pickup'
});
