const express = require("express");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../../client/dist')));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'pickup'
});

// using google cloud storage to upload images, create a storage instance
const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  keyFilename: path.join(__dirname, process.env.PATH_TO_GCS_KEY),
});
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

// Upload endpoint
app.post('/api/upload', uploadRoutes);

// Client routes
app.get("/*", (_, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

app.listen(4000, () => console.log("Server running on port 4000"));

//this is the test code for the react stuff:

  // create a test call to the upload API
  // const [selectedFile, setSelectedFile] = useState(null);

  // const handleFileChange = (e) => {
  //   setSelectedFile(e.target.files[0]);
  // };

  // const testUpload = async () => {
  //   if (!selectedFile) {
  //     alert('Please select a file first.');
  //     return;
  //   }
  //   const reader = new FileReader();
  //   reader.onloadend = async () => {
  //     const base64String = reader.result.split(',')[1];
  //     const response = await fetch('/api/upload', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         image: base64String,
  //         filename: "user-pfp/" + new Date().toISOString() + "-" + selectedFile.name,
  //       }),
  //     });
  //     const data = await response.json();
  //     console.log('Upload test response:', data);
  //   };
  //   reader.readAsDataURL(selectedFile);
  // };

  // // test for the upload API
  // return (
  //   <div>
  //     <input type='file' onChange={handleFileChange} />
  //     <button type='button' onClick={testUpload}>Test Upload API</button>
  //   </div>
  // );