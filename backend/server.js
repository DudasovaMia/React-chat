const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
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
  "mongodb+srv://username:heslo@chatcluster.qkjrtbl.mongodb.net/?retryWrites=true&w=majority&appName=ChatCluster"; // Replace with your MongoDB URI
const dbName = "chat";
const collectionName = "messages";
const usersCollectionName = "users";

let db;
let messagesCollection;
let usersCollection;

MongoClient.connect(mongoURI, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to MongoDB");
    db = client.db(dbName);
    messagesCollection = db.collection(collectionName);
    usersCollection = db.collection(usersCollectionName); // Initialize usersCollection
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process if there's an error connecting to MongoDB
  });

// Middleware to authenticate users
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

  // Ensure messagesCollection is initialized before using it
  if (!messagesCollection) {
    console.error("Error: messagesCollection is not initialized");
    socket.emit("error", "Server error");
    socket.disconnect(true);
    return;
  }

  // Send existing messages to the client when they connect
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

    // Save the message to MongoDB along with the username and current timestamp
    messagesCollection
      .insertOne({
        sender: message.logged,
        recipient: message.selected,
        text: message.text,
        timestamp: new Date(),
      })
      .then((result) => {
        console.log("Message inserted successfully:", result);
        // Broadcast the new message to all connected clients
        io.emit("message", {
          sender: message.logged,
          recipient: message.selected,
          text: message.text,
          timestamp: new Date(),
        });
      })
      .catch((err) => {
        console.error("Error saving message to MongoDB:", err);
        // Emit an error event to the client
        socket.emit("error", "Server error occurred while saving message.");
      });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const multer = require("multer");
const fs = require("fs");
const upload = multer({ dest: "uploads/" }); // Destination folder for uploaded files

app.post("/upload-video", upload.single("video"), (req, res) => {
  // Access the uploaded file via req.file
  const videoFile = req.file;

  // Example: move the file to a different location
  fs.rename(videoFile.path, `path/to/save/${videoFile.originalname}`, (err) => {
    if (err) {
      console.error("Error moving file:", err);
      return res.status(500).send("Error uploading video.");
    }
    res.status(200).send("Video uploaded successfully.");
  });
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  try {
    // Check if the username already exists
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

    // Include the user ID in the response
    res.status(200).json({ token, userId: user._id, username: user.username }); // Assuming user._id is the user ID
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/users", async (req, res) => {
  try {
    // Retrieve users from the database
    const users = await usersCollection.find({}).toArray();
    // Send the users as a JSON response
    res.status(200).json({ users });
  } catch (error) {
    // Handle errors
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/messages", async (req, res) => {
  const { loggedId, selectedId } = req.query;

  try {
    // Fetch messages from MongoDB based on loggedId and selectedId
    const messages = await messagesCollection
      .find({
        sender: loggedId,
        recipient: selectedId,
      })
      .toArray();

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
