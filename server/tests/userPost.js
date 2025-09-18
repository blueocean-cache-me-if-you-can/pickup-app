const axios = require('axios');
const bcrypt = require('bcrypt');

// Schema for ref
// const userSchema = new mongoose.Schema({
//   displayName: { type: String },
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   emailPrimary: { type: String, required: true, unique: true },
//   emailSecondary: { type: String },
//   password: { type: String, required: true },
//   address: { type: String, required: true },
//   photo: { type: String },
//   atLeastEighteen: { type: Boolean, required: true },
// });

const newUser = {
  displayName: 'carrotCake42',
  firstName: 'Todd',
  lastName: 'Baker',
  emailPrimary: 'toddbaker@example.com',
  emailSecondary: 'toddbaker.double@example.com',
  password: 'ilikebaking010',
  address: '1251 16th St, Denver, CO 80202',
  photo: 'http://example.com/photo.jpg',
  atLeastEighteen: true
}

axios.post('http://localhost:3000/api/users/signup', newUser)
  .then(response => {
    console.log('User created:', response.data);
  })
  .catch(error => {
    console.error('Error creating event:', error.response ? error.response.data : error.message);
  });