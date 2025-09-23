import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import cors from "cors";
import path from "path";
import axios from "axios"; 
import { fileURLToPath } from "url";
import Publication from "./papers/Publications.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const SERP_API_KEY = process.env.SERP_API_KEY;

app.use(express.json());
app.use(cors());

// ================== MONGODB CONNECTION ==================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Error:", err));

// ================== MODELS ==================
const authorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  authorId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  affiliation: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Author = mongoose.model("Author", authorSchema);

// ================== HELPER FUNCTIONS ==================
async function fetchAuthorInfo(authorId) {
  try {
    const res = await axios.get("https://serpapi.com/search", {
      params: {
        engine: "google_scholar_author",
        author_id: authorId,
        api_key: SERP_API_KEY,
      },
    });
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

// Fetch all publications with pagination
async function fetchAllPublications(authorId, authorDbId) {
  let start = 0;
  const savedPublications = [];

  while (true) {
    const response = await axios.get("https://serpapi.com/search", {
      params: {
        engine: "google_scholar_author",
        author_id: authorId,
        api_key: SERP_API_KEY,
        start: start,
      },
    });

    const articles = response.data.articles || [];
    if (!articles.length) break; // no more articles

    for (const article of articles) {
      const exists = await Publication.findOne({ title: article.title});
      if (!exists) {
        const pub = new Publication({
          title: article.title,
          authors: article.authors || "",
          year: article.year || "",
          citation_count: article.cited_by?.value || 0,
          link: article.link || "",
          author: authorDbId,
        });
        await pub.save();
        savedPublications.push(pub);
      }
    }

    start += articles.length;
  }

  return savedPublications;
}

// ================== ROUTES ==================

// Verify Google Scholar ID
app.post("/verify-author-id", async (req, res) => {
  const { authorId } = req.body;
  try {
    const response = await axios.get("https://serpapi.com/search", {
      params: { engine: "google_scholar_author", author_id: authorId, api_key: SERP_API_KEY },
    });
    const exists = response.data.author_id || (response.data.articles && response.data.articles.length > 0);
    res.json({ exists: !!exists });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ exists: false, error: "Failed to verify author ID" });
  }
});

// Signup Route
app.post("/signup", async (req, res) => {
  const { name, authorId, password } = req.body;
  try {
    if (await Author.findOne({ authorId })) return res.status(400).json({ error: "Author ID already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const authorInfo = await fetchAuthorInfo(authorId) || { name: name, affiliation: "" };
    const author = new Author({ name, authorId, password: hashedPassword, affiliation: authorInfo.affiliation });
    await author.save();

    // Save initial publications
    await fetchAllPublications(authorId, author._id);

    res.json({
      message: "User registered successfully",
      user: { id: author._id, name: author.name, authorId: author.authorId, affiliation: author.affiliation }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// Login Route with publication update
app.post("/login", async (req, res) => {
  const { authorId, password } = req.body;
  try {
    const author = await Author.findOne({ authorId });
    if (!author) return res.status(400).json({ error: "User not found" });

    const match = await bcrypt.compare(password, author.password);
    if (!match) return res.status(400).json({ error: "Invalid password" });

    // Fetch any new publications on login
    await fetchAllPublications(authorId, author._id);

    res.json({
      user: { id: author._id, name: author.name, authorId: author.authorId, affiliation: author.affiliation }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

// Get all authors
app.get("/api/authors", async (req, res) => {
  try {
    const authors = await Author.find({}, { name: 1, authorId: 1, affiliation: 1 });
    res.json(authors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get author by Google Scholar ID
app.get("/api/author/:authorId", async (req, res) => {
  try {
    const author = await Author.findOne({ authorId: req.params.authorId });
    if (!author) return res.status(404).json({ error: "Author not found" });
    res.json(author);
  } catch (err) {
    res.status(500).json({ error: err.message });
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

// Get all publications (library)
app.get("/api/publications", async (req, res) => {
  try {
    const publications = await Publication.find();
    res.json(publications);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
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
          citation_count: article.cited_by?.value || 0,
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

// ================== START SERVER ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
