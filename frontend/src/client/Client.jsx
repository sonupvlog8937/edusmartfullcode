import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./utility components/app bar/Navbar";
import Footer from "./utility components/footer/Footer";
import { Box } from "@mui/material";
import { useTheme } from "@emotion/react";

export default function Client() {

const theme = useTheme();
const location = useLocation();
const isLanding = location.pathname === "/" || location.pathname === "/home";
  return (
    <>
      {!isLanding && <Navbar />}
      <Box
        component="main"
        sx={{
          minHeight: "calc(100vh - 70px)",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Outlet />
      </Box>
      {!isLanding && <Footer />}
    </>
  );
}
