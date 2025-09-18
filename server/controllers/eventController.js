const Event = require('../models/event');
const User = require('../models/user');
const Activity = require('../models/activity');
const IntensityLevel = require('../models/intensityLevel');
const SkillLevel = require('../models/skillLevel');

// Controller to get all events
exports.getEvents = async (req, res) => {
  try {
    // {
    //   "user_id": 123145634,
    //   "finished": false,
    //   "page": 1,
    //   "count": 2,
    //   "sort": "skillLevel", // e.g. skillLevel, intensity, activity
    //   "orderByDesc": true , //
    //   "coordinates": [27.13728, -10.362738],
    //   "filter": [
    //     { "skillLevel" :[401,402] },  // e.g. [401, 402, 403]
    //     { "intensity" :[301] },  // e.g. [301, 302, 303]
    //     { "activity" :[502, 504] },  // e.g. [502, 503, 504]
    //     { "distance" :3 } // e.g. <= 3 (miles)
    //   ]
    // }

    const radius = req.query?.filter?.distance || 5000; // 5 km in meters
    const { user_id, finished, page, count, coordinates, filter, sort, orderByDesc } = req.query;
    const pipeline = [];

    // Filtering

    if (coordinates) {
      pipeline.push({
        $geoNear: {
          near: { type: "Point", coordinates: [parseFloat(coordinates[0]), parseFloat(coordinates[1])] },
          distanceField: "dist.calculated",
          spherical: true
        }
      });
    }

    if (user_id) {
      pipeline.push({ $match: { user_id: user_id } });
    }

    if (finished) {
      if (finished === 'true') {
        pipeline.push({ $match: { time: { $lt: new Date() } } });
      } else {
        pipeline.push({ $match: { time: { $gte: new Date() } } });
      }
    }

    if (page && count) {
      skip = (parseInt(page) - 1) * parseInt(count);
      limit = parseInt(count);
    } else {
      skip = 0;
      limit = 10;
    }

    // Sorting

    let order;
    if (req.query.orderByDesc) {
      order = -1;
    } else {
      order = 1;
    }

    if (sort === 'date' || sort === '' || !sort) {
      pipeline.push({ $sort: { time: order } });
    } else if (sort === 'intensity') {
      pipeline.push(
        {
          $lookup: {
            from: "intensitylevels",
            localField: "intensityId",
            foreignField: "_id",
            as: "intensity"
          }
        },
        { $unwind: "$intensity" },
        { $sort: { "intensity.displayOrder": order } }
      );
    } else if (sort === 'skillLevel') {
      pipeline.push(
        {
          $lookup: {
            from: "skilllevels",
            localField: "skillId",
            foreignField: "_id",
            as: "skillLevel"
          }
        },
        { $unwind: "$skillLevel" },
        { $sort: { "skillLevel.displayOrder": order } }
      );
    } else if (sort === 'activity') {
      pipeline.push(
        {
          $lookup: {
            from: "activities",
            localField: "activityId",
            foreignField: "_id",
            as: "activity"
          }
        },
        { $unwind: "$activity" },
        { $sort: { "activity.name": order } }
      );
    }

    console.log('Pipeline:', JSON.stringify(pipeline, null, 2));

    const intensityId = filter?.intensity || null;
    const skillLevelId = filter?.skillLevel || null;
    const date = filter?.date || null;

    // Fetch events based on query

    console.log(
      [
      {
        $match: {
          ...(intensityId ? { intensityId: new ObjectId(intensityId) } : {}),
          ...(skillLevelId ? { skillLevelId: new ObjectId(skillLevelId) } : {}),
          ...(date ? { date: { $gte: new Date(date) } } : {})
        }
      },
      ...pipeline
    ]
    );
    const events = await Event.aggregate(pipeline).skip(skip).limit(limit).exec();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events', details: err.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
      // .populate('activityId')
      // .populate('intensityId')
      // .populate('skillId');
      // .populate('owner.userId', 'displayName')
      // .populate('players.userId', 'displayName');
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event', details: err.message });
  }
};

exports.createEvent = async (req, res) => {
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
      players: [
        { userId: req.body.user_id, displayName: user ? user.displayName : 'Anonymous' }
      ]
    });
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create event', details: err.message });
  }
};