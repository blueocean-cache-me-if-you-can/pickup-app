const axios = require('axios');

const newEvent = {
  title: "Pick Up Pickleball Game @ Alpine High School",
  owner: {
    userId: null,
    displayName: "John Doe"
  },
  photo: "http://example.com/event-photo.jpg",
  activityId: null,
  skillId: null,
  intensityId: null,
  brief_description: "A pick up game, 2 on 2, at the courts behind the school",
  description: "We will meet up at the courts, the games shouldn't last longer than 2 hours so don't forget to bring water and a snack. If you want to play again or some other time please message me @(303) 704-9999",
  additional_info: "Go through the gate on the East side of the parking lot, it should be open",
  time: null,
  locationName: "Alpine High School, Denver, CO",
  location: "39.7392, 104.98494",
  minPlayers: 4,
  maxPlayers: 8
}

function postEvent() {
  axios.post('http://localhost:3000/api/events', newEvent)
    .then(response => {
      console.log('Event created:', response.data);
    })
    .catch(error => {
      console.error('Error creating event:', error.response ? error.response.data : error.message);
    });
}

axios.get('http://localhost:3000/api/activities')
  .then(response => {
    newEvent.activityId = response.data[0]._id; // Assuming the first activity is Pickleball
    return axios.get('http://localhost:3000/api/skillLevels');
  })
  .then(response => {
    newEvent.skillId = response.data[0]._id; // Assuming the first skill level is Beginner
    return axios.get('http://localhost:3000/api/intensityLevels');
  })
  .then(response => {
    newEvent.intensityId = response.data[0]._id; // Assuming the first intensity level is Casual
    return axios.get('http://localhost:3000/api/users');
  })
  .then(response => {
    newEvent.owner.userId = response.data[0]._id; // Assuming the first user is John Doe
    newEvent.time = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Set event time to one week from now
  })
  .catch(error => {
    console.error('Error fetching IDs:', error.response ? error.response.data : error.message);
  })
  .finally(() => {
    if (newEvent.activityId && newEvent.skillId && newEvent.intensityId && newEvent.location && newEvent.time) {
      postEvent();
    } else {
      console.error('Failed to set all required IDs for the event.');
    }
  });
