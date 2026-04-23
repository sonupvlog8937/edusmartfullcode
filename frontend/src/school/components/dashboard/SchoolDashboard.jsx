import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Tooltip as MuiTooltip,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import PreviewIcon from "@mui/icons-material/Preview";
import GroupsIcon from "@mui/icons-material/Groups";
import SchoolIcon from "@mui/icons-material/School";
import ClassIcon from "@mui/icons-material/Class";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SearchIcon from "@mui/icons-material/Search";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { baseUrl } from "../../../environment";
import styled from "@emotion/styled";
import EditIcon from "@mui/icons-material/Edit";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

// ── KPI Card ─────────────────────────────────────────────────────────────────
const KpiCard = ({ label, value, icon, color, subtitle, onClick, loading }) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      border: "1px solid",
      borderColor: "divider",
      overflow: "hidden",
      cursor: onClick ? "pointer" : "default",
      transition: "box-shadow 0.2s, transform 0.2s",
      "&:hover": onClick ? { boxShadow: "0 6px 24px rgba(0,0,0,0.10)", transform: "translateY(-2px)" } : {},
    }}
    onClick={onClick}
  >
    <Box sx={{ display: "flex", height: "100%" }}>
      {/* Colored left accent */}
      <Box sx={{ width: 5, bgcolor: color, flexShrink: 0, borderRadius: "0 0 0 0" }} />
      <CardContent sx={{ flex: 1, py: 2, px: 2 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Box>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.6, fontSize: 10 }}>
              {label}
            </Typography>
            {loading ? (
              <Skeleton width={60} height={36} />
            ) : (
              <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.1, color: "text.primary" }}>
                {value ?? 0}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              bgcolor: alpha(color, 0.12),
              color: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Box>
  </Card>
);

// ── Section Header ────────────────────────────────────────────────────────────
const SectionHeader = ({ title, subtitle, action }) => (
  <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1} sx={{ mb: 2 }}>
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>{title}</Typography>
      {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
    </Box>
    {action}
  </Stack>
);

