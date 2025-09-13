const nodemailer = require("nodemailer");

require('dotenv').config();

async function testAuth() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.USER_EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
    },
  });

  try {
    await transporter.verify();
    console.log("✅ Gmail OAuth2 setup is working.");
  } catch (err) {
    console.error("❌ Gmail OAuth2 auth failed:");
    console.error(err);
  }
}

testAuth();