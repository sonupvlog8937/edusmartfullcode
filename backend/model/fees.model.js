const mongoose = require("mongoose");

const feesSchema = new mongoose.Schema({
  school: { type: mongoose.Schema.ObjectId, ref: "School", required: true },
  student: { type: mongoose.Schema.ObjectId, ref: "Student", required: true },
  class: { type: mongoose.Schema.ObjectId, ref: "Class", required: true },
  fee_type: { type: String, required: true }, // Tuition, Transport, Library, etc.
  amount: { type: Number, required: true },
  paid_amount: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  fine: { type: Number, default: 0 },
  due_date: { type: Date, required: true },
  payment_date: { type: Date },
  payment_mode: { type: String, enum: ["Cash", "Online", "Cheque", "Card"], default: "Cash" },
  transaction_id: { type: String, default: "" },
  status: { type: String, enum: ["Pending", "Paid", "Partial", "Overdue"], default: "Pending" },
  remarks: { type: String, default: "" },
  invoice_number: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Fees", feesSchema);
