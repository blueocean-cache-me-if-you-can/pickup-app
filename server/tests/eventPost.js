const axios = require('axios');

const newEvent = {
  title: "Pick Up Pickleball Game @ Alpine High School",
  ownerId: 12314125152,
  sportId: 501,
  skillId: 405,
  intensityId: 302,
  brief_description: "A pick up game, 2 on 2, at the courts behind the school",
  description: "We will meet up at the courts, the games shouldn't last longer than 2 hours so don't forget to bring water and a snack. If you want to play again or some other time please message me @(303) 704-9999",
  additional_info: "Go through the gate on the East side of the parking lot, it should be open",
  time: null,
  location_name: "Alpine High School, Denver, CO",
  location: "39.7392, 104.98494",
  minPlayers: 4,
  maxPlayers: 8,
  players: [
    { user_id: 12314125152, display_name: "John Smith"},
    { user_id: 23634513413, display_name: "Tina Smith"},
    { user_id: 34573456145, display_name: "Kirk Davis"}
  ]
}

axios.post('http://localhost:3000/api/events', newEvent)
  .then(response => {
    console.log('Event created:', response.data);
  })
  .catch(error => {
    console.error('Error creating event:', error.response ? error.response.data : error.message);
  });