// ── SchoolDashboard ───────────────────────────────────────────────────────────
const SchoolDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === "dark";

  const [totalStudents, setTotalStudents]   = useState(0);
  const [totalTeachers, setTotalTeachers]   = useState(0);
  const [classes, setClasses]               = useState([]);
  const [subjects, setSubjects]             = useState([]);
  const [schoolDetails, setSchoolDetails]   = useState(null);
  const [schoolName, setSchoolName]         = useState("");
  const [schooImage, setSchoolImage]        = useState("");
  const [schoolAttendanceSummary, setSchoolAttendanceSummary] = useState({
    totalStudents: 0, presentCount: 0, absentCount: 0,
    attendancePercentage: 0, latestAttendanceDate: null,
  });
  const [schoolEdit, setSchoolEdit] = useState(false);
  const [preview, setPreview]       = useState(false);
  const [loading, setLoading]       = useState(true);
  const [loadError, setLoadError]   = useState("");
  const [saving, setSaving]         = useState(false);
  const [classesQuery, setClassesQuery]   = useState("");
  const [subjectsQuery, setSubjectsQuery] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType]       = useState("success");
  const resetMessage = () => setMessage("");

  const dummyData = {
    totalStudents: 120, totalTeachers: 15,
    classes:  [{ _id: "1", class_text: "Class 1" }, { _id: "2", class_text: "Class 2" }, { _id: "3", class_text: "Class 3" }, { _id: "4", class_text: "Class 4" }],
    subjects: [{ _id: "1", subject_name: "Mathematics" }, { _id: "2", subject_name: "Science" }, { _id: "3", subject_name: "History" }, { _id: "4", subject_name: "Geography" }],
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); setLoadError("");
      try {
        const [studentRes, teacherRes, classesRes, subjectsRes, schoolData, attendanceRes] = await Promise.all([
          axios.get(`${baseUrl}/student/fetch-with-query`, { params: {} }),
          axios.get(`${baseUrl}/teacher/fetch-with-query`, { params: {} }),
          axios.get(`${baseUrl}/class/fetch-all`),
          axios.get(`${baseUrl}/subject/fetch-all`),
          axios.get(`${baseUrl}/school/fetch-single`),
          axios.get(`${baseUrl}/attendance/school/overview`, { params: { page: 1, limit: 1 } }),
        ]);
        setSchoolDetails(schoolData.data.data);
        setSchoolName(schoolData.data.data.school_name);
        setSchoolImage(schoolData.data.data.school_image);
        setTotalStudents(studentRes.data.data.length);
        setTotalTeachers(teacherRes.data.data.length);
        setSchoolAttendanceSummary(attendanceRes.data.schoolSummary || { totalStudents: studentRes.data.data.length || 0, presentCount: 0, absentCount: 0, attendancePercentage: 0, latestAttendanceDate: null });
        setClasses(classesRes.data.data || dummyData.classes);
        setSubjects(subjectsRes.data.data || dummyData.subjects);
      } catch {
        setLoadError("Unable to load dashboard data. Showing fallback data.");
        setTotalStudents(dummyData.totalStudents);
        setTotalTeachers(dummyData.totalTeachers);
        setSchoolAttendanceSummary({ totalStudents: dummyData.totalStudents, presentCount: 0, absentCount: dummyData.totalStudents, attendancePercentage: 0, latestAttendanceDate: null });
        setClasses(dummyData.classes);
        setSubjects(dummyData.subjects);
      } finally { setLoading(false); }
    };
    fetchData();
  }, [message]);

  const [file, setFile]         = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const fileInputRef            = useRef(null);

  const getSchoolImageSrc = (imageValue) => {
    if (!imageValue) return "";
    if (/^https?:\/\//i.test(imageValue)) return imageValue;
    return `${baseUrl.replace(/\/api\/?$/, "")}/images/uploaded/school/${imageValue}`;
  };

  const addImage = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setImageUrl(URL.createObjectURL(f)); }
  };

  const handleClearFile = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFile(null);
  };

  const handleSchoolEdit = () => { setSchoolEdit(true); setImageUrl(null); };

  const handleSubmit = (e) => {
    e.preventDefault(); setSaving(true);
    const fd = new FormData();
    fd.append("school_name", schoolName);
    if (file) fd.append("image", file, file.name);
    axios.patch(`${baseUrl}/school/update`, fd)
      .then((r) => { setMessage(r.data.message); setType("success"); handleClearFile(); setSchoolEdit(false); })
      .catch((err) => { setMessage(err.response?.data?.message || "Error saving"); setType("error"); })
      .finally(() => setSaving(false));
  };

  // ── Filtered + chart data ──────────────────────────────────────────────────
  const filteredClasses = useMemo(() => {
    const q = classesQuery.trim().toLowerCase();
    return q ? (classes || []).filter((c) => c.class_text?.toLowerCase().includes(q)) : classes;
  }, [classes, classesQuery]);

  const filteredSubjects = useMemo(() => {
    const q = subjectsQuery.trim().toLowerCase();
    return q ? (subjects || []).filter((s) => s.subject_name?.toLowerCase().includes(q)) : subjects;
  }, [subjects, subjectsQuery]);

  const classesChartData = useMemo(() => ({
    labels: filteredClasses.slice(0, 10).map((c) => c.class_text),
    datasets: [{
      label: "Classes", data: filteredClasses.slice(0, 10).map(() => 1),
      backgroundColor: "rgba(37,99,235,0.50)", borderColor: "rgba(37,99,235,1)", borderWidth: 1.5, borderRadius: 4,
    }],
  }), [filteredClasses]);

  const subjectsChartData = useMemo(() => ({
    labels: filteredSubjects.slice(0, 10).map((s) => s.subject_name),
    datasets: [{
      label: "Subjects", data: filteredSubjects.slice(0, 10).map(() => 1),
      backgroundColor: "rgba(217,70,239,0.50)", borderColor: "rgba(217,70,239,1)", borderWidth: 1.5, borderRadius: 4,
    }],
  }), [filteredSubjects]);

  const attendanceDonutData = useMemo(() => ({
    labels: ["Present", "Absent"],
    datasets: [{
      data: [schoolAttendanceSummary.presentCount || 0, schoolAttendanceSummary.absentCount || 0],
      backgroundColor: ["rgba(5,150,105,0.85)", "rgba(220,38,38,0.80)"],
      borderColor: ["#059669", "#dc2626"],
      borderWidth: 2, hoverOffset: 4,
    }],
  }), [schoolAttendanceSummary]);

  const attendancePct = Math.round(schoolAttendanceSummary.attendancePercentage || 0);

  const kpis = useMemo(() => [
    { label: "Total Students",  value: totalStudents,                            icon: <GroupsIcon fontSize="small" />,              color: "#2563eb", path: "/school/students" },
    { label: "Total Teachers",  value: totalTeachers,                            icon: <SchoolIcon fontSize="small" />,              color: "#7c3aed", path: "/school/teachers" },
    { label: "Classes",         value: classes?.length || 0,                     icon: <ClassIcon fontSize="small" />,               color: "#0f766e", path: "/school/class" },
    { label: "Subjects",        value: subjects?.length || 0,                    icon: <MenuBookIcon fontSize="small" />,            color: "#b45309", path: "/school/subject" },
    { label: "Present Today",   value: schoolAttendanceSummary.presentCount,     icon: <CheckCircleOutlineIcon fontSize="small" />,  color: "#059669", path: "/school/attendance" },
    { label: "Absent Today",    value: schoolAttendanceSummary.absentCount,      icon: <HighlightOffIcon fontSize="small" />,        color: "#dc2626", path: "/school/attendance" },
  ], [totalStudents, totalTeachers, classes, subjects, schoolAttendanceSummary]);

  const chartBarOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { display: false, grid: { display: false } },
      x: { grid: { display: false }, ticks: { font: { size: 11 }, maxRotation: 30 } },
    },
  };

  // ── Quick action nav items ────────────────────────────────────────────────
  const quickNav = [
    { label: "Students",   path: "/school/students",   icon: <GroupsIcon fontSize="small" />,   color: "#2563eb" },
    { label: "Teachers",   path: "/school/teachers",   icon: <SchoolIcon fontSize="small" />,   color: "#7c3aed" },
    { label: "Attendance", path: "/school/attendance", icon: <CalendarTodayIcon fontSize="small" />, color: "#059669" },
    { label: "Classes",    path: "/school/class",      icon: <ClassIcon fontSize="small" />,    color: "#0f766e" },
    { label: "Subjects",   path: "/school/subject",    icon: <MenuBookIcon fontSize="small" />, color: "#b45309" },
  ];

  const schoolInitials = schoolDetails?.school_name
    ? schoolDetails.school_name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
    : "SC";

  return (
    <Box sx={{ py: 3, minHeight: "100vh", bgcolor: isDark ? "#0f1117" : "#f8fafc" }}>
      {message && <CustomizedSnackbars reset={resetMessage} type={type} message={message} />}

      <Container maxWidth="xl">
        <Stack spacing={3}>

          {/* ── Page Header ── */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "flex-start", md: "center" }} justifyContent="space-between">
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -0.5, color: "text.primary" }}>
                Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                {schoolDetails?.school_name ? `Welcome back — ${schoolDetails.school_name}` : "School overview & quick actions"}
              </Typography>
            </Box>

            {/* Quick nav pills */}
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {quickNav.map((n) => (
                <Button
                  key={n.label}
                  size="small"
                  startIcon={<Box sx={{ color: n.color, display: "flex" }}>{n.icon}</Box>}
                  onClick={() => navigate(n.path)}
                  sx={{
                    borderRadius: "20px",
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: 13,
                    px: 1.5,
                    py: 0.6,
                    border: "1px solid",
                    borderColor: "divider",
                    color: "text.primary",
                    bgcolor: "background.paper",
                    "&:hover": { bgcolor: alpha(n.color, 0.07), borderColor: n.color },
                  }}
                >
                  {n.label}
                </Button>
              ))}
            </Stack>
          </Stack>

          {loadError && <Alert severity="warning" sx={{ borderRadius: 2 }}>{loadError}</Alert>}

          {/* ── School Banner ── */}
          <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
            {loading ? (
              <Skeleton variant="rectangular" height={200} />
            ) : (
              <Box sx={{ position: "relative", height: { xs: 160, sm: 200 } }}>
                {schoolDetails?.school_image ? (
                  <CardMedia
                    component="img"
                    image={getSchoolImageSrc(schoolDetails.school_image)}
                    alt={`${schoolDetails.school_name || "School"} cover`}
                    sx={{ height: "100%", width: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <Box sx={{ height: "100%", background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 40%, #0891b2 100%)" }} />
                )}

                {/* Gradient overlay */}
                <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(2,6,23,0.05) 0%, rgba(2,6,23,0.65) 100%)" }} />

                {/* Content */}
                <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 2.5 } }}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1.5, sm: 2 }} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between" sx={{ width: "100%" }}>
                    {/* School identity */}
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      {/* School logo / initials avatar */}
                      <Box sx={{
                        width: { xs: 48, sm: 60 }, height: { xs: 48, sm: 60 },
                        borderRadius: 2, border: "2.5px solid rgba(255,255,255,0.85)",
                        bgcolor: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <Typography sx={{ fontWeight: 900, fontSize: { xs: 16, sm: 20 }, color: "#fff" }}>
                          {schoolInitials}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: "#fff", lineHeight: 1.1, fontSize: { xs: 16, sm: 22 } }}>
                          {schoolDetails?.school_name || "Your School"}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" mt={0.3}>
                          <PeopleAltIcon sx={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }} />
                          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.85)" }}>
                            {totalStudents} Students · {totalTeachers} Teachers
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>

                    {/* Action buttons */}
                    <Stack direction="row" spacing={1} flexShrink={0}>
                      <MuiTooltip title="Preview cover">
                        <span>
                          <IconButton
                            onClick={() => setPreview(true)}
                            disabled={!schoolDetails?.school_image}
                            size="small"
                            sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "#fff", backdropFilter: "blur(6px)", "&:hover": { bgcolor: "rgba(255,255,255,0.30)" }, "&:disabled": { opacity: 0.4 } }}
                          >
                            <PreviewIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </MuiTooltip>
                      <Button
                        onClick={handleSchoolEdit}
                        size="small"
                        variant="contained"
                        startIcon={<EditIcon fontSize="small" />}
                        sx={{
                          borderRadius: "20px", boxShadow: "none", textTransform: "none", fontWeight: 700,
                          bgcolor: "rgba(255,255,255,0.92)", color: "#1e3a8a",
                          "&:hover": { bgcolor: "#fff", boxShadow: "none" },
                        }}
                      >
                        Edit Profile
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              </Box>
            )}
          </Card>

          {/* ── KPI Grid ── */}
          <Grid2 container spacing={2}>
            {kpis.map((kpi) => (
              <Grid2 key={kpi.label} size={{ xs: 6, sm: 4, md: 2 }}>
                <KpiCard
                  label={kpi.label}
                  value={kpi.value}
                  icon={kpi.icon}
                  color={kpi.color}
                  loading={loading}
                  onClick={() => navigate(kpi.path)}
                />
              </Grid2>
            ))}
          </Grid2>

          {/* ── Attendance Overview + Stats ── */}
          <Grid2 container spacing={2}>
            {/* Donut chart */}
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", height: "100%", p: 2.5 }}>
                <SectionHeader
                  title="Today's Attendance"
                  subtitle={schoolAttendanceSummary.latestAttendanceDate
                    ? `As of ${new Date(schoolAttendanceSummary.latestAttendanceDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`
                    : "No attendance recorded today"}
                />

                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <Skeleton variant="circular" width={160} height={160} />
                  </Box>
                ) : (schoolAttendanceSummary.presentCount + schoolAttendanceSummary.absentCount) > 0 ? (
                  <Box sx={{ position: "relative", maxWidth: 200, mx: "auto", my: 1 }}>
                    <Doughnut
                      data={attendanceDonutData}
                      options={{
                        cutout: "72%",
                        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed}` } } },
                      }}
                    />
                    {/* Center label */}
                    <Box sx={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1, color: attendancePct >= 75 ? "#059669" : "#dc2626" }}>
                        {attendancePct}%
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>present</Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ py: 3, textAlign: "center" }}>
                    <CalendarTodayIcon sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">No attendance data for today</Typography>
                  </Box>
                )}

                {/* Present / Absent breakdown */}
                <Divider sx={{ my: 1.5 }} />
                <Stack spacing={1}>
                  {[
                    { label: "Present", value: schoolAttendanceSummary.presentCount, color: "#059669" },
                    { label: "Absent",  value: schoolAttendanceSummary.absentCount,  color: "#dc2626" },
                  ].map((row) => (
                    <Stack key={row.label} direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                      <Stack direction="row" alignItems="center" spacing={0.8}>
                        <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: row.color }} />
                        <Typography variant="body2" color="text.secondary">{row.label}</Typography>
                      </Stack>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.value}</Typography>
                    </Stack>
                  ))}
                  <Divider />
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Total</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{schoolAttendanceSummary.totalStudents}</Typography>
                  </Stack>

                  {/* Progress bar */}
                  <Box>
                    <LinearProgress
                      variant="determinate"
                      value={attendancePct}
                      sx={{
                        height: 8, borderRadius: 4,
                        bgcolor: "#fee2e2",
                        "& .MuiLinearProgress-bar": { bgcolor: "#059669", borderRadius: 4 },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                      {attendancePct}% attendance rate
                    </Typography>
                  </Box>
                </Stack>

                <Button
                  fullWidth size="small"
                  endIcon={<ArrowForwardIcon fontSize="small" />}
                  onClick={() => navigate("/school/attendance")}
                  sx={{ mt: 2, borderRadius: 2, textTransform: "none", fontWeight: 700, border: "1px solid", borderColor: "divider" }}
                >
                  View Full Attendance
                </Button>
              </Card>
            </Grid2>

            {/* Classes chart */}
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", p: 2.5, height: "100%" }}>
                <SectionHeader
                  title={`Classes`}
                  subtitle={`${filteredClasses.length} of ${classes.length} total`}
                  action={
                    <TextField
                      value={classesQuery}
                      onChange={(e) => setClassesQuery(e.target.value)}
                      size="small"
                      placeholder="Search…"
                      InputProps={{ startAdornment: <SearchIcon sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }} /> }}
                      sx={{ width: 130 }}
                    />
                  }
                />

                {loading ? (
                  <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
                ) : (
                  <Box sx={{ height: 180 }}>
                    <Bar data={classesChartData} options={chartBarOptions} />
                  </Box>
                )}

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ maxHeight: 100, overflow: "auto" }}>
                  <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap>
                    {filteredClasses.slice(0, 16).map((c) => (
                      <Chip
                        key={c._id || c.class_text}
                        label={c.class_text}
                        size="small"
                        sx={{ fontSize: 11, height: 22, bgcolor: alpha("#2563eb", 0.08), color: "#2563eb", fontWeight: 600, mb: 0.5 }}
                      />
                    ))}
                    {!loading && filteredClasses.length === 0 && (
                      <Typography variant="caption" color="text.secondary">No classes match.</Typography>
                    )}
                  </Stack>
                </Box>

                <Button
                  fullWidth size="small"
                  endIcon={<ArrowForwardIcon fontSize="small" />}
                  onClick={() => navigate("/school/class")}
                  sx={{ mt: 1.5, borderRadius: 2, textTransform: "none", fontWeight: 700, border: "1px solid", borderColor: "divider" }}
                >
                  Manage Classes
                </Button>
              </Card>
            </Grid2>

            {/* Subjects chart */}
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", p: 2.5, height: "100%" }}>
                <SectionHeader
                  title="Subjects"
                  subtitle={`${filteredSubjects.length} of ${subjects.length} total`}
                  action={
                    <TextField
                      value={subjectsQuery}
                      onChange={(e) => setSubjectsQuery(e.target.value)}
                      size="small"
                      placeholder="Search…"
                      InputProps={{ startAdornment: <SearchIcon sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }} /> }}
                      sx={{ width: 130 }}
                    />
                  }
                />

                {loading ? (
                  <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
                ) : (
                  <Box sx={{ height: 180 }}>
                    <Bar data={subjectsChartData} options={chartBarOptions} />
                  </Box>
                )}

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ maxHeight: 100, overflow: "auto" }}>
                  <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap>
                    {filteredSubjects.slice(0, 16).map((s) => (
                      <Chip
                        key={s._id || s.subject_name}
                        label={s.subject_name}
                        size="small"
                        sx={{ fontSize: 11, height: 22, bgcolor: alpha("#d946ef", 0.08), color: "#a21caf", fontWeight: 600, mb: 0.5 }}
                      />
                    ))}
                    {!loading && filteredSubjects.length === 0 && (
                      <Typography variant="caption" color="text.secondary">No subjects match.</Typography>
                    )}
                  </Stack>
                </Box>

                <Button
                  fullWidth size="small"
                  endIcon={<ArrowForwardIcon fontSize="small" />}
                  onClick={() => navigate("/school/subject")}
                  sx={{ mt: 1.5, borderRadius: 2, textTransform: "none", fontWeight: 700, border: "1px solid", borderColor: "divider" }}
                >
                  Manage Subjects
                </Button>
              </Card>
            </Grid2>
          </Grid2>

          {/* ── Quick Actions row ── */}
          <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", p: 2.5 }}>
            <SectionHeader title="Quick Actions" subtitle="Jump to frequently used sections" />
            <Grid2 container spacing={1.5}>
              {[
                { label: "Add Student",    path: "/school/students/add",   color: "#2563eb", icon: <GroupsIcon /> },
                { label: "Add Teacher",    path: "/school/teachers/add",   color: "#7c3aed", icon: <SchoolIcon /> },
                { label: "Mark Attendance",path: "/school/attendance",     color: "#059669", icon: <CalendarTodayIcon /> },
                { label: "Add Class",      path: "/school/class",          color: "#0f766e", icon: <ClassIcon /> },
                { label: "Add Subject",    path: "/school/subject",        color: "#b45309", icon: <MenuBookIcon /> },
                { label: "View Reports",   path: "/school/reports",        color: "#0891b2", icon: <TrendingUpIcon /> },
              ].map((action) => (
                <Grid2 key={action.label} size={{ xs: 6, sm: 4, md: 2 }}>
                  <Card
                    elevation={0}
                    onClick={() => navigate(action.path)}
                    sx={{
                      borderRadius: 2.5, border: "1px solid", borderColor: "divider",
                      p: 1.8, textAlign: "center", cursor: "pointer",
                      transition: "all 0.18s ease",
                      "&:hover": { borderColor: action.color, bgcolor: alpha(action.color, 0.05), transform: "translateY(-2px)" },
                    }}
                  >
                    <Box sx={{ color: action.color, display: "flex", justifyContent: "center", mb: 0.8 }}>{action.icon}</Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "text.primary", display: "block", lineHeight: 1.2 }}>
                      {action.label}
                    </Typography>
                  </Card>
                </Grid2>
              ))}
            </Grid2>
          </Card>

        </Stack>
      </Container>

      {/* ── Preview Dialog ── */}
      <Dialog open={preview} onClose={() => setPreview(false)} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Cover Preview</DialogTitle>
        <DialogContent dividers sx={{ p: 0, bgcolor: "#000" }}>
          {schoolDetails?.school_image ? (
            <CardMedia component="img" image={getSchoolImageSrc(schooImage)} alt="Preview" sx={{ width: "100%", maxHeight: "75vh", objectFit: "contain" }} />
          ) : (
            <Box sx={{ p: 3 }}><Alert severity="info">No cover image found.</Alert></Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setPreview(false)} variant="outlined" sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* ── Edit Dialog ── */}
      <Dialog
        open={schoolEdit}
        onClose={() => (saving ? null : setSchoolEdit(false))}
        maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Update School Profile</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              Updating the school name or cover image will reflect across the platform.
            </Alert>

            {/* Image upload zone */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Cover Image</Typography>
              <Box
                component="label"
                sx={{
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  border: "2px dashed", borderColor: imageUrl ? "#2563eb" : "divider",
                  borderRadius: 2.5, p: 3, cursor: "pointer",
                  bgcolor: imageUrl ? alpha("#2563eb", 0.04) : "background.paper",
                  transition: "all 0.2s", "&:hover": { borderColor: "#2563eb", bgcolor: alpha("#2563eb", 0.04) },
                }}
              >
                <input type="file" hidden accept="image/*" ref={fileInputRef} onChange={addImage} />
                <CloudUploadIcon sx={{ fontSize: 36, color: imageUrl ? "#2563eb" : "text.disabled", mb: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: imageUrl ? "#2563eb" : "text.secondary" }}>
                  {imageUrl ? "Change image" : "Click to upload cover image"}
                </Typography>
                <Typography variant="caption" color="text.secondary">PNG, JPG up to 5MB</Typography>
              </Box>

              {imageUrl && (
                <Box sx={{ mt: 1.5, position: "relative" }}>
                  <CardMedia
                    component="img" image={imageUrl} alt="Preview"
                    sx={{ borderRadius: 2, maxHeight: 220, objectFit: "cover", width: "100%" }}
                  />
                  <Button
                    size="small" onClick={handleClearFile}
                    sx={{ position: "absolute", top: 8, right: 8, minWidth: 0, borderRadius: "50%", width: 30, height: 30, bgcolor: "rgba(0,0,0,0.55)", color: "#fff", "&:hover": { bgcolor: "rgba(0,0,0,0.75)" }, fontSize: 16, p: 0 }}
                  >✕</Button>
                </Box>
              )}
            </Box>

            <TextField
              fullWidth value={schoolName} label="School Name" variant="outlined"
              onChange={(e) => setSchoolName(e.target.value)}
              InputProps={{ sx: { borderRadius: 2 } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setSchoolEdit(false)} variant="outlined" disabled={saving}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
          >Cancel</Button>
          <Button
            onClick={handleSubmit} variant="contained" disabled={saving}
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{ borderRadius: 2, boxShadow: "none", textTransform: "none", fontWeight: 800 }}
          >
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SchoolDashboard;