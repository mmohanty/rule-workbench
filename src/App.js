import React, { useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, Box, Toolbar } from "@mui/material";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import MainContent from "./components/MainContent";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import { AuthContext } from "./context/AuthContext";

const App = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [loading, setLoading] = useState(true); // ✅ Prevent flickering on refresh

  useEffect(() => {
    setLoading(false);
  }, []);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  if (loading) return null; // ✅ Prevent UI flicker before auth loads

  return (
    <Router>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        {isAuthenticated && <Header toggleDrawer={toggleDrawer} />} {/* ✅ Header now contains Logout */}
        {isAuthenticated && <Sidebar isDrawerOpen={isDrawerOpen} />}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route path="/*" element={<MainContent isDrawerOpen={isDrawerOpen} />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Box>
      </Box>
      {isAuthenticated && <Footer />}
    </Router>
  );
};

export default App;
