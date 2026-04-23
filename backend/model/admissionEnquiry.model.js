const mongoose = require("mongoose");

const admissionEnquirySchema = new mongoose.Schema(
  {
    school: { type: mongoose.Schema.ObjectId, ref: "School", required: true, index: true },
    studentName: { type: String, required: true, trim: true },
    guardianName: { type: String, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    classInterested: { type: String, required: true, trim: true },
    source: {
      type: String,
      enum: ["Website", "Walk-in", "Phone", "Referral", "Social Media", "Other"],
      default: "Walk-in",
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Follow-up", "Converted", "Closed"],
      default: "New",
      index: true,
    },
    followUpDate: { type: Date },
    notes: { type: String, trim: true },
    lastContactedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdmissionEnquiry", admissionEnquirySchema);
