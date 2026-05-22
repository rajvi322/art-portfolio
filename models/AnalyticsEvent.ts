import mongoose from "mongoose";

const AnalyticsEventSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["page_view", "artwork_view", "social_click", "inquiry"],
      required: true,
      index: true,
    },
    path: {
      type: String,
      default: "",
    },
    artwork: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artwork",
      required: false,
    },
    label: {
      type: String,
      default: "",
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AnalyticsEventSchema.index({ createdAt: -1 });

// Delete models if already defined (prevent Next.js HMR issues)
if (mongoose.models.AnalyticsEvent) {
  delete mongoose.models.AnalyticsEvent;
}

const AnalyticsEvent = mongoose.model("AnalyticsEvent", AnalyticsEventSchema);
export default AnalyticsEvent;
