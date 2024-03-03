const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
app.use("/uploads", express.static("uploads"));
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(bodyParser.json());

const mongoURI =
  "mongodb+srv://username:heslo@chatcluster.qkjrtbl.mongodb.net/?retryWrites=true&w=majority&appName=ChatCluster";
const dbName = "chat";
const collectionName = "messages";
const usersCollectionName = "users";
const videosCollectionName = "videos";
const imagesCollectionName = "images";
const reactionsCollectionName = "reactions";
const voiceCollectionName = "voice";
const profileCollectionName = "profile";

let db;
let messagesCollection;
let usersCollection;
let videosCollection;
let imagesCollection;
let reactionsCollection;
let voiceCollection;
let profileCollection;

MongoClient.connect(mongoURI, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to MongoDB");
    db = client.db(dbName);
    messagesCollection = db.collection(collectionName);
    usersCollection = db.collection(usersCollectionName);
    videosCollection = db.collection(videosCollectionName);
    imagesCollection = db.collection(imagesCollectionName);
    reactionsCollection = db.collection(reactionsCollectionName);
    voiceCollection = db.collection(voiceCollectionName);
    profileCollection = db.collection(profileCollectionName);
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, "your_secret_key", (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = user;
    next();
  });
};

io.on("connection", (socket) => {
  console.log("New client connected");

  if (!messagesCollection) {
    console.error("Error: messagesCollection is not initialized");
    socket.emit("error", "Server error");
    socket.disconnect(true);
    return;
  }

  messagesCollection.find().toArray((err, messages) => {
    if (err) {
      console.error("Error fetching messages from MongoDB:", err);
      socket.emit("error", "Server error");
      socket.disconnect(true);
      return;
    }
    socket.emit("messageHistory", messages);
  });

  socket.on("message", (message) => {
    console.log("New message:", message);

    messagesCollection
      .insertOne({
        from: message.logged,
        to: message.selected,
        text: message.text,
        timestamp: new Date(),
      })
      .then((result) => {
        console.log("Message inserted successfully:", result);

        io.emit("message", {
          from: message.logged,
          to: message.selected,
          text: message.text,
          timestamp: new Date(),
        });
      })
      .catch((err) => {
        console.error("Error saving message to MongoDB:", err);

        socket.emit("error", "Server error occurred while saving message.");
      });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const multer = require("multer");
const fs = require("fs");
const upload = multer({ dest: "uploads/video/" });
const imageUpload = multer({ dest: "uploads/images/" });
const voiceUpload = multer({ dest: "uploads/voice/" });
const profileUpload = multer({ dest: "uploads/profile/" });

app.post(
  "/upload-profile",
  profileUpload.single("profile"),
  async (req, res) => {
    try {
      const { user } = req.body;
      const { originalname: filename, path: filePath } = req.file;

      const newPath = `uploads/profile/${filename}`;

      fs.rename(filePath, newPath, (err) => {
        if (err) {
          console.error("Error moving file:", err);
          return res.status(500).send("Error uploading profile.");
        }
        console.log("File moved successfully.");
        res.status(200).send("profile uploaded successfully.");
      });

      const profileUpload = await profileCollection.insertOne({
        user: user,
        filename: filename,
      });
    } catch (error) {
      console.error("Error uploading profile:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

app.post("/upload-voice", voiceUpload.single("voice"), async (req, res) => {
  try {
    const { from, to } = req.body;
    const { originalname: filename, path: filePath } = req.file;

    console.log(from, to, filename);

    const newPath = `uploads/voice/${filename}`;

    fs.rename(filePath, newPath, (err) => {
      if (err) {
        console.error("Error moving file:", err);
        return res.status(500).send("Error uploading voice.");
      }
      console.log("File moved successfully.");

      res.status(200).send("Voice uploaded successfully.");
    });

    const voiceUpload = await voiceCollection.insertOne({
      from: from,
      to: to,
      filename: filename,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error uploading voice:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/upload-video", upload.single("video"), async (req, res) => {
  try {
    const { from, to } = req.body;
    const { originalname: filename, path: filePath } = req.file;
    const newPath = `uploads/video/${filename}`;

    fs.rename(filePath, newPath, (err) => {
      if (err) {
        console.error("Error moving file:", err);
        return res.status(500).send("Error uploading video.");
      }
      console.log("File moved successfully.");

      res.status(200).send("video uploaded successfully.");
    });

    const videoUpload = await videosCollection.insertOne({
      from: from,
      to: to,
      filename: filename,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/getvideos", async (req, res) => {
  const from = req.query.from;
  const to = req.query.to;
  console.log(from, to);

  try {
    const videosfrom = await videosCollection
      .find({ from: from, to: to })
      .toArray();
    const videosto = await videosCollection
      .find({ from: to, to: from })
      .toArray();

    res.status(200).json({ videos: [...videosfrom, ...videosto] });
  } catch (error) {
    console.error("Error getting videos:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/upload-image", imageUpload.single("image"), async (req, res) => {
  try {
    const { from, to } = req.body;
    const { originalname: filename, path: filePath } = req.file;
    const newPath = `uploads/images/${filename}`;

    fs.rename(filePath, newPath, (err) => {
      if (err) {
        console.error("Error moving file:", err);
        return res.status(500).send("Error uploading image.");
      }
      console.log("File moved successfully.");

      res.status(200).send("image uploaded successfully.");
    });

    const imageUpload = await imagesCollection.insertOne({
      from: from,
      to: to,
      filename: filename,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/getimages", async (req, res) => {
  const from = req.query.from;
  const to = req.query.to;
  console.log(from, to);

  try {
    const imagesfrom = await imagesCollection
      .find({ from: from, to: to })
      .toArray();
    const imagesto = await imagesCollection
      .find({ from: to, to: from })
      .toArray();

    res.status(200).json({ images: [...imagesfrom, ...imagesto] });
  } catch (error) {
    console.error("Error getting images:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/update-bio", async (req, res) => {
  try {
    const { username, bio } = req.body;

    const existingUser = await usersCollection.findOne({ username });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    await usersCollection.updateOne({ username }, { $set: { bio } });

    res.status(200).json({ message: "Bio updated successfully." });
  } catch (error) {
    console.error("Error updating user bio:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username, password are required." });
  }

  try {
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userData = {
      username,
      password: hashedPassword,
    };

    const result = await usersCollection.insertOne(userData);
    console.log(
      `Inserted ${result.insertedCount} document into the users collection.`
    );

    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    console.error("Error inserting user into the database:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/add-reaction", async (req, res) => {
  const { message, from, emoji } = req.body;

  try {
    const userData = {
      message,
      from,
      emoji,
    };

    const result = await reactionsCollection.insertOne(userData);
    console.log(
      `Inserted ${result.insertedCount} document into the users collection.`
    );

    res.status(201).json({ message: "Reaction added successfully." });
  } catch (error) {
    console.error("Error adding reaction:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  try {
    const user = await usersCollection.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const token = jwt.sign({ username: user.username }, "your_secret_key", {
      expiresIn: "1h",
    });

    res.status(200).json({ token, userId: user._id, username: user.username });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await usersCollection.find({}).toArray();

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/reactions", async (req, res) => {
  try {
    const reactions = await reactionsCollection.find({}).toArray();

    res.status(200).json({ reactions });
  } catch (error) {
    console.error("Error fetching reactions:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/profile", async (req, res) => {
  try {
    const profile = await profileCollection.find({}).toArray();
    res.status(200).json({ profile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/voices", async (req, res) => {
  try {
    const voices = await voiceCollection.find({}).toArray();
    res.status(200).json({ voices });
  } catch (error) {
    console.error("Error fetching voice:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/groupmessages", async (req, res) => {
  const { username } = req.query;

  try {
    const messages = await messagesCollection
      .find({ to: { $regex: new RegExp(`(?:^|,)${username}(?:,|$)`) } })
      .toArray();

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching group messages:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


app.get("/messages", async (req, res) => {
  const { loggedId, selectedId } = req.query;

  try {
    const messages = await messagesCollection
      .find({
        from: loggedId,
        to: selectedId,
      })
      .toArray();
    const messages2 = await messagesCollection
      .find({
        from: selectedId,
        to: loggedId,
      })
      .toArray();

    res.status(200).json({ messages: [...messages, ...messages2] });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
