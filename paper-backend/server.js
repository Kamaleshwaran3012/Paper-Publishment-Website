import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import cors from "cors";
import path from "path";
import axios from "axios"; 
import fs from "fs";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors()); // allow requests from frontend

// ================== MONGODB CONNECTION ==================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB Error:", err));

// ================== MODELS ==================

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,  // hashed
  createdAt: { type: Date, default: Date.now }
}, { collection: "users" });

const User = mongoose.model("User", userSchema);

// Paper Schema
const paperSchema = new mongoose.Schema({
  title: String,
  abstract: String,
  fileData: String,
  fileName: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  uploadedAt: { type: Date, default: Date.now }
}, { collection: "paper" });

const Paper = mongoose.model("Paper", paperSchema);

// ================== ROUTES ==================

// Signup user
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Signup request body:", req.body);

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const hashedPass = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPass });
    await user.save();

    console.log("✅ User saved:", user);

    res.json({ message: "User registered successfully", user: { _id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload paper
app.post("/upload", async (req, res) => {
  try {
    const { userId, title, abstract, fileName, fileBase64 } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const paper = new Paper({
      title,
      abstract,
      fileName,
      fileData: fileBase64,  // store Base64 string in DB
      author: user._id
    });
    await paper.save();

    res.json({ message: "Paper uploaded", paper });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== GET ALL PAPERS (Library) ==========
app.get("/papers", async (req, res) => {
  try {
    const papers = await Paper.find().populate("author", "name email");
    res.json(papers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== GET MY PAPERS ==========
app.get("/my-papers/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const papers = await Paper.find({ author: userId }).populate("author", "name email");
    res.json(papers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Example Node.js/Express login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });
   const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

  res.json({ user });
});
app.get("/authors-with-papers", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide passwords

    // For each user, find their papers
    const usersWithPapers = await Promise.all(
      users.map(async (user) => {
        const papers = await Paper.find({ author: user._id });
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          papers: papers.map(p => ({
            id: p._id,
            title: p.title,
            abstract: p.abstract,
            fileName: p.fileName,
            fileUrl: p.fileUrl,
            uploadedAt: p.uploadedAt,
          }))
        };
      })
    );

    res.json(usersWithPapers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
const uploadDir = path.join(__dirname, "papers");

// Download route
app.get("/download/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(uploadDir, fileName);

  if (fs.existsSync(filePath)) {
    res.download(filePath); // Forces download
  } else {
    res.status(404).send("❌ File not found");
  }
});
// Example: Serve a PDF stored on disk
app.get("/view/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, "papers", fileName);

  if (fs.existsSync(filePath)) {
    res.setHeader("Content-Type", "application/pdf"); // adjust MIME type
    res.sendFile(filePath);
  } else {
    res.status(404).send("File not found");
  }
});
app.get("/view/:paperId", async (req, res) => {
  const paper = await Paper.findById(req.params.paperId);
  if (!paper) return res.status(404).send("Paper not found");

  res.setHeader("Content-Type", "application/pdf");
  res.send(paper.fileData); // assuming fileData is a Buffer
});
app.use(cors());

// Replace with your SerpApi key
const SERP_API_KEY = "d79c2438a5b436dfc1ca2c92db123ed89c06653f198d4f5719747b878f544df8";

// Endpoint to fetch author details from Google Scholar
app.get("/api/author/:authorId", async (req, res) => {
  const authorId = req.params.authorId;

  try {
    const response = await axios.get("https://serpapi.com/search", {
      params: {
        engine: "google_scholar_author",
        author_id: authorId,
        num:100,
        api_key: SERP_API_KEY,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching author info:", error.message);
    res.status(500).json({ error: "Failed to fetch author info" });
  }
});

// ================== START SERVER ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
