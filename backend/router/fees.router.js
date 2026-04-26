const express = require("express");
const router = express.Router();
const authMiddleware = require("../auth/auth");
const feesController = require("../controller/fees.controller");

// Fee routes
router.post("/create", authMiddleware(["SCHOOL"]), feesController.createFee);
router.get("/all", authMiddleware(["SCHOOL", "TEACHER"]), feesController.getAllFees);
router.get("/:id", authMiddleware(["SCHOOL", "TEACHER", "STUDENT"]), feesController.getFeeById);
router.put("/:id", authMiddleware(["SCHOOL"]), feesController.updateFee);
router.delete("/:id", authMiddleware(["SCHOOL"]), feesController.deleteFee);

// Payment routes
router.post("/:id/collect", authMiddleware(["SCHOOL"]), feesController.collectFee);
router.get("/summary/all", authMiddleware(["SCHOOL"]), feesController.getFeeSummary);
router.get("/student/:studentId/history", authMiddleware(["SCHOOL", "TEACHER", "STUDENT"]), feesController.getStudentFeeHistory);

module.exports = router;
