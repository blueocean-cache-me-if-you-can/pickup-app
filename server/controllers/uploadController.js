const { Storage } = require('@google-cloud/storage');
const path = require('path');

exports.upload = (req, res) => {

  const storage = new Storage({
    projectId: process.env.GCS_PROJECT_ID,
    keyFilename: path.join(__dirname, process.env.PATH_TO_GCS_KEY),
  });

  const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

  if (!req.body.image || !req.body.filename) {
    return res.status(400).json({ error: "Image and filename are required" });
  }

  const buffer = Buffer.from(req.body.image, "base64");
  const file = bucket.file(req.body.filename);
  const stream = file.createWriteStream({
    metadata: {
      contentType: "image/jpeg",
    },
  });

  stream.on("error", (err) => {
    console.error("Error uploading to GCS:", err);
    res.status(500).json({ error: "Failed to upload image" });
  });

  stream.on("finish", async () => {
    try {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
      res.status(200).json({ url: publicUrl });
    } catch (err) {
      console.error("Error making file public:", err);
      res.status(500).json({ error: "Failed to make image public" });
    }
  });

  stream.end(buffer);
};