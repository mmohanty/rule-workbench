import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import { Menu as MenuIcon, PowerSettingsNew as PowerOffIcon } from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext

const Header = ({ toggleDrawer }) => {
  const { logout } = useContext(AuthContext); // ✅ Get logout function

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {/* Sidebar Toggle Button */}
        <IconButton edge="start" color="inherit" onClick={toggleDrawer} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>

        {/* Company Label */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Company Label
        </Typography>

        {/* Logout Icon (Power Off) */}
        <IconButton color="inherit" onClick={logout}>
          <PowerOffIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
