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
import InputAdornment from '@mui/material/InputAdornment';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import DashboardIcon from '@mui/icons-material/Dashboard';
import GradingIcon from '@mui/icons-material/Grading';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import FrontDeskIcon from '@mui/icons-material/SupportAgent';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PaymentIcon from '@mui/icons-material/Payment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CreditCardIcon from '@mui/icons-material/CreditCard';
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

import { APP_NAME, LOGO_URL } from '../branding';
import { AuthContext } from '../context/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

// ─── Constants ────────────────────────────────────────────────────────────────
const DRAWER_WIDTH = 264;

const SB_BG     = '#1e2130';
const SB_HOVER  = '#2a2f47';
const SB_ACTIVE = '#2d3350';
const SB_BORDER = '#2e3348';
const SB_ICON   = '#7b82a8';
const SB_TEXT   = '#b8bdd8';
const SB_ACCENT = '#7c8ffc';

const SCHOOL_DOC_TITLE_MAP = {
    '/school': 'Dashboard',
    '/school/class': 'Classes',
    '/school/subject': 'Subjects',
    '/school/students': 'Students',
    '/school/teachers': 'Teachers',
    '/school/periods': 'Schedule',
    '/school/attendance': 'Attendance',
    '/school/examinations': 'Examinations',
    '/school/notice': 'Notices',
};

