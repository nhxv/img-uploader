const cloudinary = require("cloudinary").v2;
cloudinary.config({ 
  cloud_name: "dvktw5axq", 
  api_key: "179885626132961", 
  api_secret: "1XY_-Ypv88piKPlqlJQb5Cph1pw" 
});
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "deliany",
  },
});
const multer = require("multer");
const upload = multer({storage: storage});

const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors({origin: "https://nhxv-img-uploader.herokuapp.com"}));

app.post("/api/image", upload.single("image"), async (req, res) => {
  return res.json({image: req.file.path});
});

app.get("/", (req, res) => {
  res.send("<h1>Hello from rest</h1>");
})

app.listen(process.env.PORT || 4000);