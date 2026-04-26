import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { Add, Payment, Visibility, AttachMoney, TrendingUp } from "@mui/icons-material";
import axios from "axios";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";

const FeesCollection = () => {
  useDocumentTitle("Fees Collection");
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [summary, setSummary] = useState(null);

  const [formData, setFormData] = useState({
    studentId: "",
    classId: "",
    fee_type: "Tuition",
    amount: 0,
    due_date: "",
    discount: 0,
    remarks: "",
  });

  const [paymentData, setPaymentData] = useState({
    paid_amount: 0,
    payment_mode: "Cash",
    transaction_id: "",
    fine: 0,
  });

  useEffect(() => {
    fetchFees();
    fetchStudents();
    fetchClasses();
    fetchSummary();
  }, []);

  const fetchFees = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/fees/all");
      setFees(response.data.data || []);
    } catch (error) {
      console.error("Error fetching fees:", error);
      setSnackbar({ open: true, message: "Error fetching fees", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get("/api/student/all");
      setStudents(response.data.data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get("/api/class/all");
      setClasses(response.data.data || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await axios.get("/api/fees/summary/all");
      setSummary(response.data.data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      studentId: "",
      classId: "",
      fee_type: "Tuition",
      amount: 0,
      due_date: "",
      discount: 0,
      remarks: "",
    });
    setOpenDialog(true);
  };

  const handleOpenPaymentDialog = (fee) => {
    setSelectedFee(fee);
    const remaining = fee.amount - fee.discount - fee.paid_amount + fee.fine;
    setPaymentData({
      paid_amount: remaining > 0 ? remaining : 0,
      payment_mode: "Cash",
      transaction_id: "",
      fine: 0,
    });
    setOpenPaymentDialog(true);
  };

  const handleSubmit = async () => {
    try {
      await axios.post("/api/fees/create", formData);
      setSnackbar({ open: true, message: "Fee record created successfully", severity: "success" });
      setOpenDialog(false);
      fetchFees();
      fetchSummary();
    } catch (error) {
      console.error("Error creating fee:", error);
      setSnackbar({ open: true, message: "Error creating fee", severity: "error" });
    }
  };

  const handlePayment = async () => {
    try {
      await axios.post(`/api/fees/${selectedFee._id}/collect`, paymentData);
      setSnackbar({ open: true, message: "Payment collected successfully", severity: "success" });
      setOpenPaymentDialog(false);
      fetchFees();
      fetchSummary();
    } catch (error) {
      console.error("Error collecting payment:", error);
      setSnackbar({ open: true, message: "Error collecting payment", severity: "error" });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "success";
      case "Partial":
        return "warning";
      case "Pending":
        return "info";
      case "Overdue":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Fees Collection</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenDialog}>
          Create Fee Record
        </Button>
      </Box>

      {summary && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Amount
                </Typography>
                <Typography variant="h5">₹{summary.total_amount?.toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Paid
                </Typography>
                <Typography variant="h5" color="success.main">
                  ₹{summary.total_paid?.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Due
                </Typography>
                <Typography variant="h5" color="error.main">
                  ₹{summary.total_due?.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Pending Count
                </Typography>
                <Typography variant="h5">{summary.pending_count}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice</TableCell>
                <TableCell>Student</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Fee Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Due</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No fee records found
                  </TableCell>
                </TableRow>
              ) : (
                fees.map((fee) => {
                  const due = fee.amount - fee.discount - fee.paid_amount + fee.fine;
                  return (
                    <TableRow key={fee._id}>
                      <TableCell>{fee.invoice_number}</TableCell>
                      <TableCell>{fee.student?.name}</TableCell>
                      <TableCell>{fee.class?.class_text}</TableCell>
                      <TableCell>{fee.fee_type}</TableCell>
                      <TableCell>₹{fee.amount}</TableCell>
                      <TableCell>₹{fee.paid_amount}</TableCell>
                      <TableCell>₹{due > 0 ? due : 0}</TableCell>
                      <TableCell>
                        <Chip label={fee.status} color={getStatusColor(fee.status)} size="small" />
                      </TableCell>
                      <TableCell>
                        {fee.status !== "Paid" && (
                          <IconButton size="small" onClick={() => handleOpenPaymentDialog(fee)}>
                            <Payment />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Fee Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Fee Record</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              select
              label="Student"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              required
            >
              {students.map((student) => (
                <MenuItem key={student._id} value={student._id}>
                  {student.name} - {student.roll_number}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Class"
              value={formData.classId}
              onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
              required
            >
              {classes.map((cls) => (
                <MenuItem key={cls._id} value={cls._id}>
                  {cls.class_text}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Fee Type"
              value={formData.fee_type}
              onChange={(e) => setFormData({ ...formData, fee_type: e.target.value })}
              required
            >
              <MenuItem value="Tuition">Tuition</MenuItem>
              <MenuItem value="Transport">Transport</MenuItem>
              <MenuItem value="Library">Library</MenuItem>
              <MenuItem value="Exam">Exam</MenuItem>
              <MenuItem value="Sports">Sports</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>

            <TextField
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              required
            />

            <TextField
              label="Discount"
              type="number"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) })}
            />

            <TextField
              label="Due Date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
            />

            <TextField
              label="Remarks"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Collect Payment</DialogTitle>
        <DialogContent>
          {selectedFee && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
              <Typography>
                Student: <strong>{selectedFee.student?.name}</strong>
              </Typography>
              <Typography>
                Total Amount: <strong>₹{selectedFee.amount}</strong>
              </Typography>
              <Typography>
                Already Paid: <strong>₹{selectedFee.paid_amount}</strong>
              </Typography>
              <Typography>
                Remaining: <strong>₹{selectedFee.amount - selectedFee.discount - selectedFee.paid_amount}</strong>
              </Typography>

              <TextField
                label="Payment Amount"
                type="number"
                value={paymentData.paid_amount}
                onChange={(e) => setPaymentData({ ...paymentData, paid_amount: parseFloat(e.target.value) })}
                required
              />

              <TextField
                select
                label="Payment Mode"
                value={paymentData.payment_mode}
                onChange={(e) => setPaymentData({ ...paymentData, payment_mode: e.target.value })}
                required
              >
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Online">Online</MenuItem>
                <MenuItem value="Cheque">Cheque</MenuItem>
                <MenuItem value="Card">Card</MenuItem>
              </TextField>

              <TextField
                label="Transaction ID"
                value={paymentData.transaction_id}
                onChange={(e) => setPaymentData({ ...paymentData, transaction_id: e.target.value })}
              />

              <TextField
                label="Fine (if any)"
                type="number"
                value={paymentData.fine}
                onChange={(e) => setPaymentData({ ...paymentData, fine: parseFloat(e.target.value) })}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPaymentDialog(false)}>Cancel</Button>
          <Button onClick={handlePayment} variant="contained">
            Collect Payment
          </Button>
        </DialogActions>
      </Dialog>

      <CustomizedSnackbars
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default FeesCollection;
