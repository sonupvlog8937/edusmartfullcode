import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import { Outlet, useLocation, useNavigate } from "react-router-dom";

// ICONS
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import GradingIcon from '@mui/icons-material/Grading';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import FrontDeskIcon from '@mui/icons-material/SupportAgent';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PaymentIcon from '@mui/icons-material/Payment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import QuizIcon from '@mui/icons-material/Quiz';
import ComputerIcon from '@mui/icons-material/Computer';
import SchoolIcon from '@mui/icons-material/School';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CampaignIcon from '@mui/icons-material/Campaign';
import DownloadIcon from '@mui/icons-material/Download';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import InventoryIcon from '@mui/icons-material/Inventory';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import HotelIcon from '@mui/icons-material/Hotel';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import WebIcon from '@mui/icons-material/Web';
import GroupsIcon from '@mui/icons-material/Groups';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { APP_NAME, LOGO_URL } from "../branding";
import { AuthContext } from "../context/AuthContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const drawerWidth = 260;

const SCHOOL_DOC_TITLE_MAP = {
    "/school": "Dashboard",
    "/school/class": "Classes",
    "/school/class-details": "Class details",
    "/school/subject": "Subjects",
    "/school/students": "Students",
    "/school/teachers": "Teachers",
    "/school/assign-period": "Assign period",
    "/school/periods": "Schedule",
    "/school/attendance": "Attendance",
    "/school/attendance-student": "Attendance detail",
    "/school/examinations": "Examinations",
    "/school/notice": "Notices",
};

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': openedMixin(theme),
                },
            },
            {
                props: ({ open }) => !open,
                style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': closedMixin(theme),
                },
            },
        ],
    }),
);

