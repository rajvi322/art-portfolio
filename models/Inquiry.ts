import mongoose from "mongoose";

const InquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name."],
    },
    email: {
      type: String,
      required: [true, "Please provide an email."],
    },
    subject: {
      type: String,
      required: [true, "Please provide a subject."],
    },
    message: {
      type: String,
      required: [true, "Please provide a message."],
    },
    phone: {
      type: String,
      required: false,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["New", "Read", "Replied", "Archived"],
      default: "New",
    },
  },
  { timestamps: true }
);

if (mongoose.models.Inquiry) {
  delete mongoose.models.Inquiry;
}

const Inquiry = mongoose.model("Inquiry", InquirySchema);
export default Inquiry;
