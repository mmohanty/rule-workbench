import { Home as HomeIcon, Settings as SettingsIcon, Info as InfoIcon } from "@mui/icons-material";

export const menuItems = [
  { label: "Home", path: "/", icon: <HomeIcon /> },
  {
    label: "Settings",
    icon: <SettingsIcon />,
    subMenu: [
      { label: "Profile", path: "/profile" },
      { label: "Rules", path: "/rules" },
      { label: "T1-JsonEditor", path: "/jsonEditor/T1" },
      { label: "T2-JsonEditor", path: "/jsonEditor/T2" },
      { label: "Rule Mapping", path: "/ruleMapping" },
    ],
  },
  {
    label: "About",
    icon: <InfoIcon />,
    subMenu: [
      { label: "Company Info", path: "/company-info" },
      { label: "Team", path: "/team" },
    ],
  },
];
