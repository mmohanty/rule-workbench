import React from "react";
import { Routes, Route } from "react-router-dom";
import { Home, Profile, Preferences, CompanyInfo, Team, Rules, JsonEditor, RuleMapping } from "../pages";
import { Rule } from "@mui/icons-material";

const MainContent = ({ isDrawerOpen }) => {
  return (
    <main style={{ flexGrow: 1, padding: "20px", marginLeft: isDrawerOpen ? 250 : 0, transition: "margin 0.3s" }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/company-info" element={<CompanyInfo />} />
        <Route path="/team" element={<Team />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/jsonEditor/:param" element={<JsonEditor />} />
        <Route path="/ruleMapping/" element={<RuleMapping />} />
      </Routes>
    </main>
  );
};

export default MainContent;
