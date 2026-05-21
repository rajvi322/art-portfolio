import mongoose from "mongoose";

const VisitorSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    ipHash: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    device: {
      type: String,
      enum: ["Desktop", "Mobile", "Tablet", "Unknown"],
      default: "Unknown",
    },
    browser: {
      type: String,
      default: "Unknown",
    },
    os: {
      type: String,
      default: "Unknown",
    },
    country: {
      type: String,
      default: "Unknown",
    },
    city: {
      type: String,
      default: "Unknown",
    },
    referrer: {
      type: String,
      default: "Direct",
    },
  },
  { timestamps: true }
);

// Delete models if already defined (prevent Next.js HMR issues)
if (mongoose.models.Visitor) {
  delete mongoose.models.Visitor;
}

const Visitor = mongoose.model("Visitor", VisitorSchema);
export default Visitor;
