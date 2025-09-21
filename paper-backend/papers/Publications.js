import mongoose from "mongoose";

const publicationSchema = new mongoose.Schema({
  title: String,
  authors: String,
  year: String,
  citation_count: Number,
  link: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "Author" },
  fetchedAt: { type: Date, default: Date.now },
});

const Publication = mongoose.model("Publication", publicationSchema, "publications");

export default Publication;