// ─── NAV CONFIG ──────────────────────────────────────────────────────────────
const NAV_ITEMS = [
    { link: "/school", label: "Dashboard", icon: DashboardIcon },
    {        
        label: "Edu Smart", icon: FrontDeskIcon,
        children: [
        { link: "/school/class", component: "Class", label: "Class" },
        { link: "/school/subject", component: "Subjects", label: "Subjects" },
        { link: "/school/students", component: "Students", label: "Students" },
        { link: "/school/teachers", component: "Teachers", label: "Teachers" },
        { link: "/school/periods", component: "Schedule", label: "Schedule" },
        { link: "/school/attendance", component: "Attendance", label: "Attendance" },
        { link: "/school/examinations", component: "Examinations", label: "Examinations"},
        {link:"/school/notice", component:"Notice", label:"Notice"},
        {link:"/logout", component:"Log Out", label:"Log Out"},
        ]
    },
    {
        label: "Front Office", icon: FrontDeskIcon,
        children: [
            { link: "/school/front-office/admission-enquiry", label: "Admission Enquiry" },
            { link: "/school/front-office/visitor-book", label: "Visitor Book" },
            { link: "/school/front-office/phone-call-log", label: "Phone Call Log" },
            { link: "/school/front-office/postal-dispatch", label: "Postal Dispatch" },
            { link: "/school/front-office/postal-receive", label: "Postal Receive" },
            { link: "/school/front-office/complain", label: "Complain" },
            { link: "/school/front-office/setup", label: "Setup Front Office" },
        ]
    },
    {
        label: "Student Information", icon: PersonSearchIcon,
        children: [
            { link: "/school/students", label: "All Students" },
            { link: "/school/students/admission", label: "Student Admission" },
            { link: "/school/students/bulk-delete", label: "Bulk Delete" },
            { link: "/school/students/category", label: "Student Category" },
            { link: "/school/students/house", label: "Student House" },
            { link: "/school/students/disable", label: "Disable Reason" },
        ]
    },
    {
        label: "Fees Collection", icon: PaymentIcon,
        children: [
            { link: "/school/fees/collect", label: "Collect Fees" },
            { link: "/school/fees/search", label: "Search Fees Payment" },
            { link: "/school/fees/group", label: "Fees Group" },
            { link: "/school/fees/type", label: "Fees Type" },
            { link: "/school/fees/discount", label: "Fees Discount" },
            { link: "/school/fees/reminder", label: "Fees Reminder" },
        ]
    },
    {
        label: "Income", icon: AttachMoneyIcon,
        children: [
            { link: "/school/income/add", label: "Add Income" },
            { link: "/school/income/list", label: "Income List" },
            { link: "/school/income/head", label: "Income Head" },
            { link: "/school/income/search", label: "Search Income" },
        ]
    },
    {
        label: "Expenses", icon: CreditCardIcon,
        children: [
            { link: "/school/expenses/add", label: "Add Expense" },
            { link: "/school/expenses/list", label: "Expense List" },
            { link: "/school/expenses/head", label: "Expense Head" },
            { link: "/school/expenses/search", label: "Search Expense" },
        ]
    },
    {
        label: "Examinations", icon: GradingIcon,
        children: [
            { link: "/school/examinations", label: "Exam Schedule" },
            { link: "/school/examinations/marks", label: "Exam Marks" },
            { link: "/school/examinations/admit-card", label: "Admit Card" },
            { link: "/school/examinations/marks-register", label: "Marks Register" },
            { link: "/school/examinations/report-card", label: "Report Card" },
            { link: "/school/examinations/grade", label: "Grade" },
        ]
    },
    {
        label: "Attendance", icon: RecentActorsIcon,
        children: [
            { link: "/school/attendance", label: "Student Attendance" },
            { link: "/school/attendance/teacher", label: "Teacher Attendance" },
            { link: "/school/attendance/report", label: "Attendance Report" },
        ]
    },
    {
        label: "Online Examinations", icon: ComputerIcon,
        children: [
            { link: "/school/online-exam/list", label: "Online Exam List" },
            { link: "/school/online-exam/questions", label: "Question Bank" },
            { link: "/school/online-exam/results", label: "Results" },
        ]
    },
    {
        label: "Academics", icon: SchoolIcon,
        children: [
            { link: "/school/class", label: "Classes" },
            { link: "/school/subject", label: "Subjects" },
            { link: "/school/periods", label: "Schedule / Timetable" },
            { link: "/school/assign-period", label: "Assign Period" },
            { link: "/school/academics/promote", label: "Promote Students" },
        ]
    },
    {
        label: "Lesson Plan", icon: AutoStoriesIcon,
        children: [
            { link: "/school/lesson-plan/list", label: "Lesson Plans" },
            { link: "/school/lesson-plan/topic", label: "Topics" },
            { link: "/school/lesson-plan/syllabus", label: "Syllabus Status" },
        ]
    },
    {
        label: "Human Resource", icon: PeopleAltIcon,
        children: [
            { link: "/school/teachers", label: "Teachers" },
            { link: "/school/hr/staff", label: "Staff" },
            { link: "/school/hr/payroll", label: "Payroll" },
            { link: "/school/hr/leave", label: "Leave" },
            { link: "/school/hr/department", label: "Department" },
            { link: "/school/hr/designation", label: "Designation" },
        ]
    },
    {
        label: "Communicate", icon: CampaignIcon,
        children: [
            { link: "/school/communicate/notice", label: "Notice Board" },
            { link: "/school/communicate/send-email", label: "Send Email" },
            { link: "/school/communicate/send-sms", label: "Send SMS" },
            { link: "/school/communicate/news", label: "News" },
            { link: "/school/communicate/events", label: "Events" },
            { link: "/school/communicate/holidays", label: "Holidays" },
        ]
    },
    {
        label: "Download Center", icon: DownloadIcon,
        children: [
            { link: "/school/downloads/upload", label: "Upload Content" },
            { link: "/school/downloads/list", label: "Download List" },
        ]
    },
    {
        label: "Homework", icon: AssignmentIcon,
        children: [
            { link: "/school/homework/add", label: "Add Homework" },
            { link: "/school/homework/list", label: "Homework List" },
            { link: "/school/homework/evaluation", label: "Evaluation" },
        ]
    },
    {
        label: "Library", icon: LocalLibraryIcon,
        children: [
            { link: "/school/library/books", label: "Books" },
            { link: "/school/library/issue", label: "Issue / Return" },
            { link: "/school/library/members", label: "Library Members" },
            { link: "/school/library/category", label: "Book Category" },
        ]
    },
    {
        label: "Inventory", icon: InventoryIcon,
        children: [
            { link: "/school/inventory/items", label: "Items" },
            { link: "/school/inventory/issue", label: "Issue Items" },
            { link: "/school/inventory/store", label: "Stores" },
            { link: "/school/inventory/supplier", label: "Supplier" },
        ]
    },
    {
        label: "Transport", icon: DirectionsBusIcon,
        children: [
            { link: "/school/transport/routes", label: "Routes" },
            { link: "/school/transport/vehicles", label: "Vehicles" },
            { link: "/school/transport/assign", label: "Assign Vehicle" },
            { link: "/school/transport/drivers", label: "Drivers" },
        ]
    },
    {
        label: "Hostel", icon: HotelIcon,
        children: [
            { link: "/school/hostel/rooms", label: "Room List" },
            { link: "/school/hostel/type", label: "Room Type" },
            { link: "/school/hostel/allotment", label: "Room Allotment" },
        ]
    },
    {
        label: "Certificate", icon: WorkspacePremiumIcon,
        children: [
            { link: "/school/certificate/custom", label: "Custom Certificate" },
            { link: "/school/certificate/id-card", label: "ID Card" },
        ]
    },
    {
        label: "Front CMS", icon: WebIcon,
        children: [
            { link: "/school/cms/pages", label: "Pages" },
            { link: "/school/cms/slider", label: "Slider" },
            { link: "/school/cms/gallery", label: "Gallery" },
            { link: "/school/cms/events", label: "Events" },
        ]
    },
    {
        label: "Alumni", icon: GroupsIcon,
        children: [
            { link: "/school/alumni/list", label: "Alumni List" },
            { link: "/school/alumni/registration", label: "Registration" },
        ]
    },
    {
    label: "Reports", icon: BarChartIcon,
    children: [
        { link: "/school/reports/student-information", label: "Student Information" },
        { link: "/school/reports/finance", label: "Finance" },
        { link: "/school/reports/attendance", label: "Attendance" },
        { link: "/school/reports/examinations", label: "Examinations" },
        { link: "/school/reports/online-examinations", label: "Online Examinations" },
        { link: "/school/reports/lesson-plan", label: "Lesson Plan" },
        { link: "/school/reports/human-resource", label: "Human Resource" },
        { link: "/school/reports/homework", label: "Homework" },
        { link: "/school/reports/library", label: "Library" },
        { link: "/school/reports/inventory", label: "Inventory" },
        { link: "/school/reports/transport", label: "Transport" },
        { link: "/school/reports/hostel", label: "Hostel" },
        { link: "/school/reports/alumni", label: "Alumni" },
        { link: "/school/reports/user-log", label: "User Log" },
        { link: "/school/reports/audit-trail", label: "Audit Trail Report" },
    ]
},
    {
    label: "System Setting", icon: SettingsIcon,
    children: [
        { link: "/school/settings/general", label: "General Setting" },
        { link: "/school/settings/session", label: "Session Setting" },
        { link: "/school/settings/notification", label: "Notification Setting" },
        { link: "/school/settings/sms", label: "SMS Setting" },
        { link: "/school/settings/email", label: "Email Setting" },
        { link: "/school/settings/payment-methods", label: "Payment Methods" },
        { link: "/school/settings/print-header-footer", label: "Print Header Footer" },
        { link: "/school/settings/front-cms", label: "Front CMS Setting" },
        { link: "/school/settings/roles", label: "Roles Permissions" },
        { link: "/school/settings/backup", label: "Backup Restore" },
        { link: "/school/settings/languages", label: "Languages" },
        { link: "/school/settings/currency", label: "Currency" },
        { link: "/school/settings/users", label: "Users" },
        { link: "/school/settings/modules", label: "Modules" },
        { link: "/school/settings/custom-fields", label: "Custom Fields" },
        { link: "/school/settings/captcha", label: "Captcha Setting" },
        { link: "/school/settings/system-fields", label: "System Fields" },
        { link: "/school/settings/student-profile-update", label: "Student Profile Update" },
        { link: "/school/settings/online-admission", label: "Online Admission" },
        { link: "/school/settings/file-types", label: "File Types" },
        { link: "/school/settings/sidebar-menu", label: "Sidebar Menu" },
    ]
},
    { link: "/logout", label: "Log Out", icon: LogoutIcon },
];