// ─── Styled Components ────────────────────────────────────────────────────────
const openedMixin = (theme) => ({
    width: DRAWER_WIDTH,
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
    backgroundColor: '#ffffff',
    color: '#1a1a2e',
    boxShadow: '0 1px 0 rgba(0,0,0,0.08)',
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                marginLeft: DRAWER_WIDTH,
                width: `calc(100% - ${DRAWER_WIDTH}px)`,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

const DesktopDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        width: DRAWER_WIDTH,
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

// ─── Nav Config ───────────────────────────────────────────────────────────────
const NAV_ITEMS = [
    { link: '/school', label: 'Dashboard', icon: DashboardIcon },
    {
        label: 'Edu Smart', icon: AssignmentIcon,
        children: [
            { link: '/school/class', label: 'Class' },
            { link: '/school/subject', label: 'Subjects' },
            { link: '/school/students', label: 'Students' },
            { link: '/school/teachers', label: 'Teachers' },
            { link: '/school/periods', label: 'Schedule' },
            { link: '/school/attendance', label: 'Attendance' },
            { link: '/school/examinations', label: 'Examinations' },
            { link: '/school/notice', label: 'Notice' },
        ],
    },
    {
        label: 'Front Office', icon: FrontDeskIcon,
        children: [
            { link: '/school/front-office/admission-enquiry', label: 'Admission Enquiry' },
            { link: '/school/front-office/visitor-book', label: 'Visitor Book' },
            { link: '/school/front-office/phone-call-log', label: 'Phone Call Log' },
            { link: '/school/front-office/postal-dispatch', label: 'Postal Dispatch' },
            { link: '/school/front-office/postal-receive', label: 'Postal Receive' },
            { link: '/school/front-office/complain', label: 'Complain' },
            { link: '/school/front-office/setup', label: 'Setup Front Office' },
        ],
    },
    {
        label: 'Student Information', icon: GroupAddIcon,
        children: [
            // { link: '/school/students', label: 'Student Details' },
            { link: '/school/students/admission', label: 'Student Admission' },
            { link: '/school/students/online-admission', label: 'Online Admission' },
            { link: '/school/students/disabled', label: 'Disabled Students' },
            { link: '/school/students/multi-class', label: 'Multi Class Student' },
            { link: '/school/students/bulk-delete', label: 'Bulk Delete' },
            { link: '/school/students/category', label: 'Student Categories' },
            { link: '/school/students/house', label: 'Student House' },
            { link: '/school/students/disable', label: 'Disable Reason' },
        ],
    },
    {
        label: 'Fees Collection', icon: PaymentIcon,
        children: [
            { link: '/school/fees/collect', label: 'Collect Fees' },
            { link: '/school/fees/demand-bill', label: 'Demand Bill Print' },
            { link: '/school/fees/offline-bank-payments', label: 'Offline Bank Payments' },
            { link: '/school/fees/search', label: 'Search Fees Payment' },
            { link: '/school/fees/search-due', label: 'Search Due Fees' },
            { link: '/school/fees/master', label: 'Fees Master' },
            { link: '/school/fees/group', label: 'Fees Group' },
            { link: '/school/fees/type', label: 'Fees Type' },
            { link: '/school/fees/discount', label: 'Fees Discount' },
            { link: '/school/fees/carry-forward', label: 'Fees Carry Forward' },
        ],
    },
    {
        label: 'Income', icon: AttachMoneyIcon,
        children: [
            { link: '/school/income/add', label: 'Add Income' },
            { link: '/school/income/list', label: 'Income List' },
            { link: '/school/income/head', label: 'Income Head' },
            { link: '/school/income/search', label: 'Search Income' },
        ],
    },
    {
        label: 'Expenses', icon: CreditCardIcon,
        children: [
            { link: '/school/expenses/add', label: 'Add Expense' },
            { link: '/school/expenses/list', label: 'Expense List' },
            { link: '/school/expenses/head', label: 'Expense Head' },
            { link: '/school/expenses/search', label: 'Search Expense' },
        ],
    },
    {
        label: 'Examinations', icon: GradingIcon,
        children: [
            { link: '/school/examinations', label: 'Exam Schedule' },
            { link: '/school/examinations/marks', label: 'Exam Marks' },
            { link: '/school/examinations/admit-card', label: 'Admit Card' },
            { link: '/school/examinations/marks-register', label: 'Marks Register' },
            { link: '/school/examinations/report-card', label: 'Report Card' },
            { link: '/school/examinations/grade', label: 'Grade' },
        ],
    },
    {
        label: 'Attendance', icon: RecentActorsIcon,
        children: [
            { link: '/school/attendance', label: 'Student Attendance' },
            { link: '/school/attendance/teacher', label: 'Teacher Attendance' },
            { link: '/school/attendance/report', label: 'Attendance Report' },
        ],
    },
    {
        label: 'Online Examinations', icon: ComputerIcon,
        children: [
            { link: '/school/online-exam/list', label: 'Online Exam List' },
            { link: '/school/online-exam/questions', label: 'Question Bank' },
            { link: '/school/online-exam/results', label: 'Results' },
        ],
    },
    {
        label: 'Academics', icon: SchoolIcon,
        children: [
            { link: '/school/class', label: 'Classes' },
            { link: '/school/subject', label: 'Subjects' },
            { link: '/school/periods', label: 'Schedule / Timetable' },
            { link: '/school/assign-period', label: 'Assign Period' },
            { link: '/school/academics/promote', label: 'Promote Students' },
        ],
    },
    {
        label: 'Lesson Plan', icon: AutoStoriesIcon,
        children: [
            { link: '/school/lesson-plan/list', label: 'Lesson Plans' },
            { link: '/school/lesson-plan/topic', label: 'Topics' },
            { link: '/school/lesson-plan/syllabus', label: 'Syllabus Status' },
        ],
    },
    {
        label: 'Human Resource', icon: PeopleAltIcon,
        children: [
            { link: '/school/teachers', label: 'Teachers' },
            { link: '/school/hr/staff', label: 'Staff' },
            { link: '/school/hr/payroll', label: 'Payroll' },
            { link: '/school/hr/leave', label: 'Leave' },
            { link: '/school/hr/department', label: 'Department' },
            { link: '/school/hr/designation', label: 'Designation' },
        ],
    },
    {
        label: 'Communicate', icon: CampaignIcon,
        children: [
            { link: '/school/communicate/notice', label: 'Notice Board' },
            { link: '/school/communicate/send-email', label: 'Send Email' },
            { link: '/school/communicate/send-sms', label: 'Send SMS' },
            { link: '/school/communicate/news', label: 'News' },
            { link: '/school/communicate/events', label: 'Events' },
            { link: '/school/communicate/holidays', label: 'Holidays' },
        ],
    },
    {
        label: 'Download Center', icon: DownloadIcon,
        children: [
            { link: '/school/downloads/upload', label: 'Upload Content' },
            { link: '/school/downloads/list', label: 'Download List' },
        ],
    },
    {
        label: 'Homework', icon: AssignmentIcon,
        children: [
            { link: '/school/homework/add', label: 'Add Homework' },
            { link: '/school/homework/list', label: 'Homework List' },
            { link: '/school/homework/evaluation', label: 'Evaluation' },
        ],
    },
    {
        label: 'Library', icon: LocalLibraryIcon,
        children: [
            { link: '/school/library/books', label: 'Books' },
            { link: '/school/library/issue', label: 'Issue / Return' },
            { link: '/school/library/members', label: 'Library Members' },
            { link: '/school/library/category', label: 'Book Category' },
        ],
    },
    {
        label: 'Inventory', icon: InventoryIcon,
        children: [
            { link: '/school/inventory/items', label: 'Items' },
            { link: '/school/inventory/issue', label: 'Issue Items' },
            { link: '/school/inventory/store', label: 'Stores' },
            { link: '/school/inventory/supplier', label: 'Supplier' },
        ],
    },
    {
        label: 'Transport', icon: DirectionsBusIcon,
        children: [
            { link: '/school/transport/routes', label: 'Routes' },
            { link: '/school/transport/vehicles', label: 'Vehicles' },
            { link: '/school/transport/assign', label: 'Assign Vehicle' },
            { link: '/school/transport/drivers', label: 'Drivers' },
        ],
    },
    {
        label: 'Hostel', icon: HotelIcon,
        children: [
            { link: '/school/hostel/rooms', label: 'Room List' },
            { link: '/school/hostel/type', label: 'Room Type' },
            { link: '/school/hostel/allotment', label: 'Room Allotment' },
        ],
    },
    {
        label: 'Certificate', icon: WorkspacePremiumIcon,
        children: [
            { link: '/school/certificate/custom', label: 'Custom Certificate' },
            { link: '/school/certificate/id-card', label: 'ID Card' },
        ],
    },
    {
        label: 'Front CMS', icon: WebIcon,
        children: [
            { link: '/school/cms/pages', label: 'Pages' },
            { link: '/school/cms/slider', label: 'Slider' },
            { link: '/school/cms/gallery', label: 'Gallery' },
            { link: '/school/cms/events', label: 'Events' },
        ],
    },
    {
        label: 'Alumni', icon: GroupsIcon,
        children: [
            { link: '/school/alumni/list', label: 'Alumni List' },
            { link: '/school/alumni/registration', label: 'Registration' },
        ],
    },
    {
        label: 'Reports', icon: BarChartIcon,
        children: [
            { link: '/school/reports/student-information', label: 'Student Information' },
            { link: '/school/reports/finance', label: 'Finance' },
            { link: '/school/reports/attendance', label: 'Attendance' },
            { link: '/school/reports/examinations', label: 'Examinations' },
            { link: '/school/reports/human-resource', label: 'Human Resource' },
            { link: '/school/reports/library', label: 'Library' },
            { link: '/school/reports/transport', label: 'Transport' },
            { link: '/school/reports/hostel', label: 'Hostel' },
        ],
    },
    {
        label: 'System Setting', icon: SettingsIcon,
        children: [
            { link: '/school/settings/general', label: 'General Setting' },
            { link: '/school/settings/session', label: 'Session Setting' },
            { link: '/school/settings/roles', label: 'Roles Permissions' },
            { link: '/school/settings/users', label: 'Users' },
            { link: '/school/settings/modules', label: 'Modules' },
            { link: '/school/settings/sidebar-menu', label: 'Sidebar Menu' },
        ],
    },
    { link: '/logout', label: 'Log Out', icon: LogoutIcon },
];

// ─── Shared Sidebar Content ───────────────────────────────────────────────────
function SidebarContent({ open, query, setQuery, filteredNav, expandedLabel, handleToggleExpand, handleNavigation, handleClose, isActive, isGroupActive, theme }) {
    return (
        <>
            {/* Header */}
            <DrawerHeader sx={{
                justifyContent: 'space-between',
                px: 1.5,
                minHeight: '58px !important',
                borderBottom: `1px solid ${SB_BORDER}`,
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, overflow: 'hidden' }}>
                    <Box
                        component="img"
                        src={LOGO_URL}
                        alt={`${APP_NAME} logo`}
                        sx={{ width: 34, height: 34, borderRadius: 2, flexShrink: 0 }}
                    />
                    {open && (
                        <Box sx={{ overflow: 'hidden' }}>
                            <Typography sx={{
                                fontWeight: 900, fontSize: '0.9rem',
                                letterSpacing: '-0.02em', lineHeight: 1.2,
                                color: '#ffffff', whiteSpace: 'nowrap',
                            }}>
                                {APP_NAME}
                            </Typography>
                            <Chip
                                size="small"
                                label="School Admin"
                                sx={{
                                    height: 18, mt: 0.4,
                                    fontWeight: 700, fontSize: '0.65rem',
                                    bgcolor: alpha(SB_ACCENT, 0.18),
                                    color: SB_ACCENT,
                                }}
                            />
                        </Box>
                    )}
                </Box>
                <IconButton
                    onClick={handleClose}
                    size="small"
                    sx={{
                        border: `1px solid ${SB_BORDER}`,
                        borderRadius: 2, p: 0.6,
                        color: SB_ICON, flexShrink: 0,
                        '&:hover': { bgcolor: SB_HOVER, color: '#fff' },
                    }}
                >
                    {theme.direction === 'rtl'
                        ? <ChevronRightIcon fontSize="small" />
                        : <ChevronLeftIcon fontSize="small" />}
                </IconButton>
            </DrawerHeader>

            {/* Search — only when expanded */}
            {open && (
                <Box sx={{ px: 1.5, py: 1.25, borderBottom: `1px solid ${SB_BORDER}` }}>
                    <TextField
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        size="small"
                        placeholder="Search menu..."
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ fontSize: 16, color: SB_ICON }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                fontSize: '0.8125rem',
                                bgcolor: alpha('#ffffff', 0.05),
                                color: '#fff',
                                '& fieldset': { borderColor: SB_BORDER },
                                '&:hover fieldset': { borderColor: alpha(SB_ACCENT, 0.5) },
                                '&.Mui-focused fieldset': { borderColor: SB_ACCENT, borderWidth: 1.5 },
                                '& input::placeholder': { color: SB_ICON, opacity: 1 },
                            },
                        }}
                    />
                </Box>
            )}

            {/* Nav List */}
            <List sx={{
                flexGrow: 1, overflowY: 'auto', overflowX: 'hidden',
                px: open ? 1 : 0.5, py: 1,
                '&::-webkit-scrollbar': { width: 3 },
                '&::-webkit-scrollbar-thumb': { borderRadius: 4, bgcolor: alpha('#fff', 0.10) },
                '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
            }}>
                {filteredNav.map((navItem, index) => {
                    const isLogout    = navItem.link === '/logout';
                    const hasChildren = !!navItem.children?.length;
                    const groupActive = isGroupActive(navItem);
                    const active      = !hasChildren && isActive(navItem.link);
                    const expanded    = expandedLabel === navItem.label;
                    const Icon        = navItem.icon;

                    const parentBtn = (
                        <ListItemButton
                            selected={active || groupActive}
                            onClick={() =>
                                hasChildren
                                    ? handleToggleExpand(navItem.label)
                                    : handleNavigation(navItem.link)
                            }
                            sx={{
                                minHeight: 42,
                                px: open ? 1.5 : 1.25,
                                mb: 0.25,
                                borderRadius: 1.5,
                                justifyContent: open ? 'initial' : 'center',
                                color: isLogout ? '#fc8181' : SB_TEXT,
                                transition: 'all 0.15s ease',
                                '&.Mui-selected': {
                                    bgcolor: SB_ACTIVE,
                                    color: '#ffffff',
                                    '& .MuiListItemIcon-root': { color: SB_ACCENT },
                                    '&:hover': { bgcolor: alpha(SB_ACCENT, 0.22) },
                                },
                                '&:hover': {
                                    bgcolor: isLogout ? alpha('#fc8181', 0.10) : SB_HOVER,
                                    color: isLogout ? '#fc8181' : '#ffffff',
                                    '& .MuiListItemIcon-root': { color: isLogout ? '#fc8181' : SB_ACCENT },
                                },
                            }}
                        >
                            <ListItemIcon sx={{
                                minWidth: 0,
                                mr: open ? 1.5 : 'auto',
                                justifyContent: 'center',
                                color: isLogout ? '#fc8181' : groupActive || active ? SB_ACCENT : SB_ICON,
                                transition: 'color 0.15s',
                            }}>
                                <Icon sx={{ fontSize: 18 }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={navItem.label}
                                primaryTypographyProps={{
                                    fontSize: '0.845rem',
                                    fontWeight: groupActive || active ? 700 : 500,
                                    letterSpacing: '-0.005em',
                                    color: 'inherit',
                                }}
                                sx={{ opacity: open ? 1 : 0, transition: 'opacity 0.2s' }}
                            />
                            {open && hasChildren && (
                                expanded
                                    ? <ExpandLess sx={{ fontSize: 16, color: SB_ICON, ml: 0.5, flexShrink: 0 }} />
                                    : <ExpandMore sx={{ fontSize: 16, color: SB_ICON, ml: 0.5, flexShrink: 0 }} />
                            )}
                        </ListItemButton>
                    );

                    return (
                        <React.Fragment key={index}>
                            {isLogout && <Divider sx={{ my: 1, borderColor: SB_BORDER }} />}
                            <ListItem disablePadding sx={{ display: 'block' }}>
                                {open ? parentBtn : (
                                    <Tooltip
                                        title={navItem.label}
                                        placement="right"
                                        arrow
                                        componentsProps={{
                                            tooltip: {
                                                sx: {
                                                    bgcolor: '#2d3350',
                                                    color: '#fff',
                                                    fontSize: '0.78rem',
                                                    fontWeight: 600,
                                                    borderRadius: 1.5,
                                                    boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                                                },
                                            },
                                        }}
                                    >
                                        {parentBtn}
                                    </Tooltip>
                                )}
                            </ListItem>
                            {hasChildren && open && (
                                <Collapse in={expanded} timeout="auto" unmountOnExit>
                                    <List disablePadding sx={{ pl: 1, pb: 0.5 }}>
                                        {navItem.children.map((child, ci) => {
                                            const childActive = isActive(child.link);
                                            return (
                                                <ListItem key={ci} disablePadding sx={{ display: 'block' }}>
                                                    <ListItemButton
                                                        selected={childActive}
                                                        onClick={() => handleNavigation(child.link)}
                                                        sx={{
                                                            minHeight: 34,
                                                            px: 1.5, mb: 0.1,
                                                            borderRadius: 1.5,
                                                            transition: 'all 0.13s ease',
                                                            '&.Mui-selected': {
                                                                bgcolor: alpha(SB_ACCENT, 0.12),
                                                                '&:hover': { bgcolor: alpha(SB_ACCENT, 0.18) },
                                                            },
                                                            '&:hover': { bgcolor: SB_HOVER },
                                                        }}
                                                    >
                                                        <ListItemIcon sx={{ minWidth: 0, mr: 1.5, justifyContent: 'center' }}>
                                                            <FiberManualRecordIcon sx={{
                                                                fontSize: childActive ? 7 : 5,
                                                                color: childActive ? SB_ACCENT : alpha('#fff', 0.22),
                                                                transition: 'all 0.15s',
                                                            }} />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={child.label}
                                                            primaryTypographyProps={{
                                                                fontSize: '0.8rem',
                                                                fontWeight: childActive ? 700 : 400,
                                                                color: childActive ? '#ffffff' : SB_TEXT,
                                                                letterSpacing: '-0.005em',
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
            <Divider sx={{ borderColor: SB_BORDER }} />
        </>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function School() {
    const theme = useTheme();
    const { user } = React.useContext(AuthContext);
    useDocumentTitle('School', SCHOOL_DOC_TITLE_MAP);

    // mobileOpen  → controls the temporary mobile drawer (open/close)
    // desktopOpen → controls the permanent desktop drawer (expanded/collapsed)
    const [mobileOpen,  setMobileOpen]  = React.useState(false);
    const [desktopOpen, setDesktopOpen] = React.useState(false);
    const [query,        setQuery]       = React.useState('');
    const [confirmLogout, setConfirmLogout] = React.useState(false);
    const [expandedLabel, setExpandedLabel] = React.useState(null);

    const location = useLocation();
    const navigate = useNavigate();
    const schoolDisplayName = user?.school_name || APP_NAME;

    // Mobile: toggle open/close
    const handleMobileToggle = () => setMobileOpen((prev) => !prev);

    // Desktop: expand
    const handleDesktopOpen  = () => setDesktopOpen(true);
    // Desktop: collapse
    const handleDesktopClose = () => { setDesktopOpen(false); setExpandedLabel(null); };

    const handleNavigation = (link) => {
        if (!link) return;
        if (link === '/logout') { setConfirmLogout(true); return; }
        
        // Scroll to top before navigation for smooth transition
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        navigate(link);
        setMobileOpen(false); // auto-close mobile drawer after navigation
    };

    const handleToggleExpand = (label) => {
        if (!desktopOpen && !mobileOpen) { setDesktopOpen(true); setExpandedLabel(label); return; }
        setExpandedLabel((prev) => (prev === label ? null : label));
    };

    const isActive = (link) => {
        if (!link || link === '/logout') return false;
        if (link === '/school') return location.pathname === '/school';
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
            if ((n.label || '').toLowerCase().includes(q)) return true;
            if (n.children) return n.children.some((c) => c.label.toLowerCase().includes(q));
            return false;
        });
    }, [query]);

    const sharedProps = {
        query, setQuery,
        filteredNav,
        expandedLabel,
        handleToggleExpand,
        handleNavigation,
        isActive,
        isGroupActive,
        theme,
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            {/* ── AppBar ── */}
            <AppBar position="fixed" open={desktopOpen}>
                <Toolbar sx={{ minHeight: '58px !important' }}>
                    {/* Mobile menu icon — visible only on small screens */}
                    <IconButton
                        aria-label="open mobile drawer"
                        onClick={handleMobileToggle}
                        edge="start"
                        sx={{
                            mr: 2,
                            color: '#444',
                            border: '1px solid #eee',
                            borderRadius: 2,
                            p: 0.75,
                            display: { xs: 'inline-flex', md: 'none' },
                        }}
                    >
                        <MenuIcon fontSize="small" />
                    </IconButton>

                    {/* Desktop menu icon — visible only on large screens */}
                    <IconButton
                        aria-label="toggle desktop drawer"
                        onClick={desktopOpen ? handleDesktopClose : handleDesktopOpen}
                        edge="start"
                        sx={{
                            mr: 2,
                            color: '#444',
                            border: '1px solid #eee',
                            borderRadius: 2,
                            p: 0.75,
                            display: { xs: 'none', md: 'inline-flex' },
                        }}
                    >
                        <MenuIcon fontSize="small" />
                    </IconButton>

                    <Typography
                        variant="h6"
                        noWrap
                        sx={{ fontWeight: 800, fontSize: '1rem', color: '#1a1a2e', letterSpacing: '-0.01em' }}
                    >
                        {schoolDisplayName}
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* ── Mobile Drawer (temporary overlay, xs/sm only) ── */}
            <MuiDrawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleMobileToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        bgcolor: SB_BG,
                        borderRight: 'none',
                        boxShadow: '4px 0 24px rgba(0,0,0,0.4)',
                        boxSizing: 'border-box',
                    },
                }}
            >
                <SidebarContent
                    {...sharedProps}
                    open={true}
                    handleClose={handleMobileToggle}
                />
            </MuiDrawer>

            {/* ── Desktop Drawer (permanent collapsible, md+ only) ── */}
            <DesktopDrawer
                variant="permanent"
                open={desktopOpen}
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': {
                        bgcolor: SB_BG,
                        borderRight: 'none',
                        boxShadow: '2px 0 12px rgba(0,0,0,0.15)',
                    },
                }}
            >
                <SidebarContent
                    {...sharedProps}
                    open={desktopOpen}
                    handleClose={handleDesktopClose}
                />
            </DesktopDrawer>

            {/* ── Main Content ── */}
            <Box component="main" sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f7f8fc' }}>
                <DrawerHeader />
                <Outlet />
            </Box>

            {/* ── Logout Confirm Dialog ── */}
            <Dialog
                open={confirmLogout}
                onClose={() => setConfirmLogout(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' } }}
            >
                <DialogTitle sx={{ fontWeight: 900, fontSize: '1.05rem', pb: 1 }}>
                    Confirm logout
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                        You will be signed out from your account. Any unsaved changes may be lost.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 1, gap: 1 }}>
                    <Button
                        onClick={() => setConfirmLogout(false)}
                        variant="outlined"
                        sx={{
                            borderRadius: 2, textTransform: 'none', fontWeight: 700,
                            fontSize: '0.875rem', borderColor: '#ddd', color: '#555',
                            '&:hover': { borderColor: '#bbb', bgcolor: '#f5f5f5' },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => { setConfirmLogout(false); navigate('/logout'); }}
                        variant="contained"
                        color="error"
                        sx={{
                            borderRadius: 2, textTransform: 'none', fontWeight: 800,
                            fontSize: '0.875rem', boxShadow: 'none',
                            '&:hover': { boxShadow: 'none' },
                        }}
                    >
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
