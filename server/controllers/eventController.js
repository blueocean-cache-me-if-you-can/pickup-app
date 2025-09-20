const Event = require('../models/event');
const User = require('../models/user');
const Activity = require('../models/activity');
const IntensityLevel = require('../models/intensityLevel');
const SkillLevel = require('../models/skillLevel');
const { ObjectId } = require('mongodb');
const mail = require('./sendMail');
const { getEventPlayersWithEmails } = require('./eventEmails');

// Controller to get all events
exports.getEvents = async (req, res) => {
  try {
    let skip, limit;
    let { user_id, finished, page, count, coordinates, filter, sort, orderByDesc } = req.body;
    console.log(user_id, finished, page, count, coordinates, filter, sort, orderByDesc);

    const radius = filter?.distance * 1609.34 || 5000; // 5 km in meters
    const intensity = filter?.intensity || null;
    const skillLevel = filter?.skillLevel || null;
    const activity = filter?.activity || null;
    console.log(radius, intensity, skillLevel, activity);

    // Filtering

    const pipeline = [
      {
        $match: {
          // location: {$geoWithin: { $centerSphere: [[coordinates[0], coordinates[1]], radius / 6378100] }},
          ...(coordinates ? { location: { $geoWithin: { $centerSphere: [[coordinates[0], coordinates[1]], radius / 6378100] } } } : {}),
          ...(intensity ? { intensityId: { $in: Array.isArray(intensity) ? intensity.map(id => new ObjectId(id)) : [new ObjectId(intensity)] } } : {}),
          ...(skillLevel ? { skillId: { $in: Array.isArray(skillLevel) ? skillLevel.map(id => new ObjectId(id)) : [new ObjectId(skillLevel)] } } : {}),
          ...(activity ? { activityId: { $in: Array.isArray(activity) ? activity.map(id => new ObjectId(id)) : [new ObjectId(activity)] } } : {}),
          ...(user_id ? { 'players.userId': new ObjectId(user_id) } : {}),
          ...(finished ? { time: { $lt: new Date() } } : { time: { $gte: new Date() } })
        }
      }
    ];

    if (page && count) {
      skip = (parseInt(page) - 1) * parseInt(count);
      limit = parseInt(count);
    } else {
      skip = 0;
      limit = 10;
    }

    // Sorting

    let order;
    if (orderByDesc) {
      order = -1;
    } else {
      order = 1;
    }

    if (sort === 'date') {
      pipeline.push({ $sort: { time: order } });
    } else if (sort === 'distance') {
      pipeline.push(
        {
          $addFields: {
            distance: {
              $let: {
                vars: {
                  coords: { $arrayElemAt: ["$location.coordinates", 0] }
                },
                in: {
                  $multiply: [
                    3963.2, // Radius of the Earth in miles
                    {
                      $acos: {
                        $min: [
                          1,
                          {
                            $add: [
                              { $multiply: [
                                  { $sin: { $degreesToRadians: coordinates[1] } },
                                  { $sin: { $degreesToRadians: { $arrayElemAt: ["$location.coordinates", 1] } } }
                                ]
                              },
                              { $multiply: [
                                  { $cos: { $degreesToRadians: coordinates[1] } },
                                  { $cos: { $degreesToRadians: { $arrayElemAt: ["$location.coordinates", 1] } } },
                                  { $cos: { $degreesToRadians: { $subtract: [ { $arrayElemAt: ["$location.coordinates", 0] }, coordinates[0] ] } } }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        { $sort: { distance: order } }
      );
    }

    // Fetch events based on query
    console.log('Aggregation Pipeline:', JSON.stringify(pipeline, null, 2));

    let events = await Event.aggregate(pipeline).skip(skip).limit(limit).exec();
    for (let event of events) {
      if (event.intensity && Object.keys(event.intensity).length > 0) {
        event.intensity = event.intensity[0];
      }
      if (event.skillLevel && Object.keys(event.skillLevel).length > 0) {
        event.skillLevel = event.skillLevel[0];
      }
      if (event.activity && Object.keys(event.activity).length > 0) {
        event.activity = event.activity[0];
      }
      event.coordinates = event.location.coordinates;
      delete event.location;
    }
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events', details: err.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event', details: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await getEventPlayersWithEmails(req.params.id).then(eventWithEmails => {
      eventWithEmails.players.forEach(userObj => {
        mail.sendMailWithHtmlFileAndParams({
          recipients: [{ email: userObj.emailPrimary }],
          subject: 'An Event You\'ve joined has Updated on PicknRoll!',
          text: `Hello ${userObj.firstName},\n\nThe event with the title: ${updatedEvent.title} has been updated.\n\nBest regards,\nBlue Ocean Pickup Team`,
          htmlFile: 'updateEvent.html',
          htmlParams: { "PICKNROLL_URL": `${process.env.HOST}/login` }
        });
      });
    });

    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update event', details: err.message });
  }
};

exports.updateEventPlayer = async (req, res) => {
  try {
    const user = await User.findById(req.query.user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if user is already a player
    if (event.players.some(player => player.userId.toString() === req.query.user_id)) {
      // if they are remove them from player list
      event.players = event.players.filter(player => player.userId.toString() !== req.query.user_id);
      const updatedEvent = await event.save();
      return res.status(200).json(updatedEvent);
    }

    event.players.push({ userId: req.query.user_id, displayName: user.displayName || user.firstName + ' ' + user.lastName });
    const updatedEvent = await event.save();

    mail.sendMailWithHtmlFileAndParams({
      recipients: [{ email: user.emailPrimary }],
      subject: 'You joined an Event on PicknRoll!',
      text: `Hello ${user.firstName},\n\nThank you for joining the event: ${event.title}.\n\nBest regards,\nBlue Ocean Pickup Team`,
      htmlFile: 'joinEvent.html',
      htmlParams: { "PICKNROLL_URL": `${process.env.HOST}/login` }
    });

    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add player to event', details: err.message });
  }
}

exports.createEvent = async (req, res) => {
  try {
    const user = await User.findById(new ObjectId(req.body.user_id));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const newEvent = new Event({
      title: req.body.title,
      owner: {
        userId: new ObjectId(req.body.user_id),
        displayName: user.displayName ? user.displayName : user.firstName + ' ' + user.lastName
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
      activityId: new ObjectId(req.body.activityId),
      intensityId: new ObjectId(req.body.intensityId),
      skillId: new ObjectId(req.body.skillId),
      minPlayers: req.body.minPlayers,
      maxPlayers: req.body.maxPlayers,
      players: [
        { userId: req.body.user_id, displayName: user.displayName ? user.displayName : user.firstName + ' ' + user.lastName }
      ]
    });
    const savedEvent = await newEvent.save();

    mail.sendMailWithHtmlFileAndParams({
      recipients: [{ email: user.emailPrimary }],
      subject: 'You created an Event on PicknRoll!',
      text: `Success ${user.firstName}!\n\nYou created the event: ${newEvent.title}.\n\nBest regards,\nBlue Ocean Pickup Team`,
      htmlFile: 'createEvent.html',
      htmlParams: { "PICKNROLL_URL": `${process.env.HOST}/login` }
    });

    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create event', details: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    console.log('req.query', req.query);
    console.log('req.path', req.path);
    if (!req.query.id) {
      req.query.id = req.path.split('/').pop()
    }
    console.log('req.query.event_id', req.query.id);
    const deletedEvent = await Event.findByIdAndDelete(req.query.id);
    console.log('deletedEvent', deletedEvent);
    if (deletedEvent === undefined) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await getEventPlayersWithEmails(req.query.event_id).then(eventWithEmails => {
      eventWithEmails.players.forEach(userObj => {
        mail.sendMailWithHtmlFileAndParams({
          recipients: [{ email: userObj.emailPrimary }],
          subject: 'An Event You\'ve joined has been Canceled on PicknRoll!',
          text: `Hello ${userObj.firstName},\n\nThe event with the title: ${deletedEvent.title} has been canceled.\n\nBest regards,\nBlue Ocean Pickup Team`,
          htmlFile: 'eventCanceled.html',
          htmlParams: { "PICKNROLL_URL": `${process.env.HOST}/login` }
        });
      });
    });

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete event', details: err.message });
  }
}
