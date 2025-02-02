import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Collapse, Box, Divider, Toolbar } from "@mui/material";
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { menuItems } from "../data/menuData"; // Import menu items from a separate file

const Sidebar = ({ isDrawerOpen }) => {
  const [openSubMenu, setOpenSubMenu] = useState({});

  const handleSubMenuToggle = (index) => {
    setOpenSubMenu((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <Drawer variant="persistent" open={isDrawerOpen} sx={{ width: isDrawerOpen ? 250 : 0, flexShrink: 0 }}>
      <Toolbar />
      <Box sx={{ width: 250 }}>
        <List>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem
                button
                component={item.path ? Link : "div"}
                to={item.path || "#"}
                onClick={() => item.subMenu && handleSubMenuToggle(index)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
                {item.subMenu && (openSubMenu[index] ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
              </ListItem>
              {item.subMenu && (
                <Collapse in={openSubMenu[index]} timeout="auto" unmountOnExit>
                  <List sx={{ pl: 4 }}>
                    {item.subMenu.map((subItem, subIndex) => (
                      <ListItem button key={subIndex} component={Link} to={subItem.path}>
                        <ListItemText primary={subItem.label} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
