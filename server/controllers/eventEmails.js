const mongoose = require('mongoose');
//const User = require('../models/user');
const Event = require('../models/event');

async function getEventPlayersWithEmails(eventId) {
  const event = await Event.findById(eventId).populate({
    path: 'players.userId',
    select: 'emailPrimary emailSecondary'
  }).lean();

  if (!event) return null;

  //console.log('Event with players:', JSON.stringify(event, null, 2));

  return {
    ...event,
    players: event.players.map(player => ({
      _id: player._id,
      emailPrimary: player.userId.emailPrimary,
      emailSecondary: player.userId.emailSecondary
    }))
  };
}

async function getEventsPlayersWithEmailsBetween(startTime, endTime) {
  const events = await Event.find({
    time: {
      $gte: startTime,
      $lt: endTime
    }
  }).populate({
    path: 'players.userId',
    select: 'emailPrimary emailSecondary'
  }).lean();

  const eventList = events.map(event => ({
    ...event,
    players: event.players.map(player => ({
      _id: player.userId._id,
      emailPrimary: player.userId.emailPrimary,
      emailSecondary: player.userId.emailSecondary
    }))
  }));

  //console.log('Event with players:', JSON.stringify(eventList, null, 2));

  return eventList;
}

// async function getEventsBetween(startTime, endTime) {
//   return await Event.find({
//     time: {
//       $gte: startTime,
//       $lte: endTime
//     }
//   }).lean();
// }

module.exports = {
//  getEventsBetween,
  getEventPlayersWithEmails,
  getEventsPlayersWithEmailsBetween
};