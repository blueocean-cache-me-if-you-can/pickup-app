const nodemailer = require("nodemailer");
require('dotenv').config();
const axios = require("axios");

async function getAccessToken() {
  const res = await axios.post("https://oauth2.googleapis.com/token", null, {
    params: {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      refresh_token: process.env.REFRESH_TOKEN,
      grant_type: "refresh_token"
    },
  });
  return res.data.access_token;
}

async function sendMail() {
  try {
    //const accessToken = await getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.USER_EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
      },
    });

    const mailOptions = {
      from: `Pick Up App <${process.env.USER_EMAIL}>`,
      to: "tworedfrog2@gmail.com",
      subject: "Pick Up App Test Email",
      text: "Your pick up game is scheduled for today at 6 PM. See you there!",
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result.response);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

sendMail();