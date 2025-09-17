const venue = require('../models/venue');

exports.getVenues = async (req, res) => {
  try {
    const venues = await venue.find();
    res.status(200).json(venues);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch venues', details: err.message });
  }
};

exports.createVenue = async (req, res) => {
  try {
    const newVenue = new venue(req.body);
    const savedVenue = await newVenue.save();
    res.status(201).json(savedVenue);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create venue', details: err.message });
  }
};