import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  IconButton,
  Typography,
  Chip,
  Avatar,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import {
  fetchStudents,
  fetchDropdownOptions,
  fetchStudentStats,
  deleteStudent,
  setFilters,
  clearMessages,
} from '../../../state/studentAdmissionSlice';
import { useNavigate } from 'react-router-dom';
import CustomizedSnackbars from '../../../basic utility components/CustomizedSnackbars';

const StudentAdmissionList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const {
    students,
    stats,
    pagination,
    filters,
    dropdownOptions,
    loading,
    error,
    successMsg,
  } = useSelector((state) => state.studentAdmission);

  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    dispatch(fetchDropdownOptions());
    dispatch(fetchStudentStats());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchStudents(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    if (error) {
      setSnackbar({ open: true, message: error, severity: 'error' });
      dispatch(clearMessages());
    }
    if (successMsg) {
      setSnackbar({ open: true, message: successMsg, severity: 'success' });
      dispatch(clearMessages());
      dispatch(fetchStudents(filters));
      dispatch(fetchStudentStats());
    }
  }, [error, successMsg, dispatch, filters]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = () => {
    dispatch(setFilters({ search: searchInput }));
  };

  const handleFilterChange = (field, value) => {
    dispatch(setFilters({ [field]: value }));
  };

  const handlePageChange = (event, newPage) => {
    dispatch(setFilters({ page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (event) => {
    dispatch(setFilters({ limit: parseInt(event.target.value, 10), page: 1 }));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      dispatch(deleteStudent(id));
    }
  };

  const handleRefresh = () => {
    dispatch(fetchStudents(filters));
    dispatch(fetchStudentStats());
  };

  const clearFilters = () => {
    setSearchInput('');
    dispatch(setFilters({
      search: '',
      class: '',
      section: '',
      category: '',
      gender: '',
      admissionYear: '',
      page: 1,
    }));
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#6a1b9a' }}>
          <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 35 }} />
          Student Admission
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/school/student-information/admission/add')}
          sx={{
            backgroundColor: '#6a1b9a',
            '&:hover': { backgroundColor: '#4a148c' },
            textTransform: 'none',
            px: 3,
            py: 1,
          }}
        >
          Add New Student
        </Button>
      </Box>

      {/* Stats Cards */}
      {stats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #6a1b9a 0%, #8e24aa 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stats.totalStudents || 0}
                    </Typography>
                    <Typography variant="body2">Total Students</Typography>
                  </Box>
                  <GroupIcon sx={{ fontSize: 50, opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stats.maleStudents || 0}
                    </Typography>
                    <Typography variant="body2">Male Students</Typography>
                  </Box>
                  <PersonIcon sx={{ fontSize: 50, opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #8e24aa 0%, #ab47bc 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stats.femaleStudents || 0}
                    </Typography>
                    <Typography variant="body2">Female Students</Typography>
                  </Box>
                  <PersonIcon sx={{ fontSize: 50, opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stats.newAdmissions || 0}
                    </Typography>
                    <Typography variant="body2">New Admissions</Typography>
                  </Box>
                  <SchoolIcon sx={{ fontSize: 50, opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 2, borderTop: '3px solid #6a1b9a' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by name, admission no, roll number..."
              value={searchInput}
              onChange={handleSearchChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#6a1b9a' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#6a1b9a' },
                  '&.Mui-focused fieldset': { borderColor: '#6a1b9a' },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={handleSearchSubmit}
                sx={{
                  backgroundColor: '#6a1b9a',
                  '&:hover': { backgroundColor: '#4a148c' },
                  textTransform: 'none',
                }}
              >
                Search
              </Button>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setShowFilters(!showFilters)}
                sx={{
                  borderColor: '#6a1b9a',
                  color: '#6a1b9a',
                  '&:hover': { borderColor: '#4a148c', backgroundColor: '#f3e5f5' },
                  textTransform: 'none',
                }}
              >
                Filters
              </Button>
              <IconButton
                onClick={handleRefresh}
                sx={{ color: '#6a1b9a', '&:hover': { backgroundColor: '#f3e5f5' } }}
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Advanced Filters */}
        {showFilters && (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Class</InputLabel>
                <Select
                  value={filters.class}
                  label="Class"
                  onChange={(e) => handleFilterChange('class', e.target.value)}
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6a1b9a' },
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  {dropdownOptions.classes?.map((cls) => (
                    <MenuItem key={cls._id} value={cls._id}>
                      {cls.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Section</InputLabel>
                <Select
                  value={filters.section}
                  label="Section"
                  onChange={(e) => handleFilterChange('section', e.target.value)}
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6a1b9a' },
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  {dropdownOptions.sections?.map((sec) => (
                    <MenuItem key={sec._id} value={sec._id}>
                      {sec.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Gender</InputLabel>
                <Select
                  value={filters.gender}
                  label="Gender"
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6a1b9a' },
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category}
                  label="Category"
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6a1b9a' },
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  {dropdownOptions.categories?.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="text"
                onClick={clearFilters}
                sx={{ color: '#6a1b9a', textTransform: 'none' }}
              >
                Clear All Filters
              </Button>
            </Grid>
          </Grid>
        )}
      </Paper>

      {/* Table */}
      <Paper sx={{ borderTop: '3px solid #6a1b9a' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f3e5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#6a1b9a' }}>Photo</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#6a1b9a' }}>Admission No</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#6a1b9a' }}>Roll Number</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#6a1b9a' }}>Student Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#6a1b9a' }}>Class</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#6a1b9a' }}>Section</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#6a1b9a' }}>Gender</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#6a1b9a' }}>Mobile</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#6a1b9a' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#6a1b9a' }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 5 }}>
                    <CircularProgress sx={{ color: '#6a1b9a' }} />
                  </TableCell>
                </TableRow>
              ) : students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 5 }}>
                    <Typography variant="body1" color="textSecondary">
                      No students found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow
                    key={student._id}
                    hover
                    sx={{ '&:hover': { backgroundColor: '#f9f5fb' } }}
                  >
                    <TableCell>
                      <Avatar
                        src={student.photo}
                        alt={student.firstName}
                        sx={{ bgcolor: '#6a1b9a' }}
                      >
                        {student.firstName?.charAt(0)}
                      </Avatar>
                    </TableCell>
                    <TableCell>{student.admissionNo}</TableCell>
                    <TableCell>{student.rollNumber || '-'}</TableCell>
                    <TableCell>
                      {student.firstName} {student.lastName}
                    </TableCell>
                    <TableCell>{student.class?.name || '-'}</TableCell>
                    <TableCell>{student.section?.name || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={student.gender}
                        size="small"
                        sx={{
                          backgroundColor: student.gender === 'Male' ? '#e1bee7' : '#f3e5f5',
                          color: '#6a1b9a',
                        }}
                      />
                    </TableCell>
                    <TableCell>{student.mobileNumber || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={student.status || 'Active'}
                        size="small"
                        color={student.status === 'Active' ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/school/student-information/admission/view/${student._id}`)}
                          sx={{ color: '#6a1b9a' }}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/school/student-information/admission/edit/${student._id}`)}
                          sx={{ color: '#6a1b9a' }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(student._id)}
                          sx={{ color: '#d32f2f' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page - 1}
          onPageChange={handlePageChange}
          rowsPerPage={pagination.limit}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          sx={{
            borderTop: '1px solid #e0e0e0',
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              color: '#6a1b9a',
            },
          }}
        />
      </Paper>

      <CustomizedSnackbars
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default StudentAdmissionList;
