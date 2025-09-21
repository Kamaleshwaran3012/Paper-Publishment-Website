import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import cors from "cors";
import path from "path";
import axios from "axios"; 
import fs from "fs";
import { fileURLToPath } from "url";
import Publication from "./papers/Publications.js";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();
const router = express.Router();

const SERP_API_KEY = process.env.SERP_API_KEY;

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

// ================== ROUTES ==================
const authorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  authorId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  affiliation: { type: String }, // store Google Scholar affiliation
  createdAt: { type: Date, default: Date.now }
});

const Author = mongoose.model("Author", authorSchema);

async function fetchAuthorInfo(authorId) {
  try {
    const res = await axios.get("https://serpapi.com/search", {
      params: {
        engine: "google_scholar_author",
        author_id: authorId,
        api_key: SERP_API_KEY,
      },
    });

    // Extract name, affiliation, and publications
    const author = res.data.author || {};
    const name = author.name || "";
    const affiliation = author.affiliations || "";
    const publications = res.data.articles || [];

    return { name, affiliation, publications };
  } catch (err) {
    console.error("Error fetching author info:", err.message);
    return { name: "", affiliation: "", publications: [] };
  }
}


// ================= Verify Google Scholar ID =================
app.post("/verify-author-id", async (req, res) => {
  const { authorId } = req.body;

  try {
    const response = await axios.get("https://serpapi.com/search", {
      params: {
        engine: "google_scholar_author",
        author_id: authorId,
        api_key: SERP_API_KEY,
      },
    });

    const exists = response.data.author_id || (response.data.articles && response.data.articles.length > 0);
    res.json({ exists: !!exists });
  } catch (err) {
    console.error("Error verifying author ID:", err.message);
    res.status(500).json({ exists: false, error: "Failed to verify author ID" });
  }
});

// ================= Signup Route =================
app.post("/signup", async (req, res) => {
  const { name, authorId, password } = req.body;

  try {
    const existing = await Author.findOne({ authorId });
    if (existing)
      return res.status(400).json({ error: "Author ID already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const authorInfo = await fetchAuthorInfo(authorId);
    const affiliation = authorInfo.affiliation || "";

    const author = new Author({
      name,
      authorId,
      password: hashedPassword,
      affiliation,
    });

    await author.save();

    res.json({
      message: "User registered successfully",
      user: {
        id: author._id,
        name: author.name,
        authorId: author.authorId,
        affiliation: author.affiliation, // ✅ include this
      },
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: "Failed to register user" });
  }
});


app.post("/api/fetch-publications/:authorId", async (req, res) => {
  const { authorId } = req.params;

  try {
    const author = await Author.findOne({ authorId });
    if (!author) return res.status(404).json({ error: "Author not found" });

    const response = await axios.get("https://serpapi.com/search", {
      params: {
        engine: "google_scholar_author",
        author_id: authorId,
        api_key: SERP_API_KEY,
      },
    });

    const articles = response.data.articles || [];

    // Store publications in MongoDB and link to author
    const savedPublications = [];
    for (const article of articles) {
      // Avoid duplicate entries
      let existing = await Publication.findOne({ title: article.title, author: author._id });
      if (!existing) {
        const pub = new Publication({
          title: article.title,
          authors: article.authors || "",
          year: article.year || "",
          citation_count: article.cited_by.value,
          link: article.link || "",
          author: author._id,
        });
        await pub.save();
        savedPublications.push(pub);
      }
    }

    res.json({ message: "Publications fetched & stored", publications: savedPublications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch publications" });
  }
});

// Get all publications of an author
app.get("/api/my-publications/:authorId", async (req, res) => {
  try {
    const author = await Author.findOne({ authorId: req.params.authorId });
    if (!author) return res.status(404).json({ error: "Author not found" });

    const publications = await Publication.find({ author: author._id });
    res.json(publications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== GET ALL PAPERS (Library) ==========
app.get("/api/publications", async (req, res) => {
  try {
    const publications = await Publication.find();
    res.json(publications);
  } catch (err) {
    console.error("Error fetching publications:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// Example Node.js/Express login route
app.post("/login", async (req, res) => {
  const { authorId, password } = req.body;
  try {
    const author = await Author.findOne({ authorId });
    if (!author) return res.status(400).json({ error: "User not found" });

    const match = await bcrypt.compare(password, author.password);
    if (!match) return res.status(400).json({ error: "Invalid password" });

    res.json({
      user: {
        id: author._id,
        name: author.name,
        authorId: author.authorId,
        affiliation: author.affiliation, // ✅ include this
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
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

// Get all authors
app.get("/api/authors", async (req, res) => {
  try {
    const authors = await Author.find({}, { name: 1, authorId: 1 ,affiliation:1});
    res.json(authors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get author by authorId (Google Scholar ID)
app.get("/api/author/:authorId", async (req, res) => {
  try {
    const author = await Author.findOne({ authorId: req.params.authorId });
    if (!author) return res.status(404).json({ error: "Author not found" });
    res.json(author);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get publications of author by authorId
app.get("/api/my-publications/:authorId", async (req, res) => {
  try {
    const author = await Author.findOne({ authorId: req.params.authorId });
    if (!author) return res.status(404).json({ error: "Author not found" });

    const publications = await Publication.find({ author: author._id });
    res.json(publications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================== START SERVER ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
