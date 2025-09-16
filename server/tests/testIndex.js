const express = require("express");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'pickup'
});

const storage = new Storage({
  keyFilename: path.join(__dirname, "gcs-key.json"), // service account
  projectId: "focused-brace-472020-h2",
});
const bucket = storage.bucket("pickup-app");

// route: frontend asks for a signed URL
app.get("/upload", async (req, res) => {
  const filename = `image-${Date.now()}.png`; // generate unique filename
  const file = bucket.file(filename);

  const [url] = await file.getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 1 * 60 * 1000, // 1 min
    contentType: "image/png",
  });

  res.json({ uploadUrl: url, fileName: filename });
});

// Client routes
app.get("/*", (_, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

app.listen(4000, () => console.log("Server running on port 4000"));