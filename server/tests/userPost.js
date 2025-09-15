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
  displayName: 'johndoe',
  firstName: 'John',
  lastName: 'Doe',
  emailPrimary: 'john.doe@example.com',
  emailSecondary: 'john.doe+secondary@example.com',
  password: 'securepassword',
  address: '123 Main St, Anytown, USA',
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