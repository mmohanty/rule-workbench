import React, { useContext, useEffect } from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { Menu as MenuIcon, PowerSettingsNew as PowerOffIcon } from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext"; 

const Header = ({ toggleDrawer, companyName = "Company Label" }) => {
  const { user, logout } = useContext(AuthContext);

  // Debugging: Log user data
  useEffect(() => {
    console.log("🔍 User in Header:", user);
  }, [user]);

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton 
          edge="start" 
          color="inherit" 
          onClick={toggleDrawer} 
          sx={{ mr: 2 }} 
          aria-label="Toggle sidebar"
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {companyName}
        </Typography>

        {user ? (
          <Typography variant="body1" sx={{ mx: 2 }}>
            Welcome, {user}
          </Typography>
        ) : (
          <Typography variant="body1" sx={{ mx: 2, fontStyle: "italic" }}>
            {"Test"}
          </Typography>
        )}

        <IconButton color="inherit" onClick={logout} aria-label="Logout">
          <PowerOffIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
