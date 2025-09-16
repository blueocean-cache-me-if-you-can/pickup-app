const Event = require('../models/event');
const User = require('../models/user');

// Controller to get all events
exports.getEvents = async (req, res) => {
  try {
    const radius = req.query.filter.distance || 5000; // 5 km in meters
    const query = {};

    if (req.query.coordinates && radius) {
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(req.query.coordinates[0]), parseFloat(req.query.coordinates[1])]
          },
          $maxDistance: radius // in meters
        }
      };
    }

    if (req.sort === 'date') {
      query.time = {};
      // start date is now, and the end date is forever
      query.time.$gte = new Date();
      query.time.$lte = new Date('9999-12-31');
    }

    const filteredEvents = await Event.find(query)
      .populate('activityId')
      .populate('intensityId')
      .populate('skillId')
      .populate('owner.userId', 'displayName')
      .populate('players.userId', 'displayName');

    res.status(200).json(filteredEvents);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events', details: err.message });
  }
};

exports.createEvent = async (req, res) => {
  // this is an example of what the info: title, userId, activity_id, skill_id, intensity_id, brief_description, description, additional_info, time, address, location (lat, long), minPlayers, maxPlayers; like so:
  const unformatedEvent = {
    title: "Pick Up Pickleball Game @ Mile Hi Pickleball",
    userId: null,
    photo: "https://as2.ftcdn.net/v2/jpg/04/20/26/01/1000_F_420260100_aOyfSD6bs6l1yezMPNyEd6gYREDMPF2q.jpg",
    activityId: null,
    skillId: null,
    intensityId: null,
    brief_description: "A pick up game, 2 on 2, at the courts behind the school",
    description: "We will meet up at the courts, the games shouldn't last longer than 2 hours so don't forget to bring water and a snack. If you want to play again or some other time please message me @(303) 704-9999",
    additional_info: "Go through the gate on the East side of the parking lot, it should be open",
    time: null,
    coordinates: [-104.8667063, 39.7700105],
    address: "3700 Havana St STE 305, Denver, CO 80239",
    minPlayers: 4,
    maxPlayers: 8
  }
  // make it into the schema format and save to db
  try {
    const user = await User.findById(req.body.user_id);
    const newEvent = new Event({
      title: req.body.title,
      owner: {
        userId: req.body.user_id,
        displayName: user ? user.displayName : 'Anonymous'
      },
      brief_description: req.body.brief_description,
      description: req.body.description,
      additional_info: req.body.additional_info,
      photo: req.body.photo,
      time: req.body.time,
      address: req.body.address,
      location: {
        type: "Point",
        coordinates: req.body.coordinates
      },
      activityId: req.body.activityId,
      intensityId: req.body.intensityId,
      skillId: req.body.skillId,
      minPlayers: req.body.minPlayers,
      maxPlayers: req.body.maxPlayers,
      players: []
    });
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create event', details: err.message });
  }
};