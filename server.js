const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// Define the MongoDB URI
const MONGO_URI =
  process.env.MONGO_URI || "mongodb+srv://frandedeseo:12rQM2LWDP7LW27G@cluster0.u8cls.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");

    // Start the server only after a successful database connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
  });

const historySchema = new mongoose.Schema(
  {
    subject: String,
    created: String,
    content: String,
  },
  { _id: false }
);

const childrenSchema = new mongoose.Schema(
  {
    subject: String,
    created: String,
    history: { type: [historySchema], default: undefined },
    content: String,
    children: { type: [this], default: undefined },
  },
  { _id: false }
);

const extractedDataSchema = new mongoose.Schema({
  nr: String,
  folders: { type: [String], default: undefined },
  tags: { type: [String], default: undefined },
  history: { type: [historySchema], default: undefined },
  children: { type: [childrenSchema], default: undefined },
});

const ExtractedData = mongoose.model("ExtractedData", extractedDataSchema);

// Define routes
app.get("/post/:nr", async (req, res) => {
  try {
    const nr = req.params.nr;
    const post = await ExtractedData.findOne({ nr: nr });
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    console.error("Error fetching post:", error); // Log the error
    res.status(500).json({ error: "Failed to fetch post" });
  }
});
