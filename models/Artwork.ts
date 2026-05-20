import mongoose from "mongoose";

const ArtworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title for this artwork."],
      maxlength: [60, "Title cannot be more than 60 characters"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category."],
      enum: ["watercolors", "pencilcolors", "acrylics", "oil colors"],
    },
    year: {
      type: String,
      required: [true, "Please provide a year."],
    },
    coverImage: {
      type: String,
      required: [true, "Please provide a cover image URL."],
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Published", "Draft"],
      default: "Published",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Artwork || mongoose.model("Artwork", ArtworkSchema);
