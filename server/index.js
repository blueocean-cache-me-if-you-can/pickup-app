const express = require('express');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

// Routes
app.get('/', (req, res) => {
  res.send('Server is running!');
});

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});