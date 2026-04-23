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
import Stack from '@mui/material/Stack';
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

import { Outlet, useLocation, useNavigate } from "react-router-dom";

// ICONS
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import TheatersIcon from '@mui/icons-material/Theaters';
import GradingIcon from '@mui/icons-material/Grading';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import ExplicitIcon from '@mui/icons-material/Explicit';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import { APP_NAME, LOGO_URL } from "../branding";
import { AuthContext } from "../context/AuthContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const drawerWidth = 240;

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
    // necessary for content to be below app bar
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

export default function School() {
    const theme = useTheme();
    const { user } = React.useContext(AuthContext);
    useDocumentTitle("School", SCHOOL_DOC_TITLE_MAP);
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [confirmLogout, setConfirmLogout] = React.useState(false);
    const location = useLocation();
    const schoolDisplayName = user?.school_name || APP_NAME;

    const navArr = [
        { link: "/school", component: "Dashboard", icon: DashboardIcon },
        { link: "/school/class", component: "Class", icon:FormatListNumberedIcon },
        { link: "/school/subject", component: "Subjects", icon: MenuBookIcon },
        { link: "/school/students", component: "Students", icon: GroupIcon },
        { link: "/school/teachers", component: "Teachers", icon: GroupIcon },
        { link: "/school/periods", component: "Schedule", icon: CalendarMonthIcon },
        { link: "/school/attendance", component: "Attendance", icon: RecentActorsIcon },
        { link: "/school/examinations", component: "Examinations", icon: ExplicitIcon},
        {link:"/school/notice", component:"Notice", icon:CircleNotificationsIcon},
        {link:"/logout", component:"Log Out", icon:LogoutIcon}
    ]
    const navigate = useNavigate();
    const handleNavigation = (link) => {
        if (link === "/logout") {
            setConfirmLogout(true);
            return;
        }
        navigate(link);
    }
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const filteredNav = React.useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return navArr;
        return navArr.filter((n) => (n.component || "").toLowerCase().includes(q));
    }, [navArr, query]);

    const isActive = (link) => {
        if (!link || link === "/logout") return false;
        if (link === "/school") return location.pathname === "/school";
        return location.pathname.startsWith(link);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar sx={{  }} position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={[
                            {
                                marginRight: 5,
                            },
                            open && { display: 'none' },
                        ]}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {schoolDisplayName}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader sx={{ justifyContent: 'space-between', px: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 1 }}>
                        <Box
                            component="img"
                            src={LOGO_URL}
                            alt={`${APP_NAME} logo`}
                            sx={{
                                width: 34,
                                height: 34,
                                borderRadius: 2,
                                display: open ? 'block' : 'none',
                            }}
                        />
                        {open ? (
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
                        ) : null}
                    </Box>

                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
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

                <List sx={{ height: "100%", px: open ? 1 : 0.5 }}>
                    {filteredNav && filteredNav.map((navItem, index) => {
                        const active = isActive(navItem.link);
                        const isLogout = navItem.link === "/logout";

                        const button = (
                            <ListItemButton
                                selected={active}
                                sx={{
                                    minHeight: 44,
                                    px: open ? 1.5 : 1.25,
                                    mb: 0.5,
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
                                onClick={() => { handleNavigation(navItem.link) }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 1.5 : 'auto',
                                        justifyContent: 'center',
                                        color: isLogout ? 'error.main' : 'text.secondary',
                                    }}
                                >
                                    <navItem.icon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={navItem.component}
                                    sx={{ opacity: open ? 1 : 0 }}
                                />
                            </ListItemButton>
                        );

                        return (
                            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                                {open ? button : (
                                    <Tooltip title={navItem.component} placement="right" arrow>
                                        {button}
                                    </Tooltip>
                                )}
                            </ListItem>
                        );
                    })}
                </List>
                <Divider />

            </Drawer>
            <Box component="main" sx={{ flexGrow: 1,minHeight:'100vh'}}>
                <DrawerHeader />
                <Outlet />
            </Box>

            <Dialog open={confirmLogout} onClose={() => setConfirmLogout(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 900 }}>Confirm logout</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        You will be signed out from your account.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setConfirmLogout(false)} variant="outlined" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 800 }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            setConfirmLogout(false);
                            navigate("/logout");
                        }}
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