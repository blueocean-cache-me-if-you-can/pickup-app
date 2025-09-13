const express = require("express");
const axios = require("axios");

require("dotenv").config();


(async () => {
  const open = (await import("open")).default;
  const app = express();

  // Step 1: Redirect user to Google's consent screen
  app.get("/", (req, res) => {
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", process.env.CLIENT_ID);
    authUrl.searchParams.set("redirect_uri", process.env.REDIRECT_URI);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", "https://mail.google.com/"); // Gmail full access
    authUrl.searchParams.set("access_type", "offline"); // ensures refresh token
    authUrl.searchParams.set("prompt", "consent"); // forces Google to give refresh token
    res.redirect(authUrl.toString());
  });

  // Step 2: Exchange code for tokens
  app.get("/oauth2callback", async (req, res) => {
    const code = req.query.code;
    if (!code) return res.send("No code returned");

    try {
      const tokenRes = await axios.post("https://oauth2.googleapis.com/token", null, {
        params: {
          code,
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          redirect_uri: process.env.REDIRECT_URI,
          grant_type: "authorization_code",
        },
      });

      const { access_token, refresh_token } = tokenRes.data;
      res.send(`Access Token: ${access_token}<br>Refresh Token: ${refresh_token}`);
      console.log("Refresh Token:", refresh_token);
    } catch (err) {
      console.error(err.response?.data || err.message);
      res.send("Error exchanging code for tokens");
    }
  });

  app.listen(process.env.PORT, () => {
    console.log(`Server started at http://localhost:${process.env.PORT}`);
    console.log("Opening browser for consent...");
    open(`http://localhost:${process.env.PORT}/`);
  });
})();