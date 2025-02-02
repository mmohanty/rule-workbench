import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ position: "fixed", bottom: 0, width: "100%", bgcolor: "primary.main", color: "white", textAlign: "center", p: 1 }}>
      <Typography variant="body2">© 2024 Company Name. All Rights Reserved.</Typography>
    </Box>
  );
};

export default Footer;
