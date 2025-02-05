import React from "react";
import { Typography } from "@mui/material";

export const Home = () => <Typography variant="h4">🏠 Home Page</Typography>;
export const Profile = () => <Typography variant="h4">👤 Profile Page</Typography>;
export const Preferences = () => <Typography variant="h4">⚙️ Preferences Page</Typography>;
export const CompanyInfo = () => <Typography variant="h4">🏢 Company Info Page</Typography>;
export const Team = () => <Typography variant="h4">👥 Team Page</Typography>;
export { default as Rules } from "./Rules";
export { default as JsonEditor } from "./JsonEditor";
export {default as RuleMapping} from "./RuleMapping";
export {default as FileGridPage} from "./FileGridPage";
export {default as FileStatus} from "./FileStatus";