export default function School() {
    const theme = useTheme();
    const { user } = React.useContext(AuthContext);
    useDocumentTitle("School", SCHOOL_DOC_TITLE_MAP);
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [confirmLogout, setConfirmLogout] = React.useState(false);
    const [expandedItems, setExpandedItems] = React.useState({});
    const location = useLocation();
    const navigate = useNavigate();
    const schoolDisplayName = user?.school_name || APP_NAME;

    const handleNavigation = (link) => {
        if (!link) return;
        if (link === "/logout") {
            setConfirmLogout(true);
            return;
        }
        navigate(link);
    };

    const handleToggleExpand = (label) => {
        if (!open) {
            setOpen(true);
            setExpandedItems((prev) => ({ ...prev, [label]: true }));
            return;
        }
        setExpandedItems((prev) => ({ ...prev, [label]: !prev[label] }));
    };

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => {
        setOpen(false);
        setExpandedItems({});
    };

    const isActive = (link) => {
        if (!link || link === "/logout") return false;
        if (link === "/school") return location.pathname === "/school";
        return location.pathname.startsWith(link);
    };

    const isGroupActive = (item) => {
        if (!item.children) return false;
        return item.children.some((c) => isActive(c.link));
    };

    const filteredNav = React.useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return NAV_ITEMS;
        return NAV_ITEMS.filter((n) => {
            if ((n.label || "").toLowerCase().includes(q)) return true;
            if (n.children) return n.children.some((c) => c.label.toLowerCase().includes(q));
            return false;
        });
    }, [query]);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={[{ marginRight: 5 }, open && { display: 'none' }]}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {schoolDisplayName}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer variant="permanent" open={open}>
                {/* ── Header ── */}
                <DrawerHeader sx={{ justifyContent: 'space-between', px: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 1 }}>
                        <Box
                            component="img"
                            src={LOGO_URL}
                            alt={`${APP_NAME} logo`}
                            sx={{ width: 34, height: 34, borderRadius: 2, display: open ? 'block' : 'none' }}
                        />
                        {open && (
                            <Box>
                                <Typography sx={{ fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                                    {APP_NAME}
                                </Typography>
                                <Chip
                                    size="small"
                                    label="School Admin"
                                    sx={{
                                        height: 20,
                                        fontWeight: 800,
                                        fontSize: '0.7rem',
                                        bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.24 : 0.12),
                                        color: theme.palette.primary.main,
                                        mt: 0.35,
                                    }}
                                />
                            </Box>
                        )}
                    </Box>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>

                <Divider />

                {/* ── Search ── */}
                <Box sx={{ px: open ? 1.5 : 1, py: 1 }}>
                    <TextField
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        size="small"
                        placeholder="Search menu..."
                        fullWidth
                        sx={{
                            display: open ? 'block' : 'none',
                            '& .MuiInputBase-root': { borderRadius: 2 },
                        }}
                        InputProps={{
                            startAdornment: (
                                <Box sx={{ display: 'flex', alignItems: 'center', pr: 1, color: 'text.secondary' }}>
                                    <SearchIcon fontSize="small" />
                                </Box>
                            ),
                        }}
                    />
                </Box>

                {/* ── Nav List ── */}
                <List
                    sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', px: open ? 1 : 0.5, py: 0,
                        '&::-webkit-scrollbar': { width: 4 },
                        '&::-webkit-scrollbar-thumb': { borderRadius: 4, bgcolor: alpha(theme.palette.text.primary, 0.15) },
                    }}
                >
                    {filteredNav.map((navItem, index) => {
                        const isLogout = navItem.link === "/logout";
                        const hasChildren = !!navItem.children?.length;
                        const groupActive = isGroupActive(navItem);
                        const active = !hasChildren && isActive(navItem.link);
                        const expanded = !!expandedItems[navItem.label];
                        const Icon = navItem.icon;

                        // ── Separator before Logout ──
                        const separator = isLogout ? <Divider sx={{ my: 1 }} /> : null;

                        const parentButton = (
                            <ListItemButton
                                selected={active || groupActive}
                                onClick={() => hasChildren ? handleToggleExpand(navItem.label) : handleNavigation(navItem.link)}
                                sx={{
                                    minHeight: 42,
                                    px: open ? 1.5 : 1.25,
                                    mb: 0.25,
                                    borderRadius: 2,
                                    justifyContent: open ? 'initial' : 'center',
                                    color: isLogout ? 'error.main' : 'text.primary',
                                    '&.Mui-selected': {
                                        bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.24 : 0.12),
                                        color: theme.palette.primary.main,
                                        '& .MuiListItemIcon-root': { color: theme.palette.primary.main },
                                    },
                                    '&:hover': {
                                        bgcolor: alpha(
                                            isLogout ? theme.palette.error.main : theme.palette.primary.main,
                                            theme.palette.mode === 'dark' ? 0.18 : 0.10
                                        ),
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 1.5 : 'auto',
                                        justifyContent: 'center',
                                        color: isLogout
                                            ? 'error.main'
                                            : (groupActive || active) ? 'primary.main' : 'text.secondary',
                                    }}
                                >
                                    <Icon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={navItem.label}
                                    primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: groupActive || active ? 700 : 500 }}
                                    sx={{ opacity: open ? 1 : 0 }}
                                />
                                {open && hasChildren && (
                                    expanded
                                        ? <ExpandLess fontSize="small" sx={{ color: 'text.secondary', ml: 0.5 }} />
                                        : <ExpandMore fontSize="small" sx={{ color: 'text.secondary', ml: 0.5 }} />
                                )}
                            </ListItemButton>
                        );

                        return (
                            <React.Fragment key={index}>
                                {separator}
                                <ListItem disablePadding sx={{ display: 'block' }}>
                                    {open ? parentButton : (
                                        <Tooltip title={navItem.label} placement="right" arrow>
                                            {parentButton}
                                        </Tooltip>
                                    )}
                                </ListItem>

                                {/* ── Sub-items ── */}
                                {hasChildren && open && (
                                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                                        <List disablePadding sx={{ pl: 1 }}>
                                            {navItem.children.map((child, ci) => {
                                                const childActive = isActive(child.link);
                                                return (
                                                    <ListItem key={ci} disablePadding sx={{ display: 'block' }}>
                                                        <ListItemButton
                                                            selected={childActive}
                                                            onClick={() => handleNavigation(child.link)}
                                                            sx={{
                                                                minHeight: 36,
                                                                px: 1.5,
                                                                mb: 0.15,
                                                                borderRadius: 2,
                                                                '&.Mui-selected': {
                                                                    bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.2 : 0.10),
                                                                    color: theme.palette.primary.main,
                                                                },
                                                                '&:hover': {
                                                                    bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.14 : 0.07),
                                                                },
                                                            }}
                                                        >
                                                            <ListItemIcon sx={{ minWidth: 0, mr: 1.5, justifyContent: 'center' }}>
                                                                <FiberManualRecordIcon
                                                                    sx={{
                                                                        fontSize: childActive ? 8 : 6,
                                                                        color: childActive ? 'primary.main' : alpha(theme.palette.text.secondary, 0.5),
                                                                    }}
                                                                />
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                primary={child.label}
                                                                primaryTypographyProps={{
                                                                    fontSize: '0.8125rem',
                                                                    fontWeight: childActive ? 700 : 400,
                                                                    color: childActive ? 'primary.main' : 'text.secondary',
                                                                }}
                                                            />
                                                        </ListItemButton>
                                                    </ListItem>
                                                );
                                            })}
                                        </List>
                                    </Collapse>
                                )}
                            </React.Fragment>
                        );
                    })}
                </List>

                <Divider />
            </Drawer>

            {/* ── Main Content ── */}
            <Box component="main" sx={{ flexGrow: 1, minHeight: '100vh' }}>
                <DrawerHeader />
                <Outlet />
            </Box>

            {/* ── Logout Dialog ── */}
            <Dialog open={confirmLogout} onClose={() => setConfirmLogout(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 900 }}>Confirm logout</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        You will be signed out from your account.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={() => setConfirmLogout(false)}
                        variant="outlined"
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 800 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => { setConfirmLogout(false); navigate("/logout"); }}
                        variant="contained"
                        color="error"
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 900, boxShadow: 'none' }}
                    >
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}