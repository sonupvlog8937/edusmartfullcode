const Fees = require("../model/fees.model");
const Student = require("../model/role/student.model");
const mongoose = require("mongoose");

// Generate unique invoice number
const generateInvoiceNumber = async (schoolId) => {
  const count = await Fees.countDocuments({ school: schoolId });
  const year = new Date().getFullYear();
  return `INV-${year}-${String(count + 1).padStart(5, "0")}`;
};

module.exports = {
  // Create fee record
  createFee: async (req, res) => {
    try {
      const schoolId = req.user.schoolId;
      const { studentId, classId, fee_type, amount, due_date, discount, remarks } = req.body;

      const invoice_number = await generateInvoiceNumber(schoolId);

      const fee = new Fees({
        school: schoolId,
        student: studentId,
        class: classId,
        fee_type,
        amount,
        due_date,
        discount: discount || 0,
        invoice_number,
        remarks: remarks || "",
      });

      await fee.save();
      res.status(201).json({ success: true, message: "Fee record created successfully", data: fee });
    } catch (error) {
      console.error("Error creating fee:", error);
      res.status(500).json({ success: false, message: "Error creating fee", error: error.message });
    }
  },

  // Get all fees
  getAllFees: async (req, res) => {
    try {
      const schoolId = req.user.schoolId;
      const { studentId, classId, status, fee_type } = req.query;

      const filter = { school: schoolId };
      if (studentId) filter.student = studentId;
      if (classId) filter.class = classId;
      if (status) filter.status = status;
      if (fee_type) filter.fee_type = fee_type;

      const fees = await Fees.find(filter)
        .populate("student", "name roll_number email")
        .populate("class", "class_text class_num")
        .sort({ createdAt: -1 });

      res.status(200).json({ success: true, data: fees });
    } catch (error) {
      console.error("Error fetching fees:", error);
      res.status(500).json({ success: false, message: "Error fetching fees", error: error.message });
    }
  },

  // Get fee by ID
  getFeeById: async (req, res) => {
    try {
      const { id } = req.params;
      const fee = await Fees.findById(id)
        .populate("student", "name roll_number email guardian guardian_phone")
        .populate("class", "class_text class_num");

      if (!fee) {
        return res.status(404).json({ success: false, message: "Fee record not found" });
      }

      res.status(200).json({ success: true, data: fee });
    } catch (error) {
      console.error("Error fetching fee:", error);
      res.status(500).json({ success: false, message: "Error fetching fee", error: error.message });
    }
  },

  // Collect fee payment
  collectFee: async (req, res) => {
    try {
      const { id } = req.params;
      const { paid_amount, payment_mode, transaction_id, fine } = req.body;

      const fee = await Fees.findById(id);
      if (!fee) {
        return res.status(404).json({ success: false, message: "Fee record not found" });
      }

      const totalPaid = fee.paid_amount + paid_amount;
      const totalAmount = fee.amount - fee.discount + (fine || 0);

      fee.paid_amount = totalPaid;
      fee.payment_mode = payment_mode;
      fee.transaction_id = transaction_id || "";
      fee.payment_date = new Date();
      fee.fine = fine || 0;

      if (totalPaid >= totalAmount) {
        fee.status = "Paid";
      } else if (totalPaid > 0) {
        fee.status = "Partial";
      }

      await fee.save();

      res.status(200).json({ success: true, message: "Payment collected successfully", data: fee });
    } catch (error) {
      console.error("Error collecting fee:", error);
      res.status(500).json({ success: false, message: "Error collecting fee", error: error.message });
    }
  },

  // Update fee
  updateFee: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const fee = await Fees.findByIdAndUpdate(id, updates, { new: true });

      if (!fee) {
        return res.status(404).json({ success: false, message: "Fee record not found" });
      }

      res.status(200).json({ success: true, message: "Fee updated successfully", data: fee });
    } catch (error) {
      console.error("Error updating fee:", error);
      res.status(500).json({ success: false, message: "Error updating fee", error: error.message });
    }
  },

  // Delete fee
  deleteFee: async (req, res) => {
    try {
      const { id } = req.params;
      const fee = await Fees.findByIdAndDelete(id);

      if (!fee) {
        return res.status(404).json({ success: false, message: "Fee record not found" });
      }

      res.status(200).json({ success: true, message: "Fee deleted successfully" });
    } catch (error) {
      console.error("Error deleting fee:", error);
      res.status(500).json({ success: false, message: "Error deleting fee", error: error.message });
    }
  },

  // Get fee summary
  getFeeSummary: async (req, res) => {
    try {
      const schoolId = req.user.schoolId;
      const { classId, month, year } = req.query;

      const filter = { school: schoolId };
      if (classId) filter.class = classId;

      const fees = await Fees.find(filter);

      const summary = {
        total_amount: 0,
        total_paid: 0,
        total_due: 0,
        total_discount: 0,
        total_fine: 0,
        pending_count: 0,
        paid_count: 0,
        overdue_count: 0,
      };

      fees.forEach((fee) => {
        summary.total_amount += fee.amount;
        summary.total_paid += fee.paid_amount;
        summary.total_discount += fee.discount;
        summary.total_fine += fee.fine;

        const due = fee.amount - fee.discount - fee.paid_amount + fee.fine;
        summary.total_due += due > 0 ? due : 0;

        if (fee.status === "Pending") summary.pending_count++;
        if (fee.status === "Paid") summary.paid_count++;
        if (fee.status === "Overdue") summary.overdue_count++;
      });

      res.status(200).json({ success: true, data: summary });
    } catch (error) {
      console.error("Error fetching fee summary:", error);
      res.status(500).json({ success: false, message: "Error fetching fee summary", error: error.message });
    }
  },

  // Get student fee history
  getStudentFeeHistory: async (req, res) => {
    try {
      const { studentId } = req.params;

      const fees = await Fees.find({ student: studentId })
        .populate("class", "class_text class_num")
        .sort({ createdAt: -1 });

      res.status(200).json({ success: true, data: fees });
    } catch (error) {
      console.error("Error fetching student fee history:", error);
      res.status(500).json({ success: false, message: "Error fetching fee history", error: error.message });
    }
  },
};
