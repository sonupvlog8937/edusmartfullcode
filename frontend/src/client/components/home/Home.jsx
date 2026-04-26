import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography,
  Grid2,
  Card,
  CardContent,
  Box,
  Container,
  Button,
  Avatar,
  Chip,
  Divider,
  useTheme,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab,
  Zoom,
  Link,
  alpha,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Carousel from './carousel/Carousel';
import { fetchTopSchools } from '../../../state/publicSchoolSlice';
import { baseUrl } from '../../../environment';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import GroupsIcon from '@mui/icons-material/Groups';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PaymentIcon from '@mui/icons-material/Payment';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import DevicesIcon from '@mui/icons-material/Devices';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VerifiedIcon from '@mui/icons-material/Verified';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChatIcon from '@mui/icons-material/Chat';
import LoginIcon from '@mui/icons-material/Login';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { APP_NAME, LOGO_URL } from '../../../branding';

// Helper function to get school image URL
const getSchoolImageSrc = (imageValue) => {
  if (!imageValue) return "";
  // If it's already a full URL (Cloudinary), return as is
  if (/^https?:\/\//i.test(imageValue)) return imageValue;
  // Otherwise, construct local path (for backward compatibility)
  const apiOrigin = baseUrl.replace(/\/api\/?$/, "");
  return `${apiOrigin}/images/uploaded/school/${imageValue}`;
};

// ─── Animated Counter ────────────────────────────────────────────────
const AnimatedCounter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const numTarget = parseInt(target.replace(/\D/g, ''));
    let current = 0;
    const step = Math.ceil(numTarget / 60);
    const timer = setInterval(() => {
      current = Math.min(current + step, numTarget);
      setCount(current);
      if (current >= numTarget) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [started, target]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
};

// ─── Section Heading ─────────────────────────────────────────────────
const SectionHeading = ({ badge, title, subtitle, align = 'center' }) => {
  const theme = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
    >
      {badge && (
        <Box sx={{ display: 'flex', justifyContent: align === 'center' ? 'center' : 'flex-start', mb: 2 }}>
          <Chip
            label={badge}
            size="small"
            sx={{
              bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.2 : 0.12),
              color: theme.palette.primary.main,
              fontWeight: 700,
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.35),
              px: 1,
            }}
          />
        </Box>
      )}
      <Typography
        variant="h2"
        textAlign={align}
        sx={{
          fontWeight: 800,
          color: 'text.primary',
          fontSize: { xs: '1.75rem', md: '2.4rem' },
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          mb: subtitle ? 2 : 0,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body1"
          textAlign={align}
          color="text.secondary"
          sx={{ maxWidth: 580, mx: align === 'center' ? 'auto' : 0, lineHeight: 1.7, fontSize: '1.05rem' }}
        >
          {subtitle}
        </Typography>
      )}
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────
const Home = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { topSchools, topSchoolsLoading } = useSelector((state) => state.publicSchool);
  const pageBg = theme.palette.background.default;
  const paperBg = theme.palette.background.paper;
  const dividerColor = theme.palette.divider;
  const headingColor = theme.palette.text.primary;
  const navBg = alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.72 : 0.9);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showFab, setShowFab] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);
  const handleScroll = () => setShowFab(window.scrollY > 400);
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    dispatch(fetchTopSchools());
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch]);

  useEffect(() => {
    const onHashNavigate = () => {
      const id = window.location.hash?.replace('#', '');
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    onHashNavigate();
    window.addEventListener('hashchange', onHashNavigate);
    return () => window.removeEventListener('hashchange', onHashNavigate);
  }, []);

  const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  const itemUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const STATS = useMemo(() => [
    {
      label: 'Registered Schools',
      value: '500',
      suffix: '+',
      icon: <SchoolIcon sx={{ fontSize: 32 }} />,
      color: '#3b82f6',
      bg: '#eff6ff',
      growth: '+12% this year',
    },
    {
      label: 'Happy Parents',
      value: '10000',
      suffix: '+',
      icon: <GroupsIcon sx={{ fontSize: 32 }} />,
      color: '#10b981',
      bg: '#ecfdf5',
      growth: '98% satisfaction rate',
    },
    {
      label: 'Awards Won',
      value: '25',
      suffix: '+',
      icon: <WorkspacePremiumIcon sx={{ fontSize: 32 }} />,
      color: '#f59e0b',
      bg: '#fffbeb',
      growth: 'National recognition',
    },
    {
      label: 'Years of Trust',
      value: '8',
      suffix: '+',
      icon: <VerifiedIcon sx={{ fontSize: 32 }} />,
      color: '#8b5cf6',
      bg: '#f5f3ff',
      growth: 'Established 2016',
    },
  ], []);

  const FEATURES = useMemo(() => [
    {
      title: 'Smart Attendance',
      desc: 'Biometric & app-based tracking for students and staff. Automated daily reports sent to parents.',
      icon: <AssessmentIcon sx={{ fontSize: 28 }} />,
      color: '#3b82f6',
      bg: '#eff6ff',
      highlights: ['Face recognition', 'SMS alerts', 'Monthly reports'],
    },
    {
      title: 'Fee Management',
      desc: 'Secure online payment gateway, automated reminders, and instant GST-compliant receipt generation.',
      icon: <PaymentIcon sx={{ fontSize: 28 }} />,
      color: '#10b981',
      bg: '#ecfdf5',
      highlights: ['UPI & cards', 'Auto reminders', 'Instant receipts'],
    },
    {
      title: 'Instant Notifications',
      desc: 'Real-time push alerts for exams, holidays, results, and school announcements directly to parents.',
      icon: <NotificationsActiveIcon sx={{ fontSize: 28 }} />,
      color: '#f59e0b',
      bg: '#fffbeb',
      highlights: ['Push & SMS', 'Multi-language', 'Scheduled alerts'],
    },
    {
      title: 'Academic Reports',
      desc: 'Comprehensive digital report cards, grade tracking, and subject-wise performance analytics.',
      icon: <TrendingUpIcon sx={{ fontSize: 28 }} />,
      color: '#8b5cf6',
      bg: '#f5f3ff',
      highlights: ['Grade analytics', 'PDF export', 'Parent portal'],
    },
    {
      title: 'Data Security',
      desc: 'Enterprise-grade 256-bit SSL encryption with regular backups and GDPR-compliant data handling.',
      icon: <SecurityIcon sx={{ fontSize: 28 }} />,
      color: '#ef4444',
      bg: '#fef2f2',
      highlights: ['SSL encrypted', 'GDPR compliant', 'Daily backups'],
    },
    {
      title: '24/7 Support',
      desc: 'Dedicated customer success team available round-the-clock via chat, call, and remote assistance.',
      icon: <SupportAgentIcon sx={{ fontSize: 28 }} />,
      color: '#06b6d4',
      bg: '#ecfeff',
      highlights: ['Live chat', 'Phone support', 'Remote access'],
    },
  ], []);

  const TESTIMONIALS = useMemo(() => [
    {
      name: 'Rajesh Kumar Sharma',
      role: 'Principal, Delhi Public School',
      text: 'Our administrative workload dropped by 60% in the first month. The fee collection alone has saved us 30+ hours weekly. The support team is exceptional.',
      rating: 5,
      avatar: 'R',
      avatarColor: '#3b82f6',
      verified: true,
    },
    {
      name: 'Priya Verma',
      role: 'Parent & PTA Chairperson',
      text: 'I can track my son attendance, see his marks, and pay fees in under 2 minutes — all from my phone. Best school app Ive ever used.',
      rating: 5,
      avatar: 'P',
      avatarColor: '#10b981',
      verified: true,
    },
    {
      name: 'Suresh Agarwal',
      role: 'School Owner, 3 Branches',
      text: 'Managing three schools from one dashboard is a game-changer. The analytics give me insights I never had before. ROI was visible within the first quarter.',
      rating: 5,
      avatar: 'S',
      avatarColor: '#8b5cf6',
      verified: true,
    },
  ], []);

  const PLANS = useMemo(() => [
    {
      name: 'Starter',
      price: '₹4,999',
      period: '/month',
      desc: 'Perfect for small schools',
      features: ['Up to 500 students', 'Attendance tracking', 'Basic fee management', 'Email support'],
      color: '#64748b',
      highlight: false,
    },
    {
      name: 'Professional',
      price: '₹9,999',
      period: '/month',
      desc: 'Most popular for growing schools',
      features: ['Up to 2000 students', 'All Starter features', 'Analytics dashboard', 'SMS notifications', 'Priority support', 'Custom branding'],
      color: '#3b82f6',
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      desc: 'For large school chains',
      features: ['Unlimited students', 'Multi-branch management', 'API access', 'Dedicated manager', 'SLA guarantee', 'On-site training'],
      color: '#8b5cf6',
      highlight: false,
    },
  ], []);

  const TRUST_LOGOS = useMemo(() => [
    'CBSE Affiliated', 'ICSE Board', 'State Board', 'ISO 9001:2015', 'NASSCOM Member',
  ], []);

  const FAQ_ITEMS = useMemo(() => [
    {
      question: 'How quickly can we get started?',
      answer: 'Setup takes less than 24 hours. We provide free data migration and a dedicated onboarding specialist to ensure a smooth transition.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use 256‑bit SSL encryption, regular backups, and comply with GDPR and Indian data protection laws.',
    },
    {
      question: 'Can parents access the system?',
      answer: 'Yes, parents get their own portal and mobile app to view attendance, grades, fees, and receive instant notifications.',
    },
    {
      question: 'Do you offer training for staff?',
      answer: 'We provide free live training sessions, video tutorials, and 24/7 support to help your staff become proficient quickly.',
    },
  ], []);

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', to: '/contact', isRoute: true },
  ];

  const drawer = (
    <Box sx={{ textAlign: 'center', py: 2, bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
          {APP_NAME}
        </Typography>
        <IconButton onClick={handleDrawerToggle} aria-label="close menu">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ my: 2 }} />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.isRoute ? item.to : item.href} disablePadding>
            <ListItemButton
              component={item.isRoute ? RouterLink : 'a'}
              href={item.isRoute ? undefined : item.href}
              to={item.isRoute ? item.to : undefined}
              onClick={() => setMobileOpen(false)}
              sx={{ textAlign: 'center' }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton
            component={RouterLink}
            to="/login"
            sx={{ textAlign: 'center', color: 'primary.main', fontWeight: 700 }}
          >
            Login
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden', bgcolor: pageBg }}>
      {/* ─── Navigation Bar ───────────────────────────────────────────── */}
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{
          bgcolor: navBg,
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${dividerColor}`,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                component="img"
                src={LOGO_URL}
                alt={`${APP_NAME} logo`}
                sx={{ width: 34, height: 34, borderRadius: 1.5, objectFit: 'cover' }}
              />
              <Typography variant="h5" sx={{ fontWeight: 800, color: headingColor, letterSpacing: '-0.02em' }}>
                {APP_NAME}
              </Typography>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
              {navItems.map((item) =>
                item.isRoute ? (
                  <Link
                    key={item.to}
                    component={RouterLink}
                    to={item.to}
                    underline="none"
                    sx={{ fontWeight: 600, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    underline="none"
                    sx={{ fontWeight: 600, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                  >
                    {item.label}
                  </Link>
                )
              )}
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                size="small"
                color="primary"
                sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}
              >
                Login
              </Button>
            </Box>
            {/* Mobile actions: Login (left) + Menu (right) */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                size="small"
                startIcon={<LoginIcon />}
                sx={{
                  borderRadius: 999,
                  fontWeight: 800,
                  textTransform: 'none',
                  px: 1.6,
                  boxShadow: 'none',
                  minHeight: 36,
                  '&:hover': { boxShadow: 'none' },
                }}
              >
                Login
              </Button>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{
                  borderRadius: 2,
                  border: `1px solid ${dividerColor}`,
                  bgcolor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.35 : 0.6),
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 } }}
      >
        {drawer}
      </Drawer>

      {/* ── 1. Hero / Carousel ── */}
      <Box sx={{ position: 'relative', mb: { xs: 4, md: 6 } }}>
        <Carousel />
        <Box sx={{
          position: 'absolute', bottom: { xs: -18, md: -22 }, left: '50%', transform: 'translateX(-50%)',
          bgcolor: paperBg, borderRadius: 100, px: 3, py: 1.2,
          boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, theme.palette.mode === 'dark' ? 0.45 : 0.12)}`,
          display: 'flex', alignItems: 'center', gap: 1.5,
          border: `1px solid ${dividerColor}`, zIndex: 10, whiteSpace: 'nowrap',
        }}>
          <Box sx={{ display: 'flex' }}>
            {['#ef4444','#f59e0b','#10b981'].map((c, i) => (
              <Avatar key={i} sx={{ width: 28, height: 28, bgcolor: c, fontSize: 11, ml: i > 0 ? -0.8 : 0, border: `2px solid ${paperBg}`, fontWeight: 700 }}>
                {['R','P','S'][i]}
              </Avatar>
            ))}
          </Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: headingColor, fontSize: '0.78rem' }}>
            Trusted by 500+ schools across India
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.2 }}>
            {[...Array(5)].map((_, i) => <StarIcon key={i} sx={{ fontSize: 13, color: '#f59e0b' }} />)}
          </Box>
        </Box>
      </Box>

      {/* ── 2. Stats ── */}
      <Container maxWidth="lg" sx={{ pt: { xs: 5, md: 7 }, pb: { xs: 6, md: 10 } }}>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Grid2 container spacing={3}>
            {STATS.map((stat, i) => (
              <Grid2 size={{ xs: 6, md: 3 }} key={i}>
                <motion.div variants={itemUp}>
                  <Box sx={{
                    p: { xs: 2.5, md: 3.5 }, borderRadius: 3, bgcolor: paperBg,
                    border: `1px solid ${dividerColor}`,
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateY(-6px)', boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, theme.palette.mode === 'dark' ? 0.35 : 0.08)}`, borderColor: stat.color },
                  }}>
                    <Box sx={{ width: 52, height: 52, borderRadius: 2, bgcolor: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, mb: 2 }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: headingColor, fontSize: { xs: '1.6rem', md: '2rem' }, lineHeight: 1 }}>
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.5, mb: 1 }}>{stat.label}</Typography>
                    <Typography variant="caption" sx={{ color: stat.color, fontWeight: 700, fontSize: '0.72rem', bgcolor: stat.bg, px: 1, py: 0.4, borderRadius: 1 }}>
                      {stat.growth}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid2>
            ))}
          </Grid2>
        </motion.div>
      </Container>

      {/* ── 3. Trust Bar ── */}
      <Box
        sx={{
          py: 2.5,
          overflow: 'hidden',
          background:
            theme.palette.mode === 'dark'
              ? `linear-gradient(90deg, ${alpha(theme.palette.primary.dark, 0.45)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 50%, ${alpha(theme.palette.secondary.dark, 0.35)} 100%)`
              : 'linear-gradient(90deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
          borderBlock: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
        }}
      >
        <Box sx={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          {TRUST_LOGOS.map((logo, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VerifiedIcon sx={{ fontSize: 16, color: theme.palette.mode === 'dark' ? 'primary.light' : '#93c5fd' }} />
              <Typography variant="caption" sx={{ color: theme.palette.mode === 'dark' ? 'text.secondary' : alpha('#e2e8f0', 0.92), fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                {logo}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── 4. Features ── */}
      <Box id="features" sx={{ scrollMarginTop: 92, py: { xs: 8, md: 12 }, bgcolor: paperBg }}>
        <Container maxWidth="lg">
          <SectionHeading
            badge="Platform Features"
            title="Everything your school needs"
            subtitle="A complete digital ecosystem designed to streamline school administration and enhance parent-teacher collaboration."
          />
          <Box sx={{ height: { xs: 40, md: 56 } }} />
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <Grid2 container spacing={3}>
              {FEATURES.map((f, i) => (
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                  <motion.div variants={itemUp} style={{ height: '100%' }}>
                    <Box sx={{
                      p: 3.5, borderRadius: 3, border: `1px solid ${dividerColor}`, bgcolor: paperBg,
                      height: '100%', display: 'flex', flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 12px 40px ${f.color}22`,
                        borderColor: f.color,
                      },
                    }}>
                      <Box sx={{ width: 52, height: 52, borderRadius: 2, bgcolor: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, mb: 2.5 }}>
                        {f.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: headingColor, mb: 1, fontSize: '1.05rem' }}>{f.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 2.5, flex: 1 }}>{f.desc}</Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {f.highlights.map((h, j) => (
                          <Box key={j} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CheckCircleIcon sx={{ fontSize: 14, color: f.color }} />
                            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.72rem' }}>{h}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </motion.div>
                </Grid2>
              ))}
            </Grid2>
          </motion.div>
        </Container>
      </Box>

      {/* ── 5. Platform Highlight Banner ── */}
      <Box sx={{
        py: { xs: 6, md: 8 },
        bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.12 : 0.08),
        borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.22)}`,
        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.22)}`,
      }}>
        <Container maxWidth="lg">
          <Grid2 container spacing={4} alignItems="center">
            <Grid2 size={{ xs: 12, md: 6 }}>
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <Chip label="Cross-Platform" size="small" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.18), color: 'primary.main', fontWeight: 700, mb: 2, fontSize: '0.7rem' }} />
                <Typography variant="h4" sx={{ fontWeight: 800, color: headingColor, mb: 2, lineHeight: 1.25 }}>
                  Works on every device, anytime, anywhere
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, mb: 3 }}>
                  Access your school dashboard from any browser, Android or iOS app. Our platform is optimized for mobile-first experience with offline sync capabilities.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {['Android App', 'iOS App', 'Web Dashboard', 'Admin Panel'].map((item) => (
                    <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <CheckCircleIcon sx={{ fontSize: 16, color: '#3b82f6' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: headingColor }}>{item}</Typography>
                    </Box>
                  ))}
                </Box>
              </motion.div>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <Box sx={{
                  bgcolor: paperBg, borderRadius: 4, p: 4,
                  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.2 : 0.12)}`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.28)}`,
                  display: 'flex', flexDirection: 'column', gap: 2
                }}>
                  {[
                    { label: 'Average Setup Time', value: '< 24 hours', icon: <SpeedIcon sx={{ fontSize: 20, color: '#3b82f6' }} /> },
                    { label: 'Uptime Guarantee', value: '99.9% SLA', icon: <SecurityIcon sx={{ fontSize: 20, color: '#10b981' }} /> },
                    { label: 'Data Migration', value: 'Free & Assisted', icon: <DevicesIcon sx={{ fontSize: 20, color: '#f59e0b' }} /> },
                    { label: 'Dedicated Support', value: '24 × 7 × 365', icon: <SupportAgentIcon sx={{ fontSize: 20, color: '#8b5cf6' }} /> },
                  ].map((item, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, bgcolor: theme.palette.mode === 'dark' ? alpha('#ffffff', 0.06) : '#f1f5f9', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {item.icon}
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>{item.label}</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: headingColor }}>{item.value}</Typography>
                    </Box>
                  ))}
                </Box>
              </motion.div>
            </Grid2>
          </Grid2>
        </Container>
      </Box>

      {/* ── 6. How It Works ── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: paperBg }}>
        <Container maxWidth="lg">
          <SectionHeading
            badge="Simple Process"
            title="How to get started in 3 easy steps"
            subtitle="From signup to full deployment — we handle everything for you."
          />
          <Box sx={{ height: { xs: 40, md: 56 } }} />
          <Grid2 container spacing={4} justifyContent="center">
            {[
              { step: '01', title: 'Book a Demo', desc: 'Schedule a 30‑minute call with our education specialist to understand your needs.' },
              { step: '02', title: 'Personalized Setup', desc: 'We migrate your data, configure the system, and train your staff — all for free.' },
              { step: '03', title: 'Go Live & Succeed', desc: 'Launch within 24 hours and enjoy ongoing 24/7 support and regular updates.' },
            ].map((item, idx) => (
              <Grid2 size={{ xs: 12, md: 4 }} key={idx}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Box sx={{ textAlign: 'center', p: 3 }}>
                    <Typography variant="h1" sx={{ fontWeight: 800, color: alpha(theme.palette.primary.main, 0.22), fontSize: '5rem', lineHeight: 1 }}>
                      {item.step}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, mt: -2, mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.desc}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid2>
            ))}
          </Grid2>
        </Container>
      </Box>

      {/* ── 7. Top 10 Registered Schools ── */}
      <Box id="gallery" sx={{ scrollMarginTop: 92, py: { xs: 8, md: 12 }, bgcolor: pageBg }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 6, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Chip label="Our Network" size="small" sx={{ bgcolor: alpha(theme.palette.success.main, 0.16), color: 'success.main', fontWeight: 700, mb: 1.5, fontSize: '0.7rem' }} />
              <Typography variant="h4" sx={{ fontWeight: 800, color: headingColor, lineHeight: 1.2 }}>Registered Schools</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Growing network of digitally empowered institutions</Typography>
            </Box>
            <Button
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/schools')}
              sx={{
                borderRadius: 2,
                borderColor: dividerColor,
                color: headingColor,
                fontWeight: 700,
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.12 : 0.08),
                },
              }}
            >
              View All Schools
            </Button>
          </Box>

          {/* Schools Grid */}
          {topSchoolsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: 'primary.main' }} />
            </Box>
          ) : topSchools && topSchools.length > 0 ? (
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <Grid2 container spacing={3}>
                {topSchools.slice(0, 10).map((school, i) => (
                  <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} key={school._id}>
                    <motion.div variants={itemUp}>
                      <Card
                        sx={{
                          height: '100%',
                          borderRadius: 3,
                          border: `1px solid ${dividerColor}`,
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                            borderColor: 'primary.main',
                          },
                        }}
                        onClick={() => navigate(`/school/${school._id}`)}
                      >
                        <CardContent sx={{ p: 2, textAlign: 'center' }}>
                          <Avatar
                            src={getSchoolImageSrc(school.school_image)}
                            alt={school.school_name}
                            sx={{
                              width: 80,
                              height: 80,
                              mx: 'auto',
                              mb: 1.5,
                              border: `3px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 700,
                              color: headingColor,
                              mb: 0.5,
                              fontSize: '0.875rem',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              minHeight: '2.5em',
                            }}
                          >
                            {school.school_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                            {school.owner_name}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid2>
                ))}
              </Grid2>
            </motion.div>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <SchoolIcon sx={{ fontSize: 80, color: '#e0e0e0', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No schools registered yet
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      {/* ── 8. Testimonials ── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: paperBg }}>
        <Container maxWidth="lg">
          <SectionHeading
            badge="Testimonials"
            title="Loved by schools across India"
            subtitle="Real stories from principals, admins, and parents who transformed their school experience."
          />
          <Box sx={{ height: { xs: 40, md: 56 } }} />
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <Grid2 container spacing={3}>
              {TESTIMONIALS.map((t, i) => (
                <Grid2 size={{ xs: 12, md: 4 }} key={i}>
                  <motion.div variants={itemUp} style={{ height: '100%' }}>
                    <Card sx={{
                      borderRadius: 3, border: `1px solid ${dividerColor}`,
                      boxShadow: 'none', height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 16px 40px rgba(0,0,0,0.08)' },
                    }}>
                      <CardContent sx={{ p: 3.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', gap: 0.3, mb: 2.5 }}>
                          {[...Array(t.rating)].map((_, j) => <StarIcon key={j} sx={{ fontSize: 16, color: '#f59e0b' }} />)}
                        </Box>
                        <FormatQuoteIcon sx={{ fontSize: 32, color: dividerColor, mb: 1 }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75, mb: 3, flex: 1, fontStyle: 'italic' }}>
                          {t.text}
                        </Typography>
                        <Divider sx={{ mb: 2.5 }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ bgcolor: t.avatarColor, width: 44, height: 44, fontWeight: 700 }}>{t.avatar}</Avatar>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: headingColor }}>{t.name}</Typography>
                              {t.verified && <VerifiedIcon sx={{ fontSize: 15, color: '#3b82f6' }} />}
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>{t.role}</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid2>
              ))}
            </Grid2>
          </motion.div>
        </Container>
      </Box>

      {/* ── 9. Pricing ── */}
      <Box id="pricing" sx={{ scrollMarginTop: 92, py: { xs: 8, md: 12 }, bgcolor: pageBg }}>
        <Container maxWidth="lg">
          <SectionHeading
            badge="Pricing"
            title="Simple, transparent pricing"
            subtitle="No hidden fees. No long-term contracts. Cancel anytime."
          />
          <Box sx={{ height: { xs: 40, md: 56 } }} />
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <Grid2 container spacing={3} alignItems="stretch">
              {PLANS.map((plan, i) => (
                <Grid2 size={{ xs: 12, md: 4 }} key={i}>
                  <motion.div variants={itemUp} style={{ height: '100%' }}>
                    <Box sx={{
                      p: 4, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column',
                      bgcolor: plan.highlight ? plan.color : paperBg,
                      border: `2px solid ${plan.highlight ? plan.color : dividerColor}`,
                      position: 'relative', overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 16px 48px ${plan.color}33` },
                    }}>
                      {plan.highlight && (
                        <Chip label="Most Popular" size="small" sx={{ position: 'absolute', top: 20, right: 20, bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700, fontSize: '0.7rem' }} />
                      )}
                      <Typography variant="overline" sx={{ fontWeight: 800, color: plan.highlight ? 'rgba(255,255,255,0.75)' : plan.color, letterSpacing: '0.1em', fontSize: '0.72rem' }}>
                        {plan.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, my: 1.5 }}>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: plan.highlight ? '#fff' : headingColor, lineHeight: 1 }}>{plan.price}</Typography>
                        <Typography variant="body2" sx={{ color: plan.highlight ? 'rgba(255,255,255,0.75)' : '#94a3b8', fontWeight: 600 }}>{plan.period}</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: plan.highlight ? 'rgba(255,255,255,0.8)' : '#64748b', mb: 3, fontWeight: 500 }}>{plan.desc}</Typography>
                      <Divider sx={{ mb: 3, borderColor: plan.highlight ? 'rgba(255,255,255,0.2)' : dividerColor }} />
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
                        {plan.features.map((feat, j) => (
                          <Box key={j} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <CheckCircleIcon sx={{ fontSize: 18, color: plan.highlight ? 'rgba(255,255,255,0.9)' : plan.color, flexShrink: 0 }} />
                            <Typography variant="body2" sx={{ color: plan.highlight ? 'rgba(255,255,255,0.9)' : '#475569', fontWeight: 500 }}>{feat}</Typography>
                          </Box>
                        ))}
                      </Box>
                      <Button
                        fullWidth variant={plan.highlight ? 'contained' : 'outlined'}
                        sx={{
                          borderRadius: 2, py: 1.4, fontWeight: 700,
                          bgcolor: plan.highlight ? '#fff' : 'transparent',
                          color: plan.highlight ? plan.color : plan.color,
                          borderColor: plan.highlight ? 'transparent' : plan.color,
                          '&:hover': { bgcolor: plan.highlight ? 'rgba(255,255,255,0.9)' : `${plan.color}11`, borderColor: plan.color },
                        }}
                      >
                        {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started Free'}
                      </Button>
                    </Box>
                  </motion.div>
                </Grid2>
              ))}
            </Grid2>
          </motion.div>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              All plans include a <strong>14-day free trial</strong>. No credit card required.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ── 10. FAQ Section ── */}
      <Box id="faq" sx={{ scrollMarginTop: 92, py: { xs: 8, md: 12 }, bgcolor: paperBg }}>
        <Container maxWidth="md">
          <SectionHeading
            badge="FAQ"
            title="Frequently asked questions"
            subtitle="Can't find what you're looking for? Contact our support team."
          />
          <Box sx={{ height: 40 }} />
          {FAQ_ITEMS.map((faq, index) => (
            <Accordion
              key={index}
              elevation={0}
              sx={{
                border: `1px solid ${dividerColor}`,
                borderRadius: '12px !important',
                mb: 2,
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight={700}>{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>

      {/* ── 11. CTA Section ── */}
      <Box sx={{
        py: { xs: 10, md: 14 },
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
        color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <Box sx={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', bgcolor: 'rgba(59,130,246,0.08)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', bgcolor: 'rgba(139,92,246,0.08)', pointerEvents: 'none' }} />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Chip label="Get Started Today" size="small" sx={{ bgcolor: 'rgba(59,130,246,0.2)', color: '#93c5fd', fontWeight: 700, mb: 3, border: '1px solid rgba(59,130,246,0.3)', fontSize: '0.7rem' }} />
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2.5, fontSize: { xs: '2rem', md: '2.8rem' }, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              Ready to digitize your school?
            </Typography>
            <Typography variant="h6" sx={{ mb: 5, opacity: 0.75, fontWeight: 400, lineHeight: 1.6, maxWidth: 520, mx: 'auto' }}>
              Join 500+ smart schools. Full setup in under 24 hours with free data migration and onboarding support.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 5 }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  px: 5, py: 1.6, borderRadius: 2.5, fontSize: '1rem', fontWeight: 700,
                  bgcolor: '#3b82f6', boxShadow: '0 8px 24px rgba(59,130,246,0.4)',
                  '&:hover': { bgcolor: '#2563eb', boxShadow: '0 12px 32px rgba(59,130,246,0.5)', transform: 'translateY(-2px)' },
                  transition: 'all 0.25s ease',
                }}
              >
                Request a Free Demo
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  px: 5, py: 1.6, borderRadius: 2.5, fontSize: '1rem', fontWeight: 700,
                  color: 'white', borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.08)', transform: 'translateY(-2px)' },
                  transition: 'all 0.25s ease',
                }}
              >
                Contact Sales
              </Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
              {['No credit card required', 'Free data migration', '14-day free trial'].map((item) => (
                <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <CheckCircleIcon sx={{ fontSize: 16, color: '#4ade80' }} />
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.8rem' }}>{item}</Typography>
                </Box>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* ─── Footer ───────────────────────────────────────────────────── */}
      <Box
        sx={{
          py: 6,
          color: 'text.secondary',
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.98)} 0%, ${alpha(theme.palette.primary.dark, 0.35)} 100%)`
            : 'linear-gradient(180deg, #0f172a 0%, #111827 100%)',
        }}
      >
        <Container maxWidth="lg">
          <Grid2 container spacing={4}>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box
                  component="img"
                  src={LOGO_URL}
                  alt={`${APP_NAME} logo`}
                  sx={{ width: 34, height: 34, borderRadius: 1.5, objectFit: 'cover' }}
                />
                <Typography variant="h5" sx={{ fontWeight: 800, color: theme.palette.mode === 'dark' ? 'text.primary' : '#ffffff' }}>
                  {APP_NAME}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 2, maxWidth: 300, color: theme.palette.mode === 'dark' ? 'text.secondary' : alpha('#e2e8f0', 0.9) }}>
                Empowering schools with cutting‑edge digital solutions. Trusted by 500+ institutions across India.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {[FacebookIcon, TwitterIcon, LinkedInIcon, YouTubeIcon].map((Icon, i) => (
                  <IconButton
                    key={i}
                    aria-label="social link"
                    sx={{
                      color: theme.palette.mode === 'dark' ? 'text.secondary' : alpha('#e2e8f0', 0.85),
                      '&:hover': { color: theme.palette.mode === 'dark' ? 'primary.light' : '#ffffff' },
                    }}
                  >
                    <Icon fontSize="small" />
                  </IconButton>
                ))}
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 6, md: 2 }}>
              <Typography variant="subtitle2" sx={{ color: theme.palette.mode === 'dark' ? 'text.primary' : '#ffffff', fontWeight: 700, mb: 2 }}>Product</Typography>
              {[
                { label: 'Features', href: '#features' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'Contact', to: '/contact', route: true },
              ].map((item) => (
                <Link
                  key={item.label}
                  component={item.route ? RouterLink : 'a'}
                  href={item.route ? undefined : item.href}
                  to={item.route ? item.to : undefined}
                  underline="none"
                  sx={{
                    display: 'block',
                    color: theme.palette.mode === 'dark' ? 'text.secondary' : alpha('#e2e8f0', 0.85),
                    fontSize: '0.9rem',
                    mb: 1,
                    '&:hover': { color: theme.palette.mode === 'dark' ? 'primary.light' : '#ffffff' },
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </Grid2>
            <Grid2 size={{ xs: 6, md: 2 }}>
              <Typography variant="subtitle2" sx={{ color: theme.palette.mode === 'dark' ? 'text.primary' : '#ffffff', fontWeight: 700, mb: 2 }}>Company</Typography>
              {['About', 'Blog', 'Careers', 'Press'].map((text) => (
                <Link key={text} href="#" underline="none" sx={{ display: 'block', color: theme.palette.mode === 'dark' ? 'text.secondary' : alpha('#e2e8f0', 0.85), fontSize: '0.9rem', mb: 1, '&:hover': { color: theme.palette.mode === 'dark' ? 'primary.light' : '#ffffff' } }}>
                  {text}
                </Link>
              ))}
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle2" sx={{ color: theme.palette.mode === 'dark' ? 'text.primary' : '#ffffff', fontWeight: 700, mb: 2 }}>Subscribe to our newsletter</Typography>
              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setNewsletterOpen(true);
                }}
                sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}
              >
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Your email"
                  style={{
                    flex: 1,
                    minWidth: 200,
                    padding: '12px 16px',
                    borderRadius: 10,
                    border: `1px solid ${theme.palette.mode === 'dark' ? alpha('#fff', 0.2) : '#334155'}`,
                    backgroundColor: theme.palette.mode === 'dark' ? alpha('#000', 0.25) : '#1e293b',
                    color: theme.palette.mode === 'dark' ? theme.palette.text.primary : '#ffffff',
                    fontSize: '0.9rem',
                  }}
                />
                <Button type="submit" variant="contained" color="primary">
                  Subscribe
                </Button>
              </Box>
            </Grid2>
          </Grid2>
          <Divider sx={{ borderColor: theme.palette.mode === 'dark' ? 'divider' : '#1e293b', my: 4 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="caption" sx={{ color: theme.palette.mode === 'dark' ? 'text.secondary' : alpha('#e2e8f0', 0.75) }}>
              © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Link href="#" underline="hover" sx={{ color: theme.palette.mode === 'dark' ? 'text.secondary' : alpha('#e2e8f0', 0.75), fontSize: '0.8rem' }}>Privacy Policy</Link>
              <Link href="#" underline="hover" sx={{ color: theme.palette.mode === 'dark' ? 'text.secondary' : alpha('#e2e8f0', 0.75), fontSize: '0.8rem' }}>Terms of Service</Link>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ─── Scroll to top & chat ─────────────────────────────────────── */}
      <Zoom in={showFab}>
        <Fab
          size="medium"
          aria-label="Back to top"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 96,
            right: 24,
            zIndex: 1200,
            boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.2)}`,
            bgcolor: paperBg,
            color: 'primary.main',
            border: `1px solid ${dividerColor}`,
            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.12) },
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>
      <Zoom in={showFab}>
        <Fab
          color="primary"
          aria-label="Open chat"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1200,
            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.45)}`,
          }}
        >
          <ChatIcon />
        </Fab>
      </Zoom>

      <Snackbar
        open={newsletterOpen}
        autoHideDuration={5000}
        onClose={() => setNewsletterOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setNewsletterOpen(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
          Thanks — you are on the list. We will send updates to your inbox.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;