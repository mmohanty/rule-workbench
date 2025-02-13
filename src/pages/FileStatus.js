import React, { useState, useEffect } from "react";
import { Box, Button, CircularProgress, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, IconButton, Input } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { ExpandMore, Refresh } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

const filesList = [
  "Certificate",
  "Driving License",
  "Municipality Card"
];

const fetchFileStatus = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        Certificate: { status: "exists", createdAt: "2024-02-06", lastUpdated: "2024-02-07", size: "2MB", contentType: "application/pdf" },
        "Driving License": { status: "not_found", createdAt: "2024-01-20", lastUpdated: "2024-01-22", size: "500KB", contentType: "image/png" },
        "Municipality Card": { status: "error", createdAt: "2023-12-15", lastUpdated: "2024-01-10", size: "1MB", contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
      });
    }, 1000);
  });
};

const getStatusIcon = (status) => {
  switch (status) {
    case "exists":
      return <CheckCircleIcon style={{ color: "green" }} />;
    case "error":
      return <WarningAmberIcon style={{ color: "orange" }} />;
    case "not_found":
      return <ErrorOutlineIcon style={{ color: "red" }} />;
    default:
      return <CircularProgress size={20} />;
  }
};

const FileStatus = () => {
  const [fileStatus, setFileStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const [gridLoading, setGridLoading] = useState({});

  const handleFileUpload = (event, fileName) => {
    const file = event.target.files[0];
    if (file) {
      console.log(`Uploading ${file.name} for ${fileName}`);
      // Add actual upload logic here
    }
  };

  const refreshFileStatus = async () => {
    setLoading(true);
    const status = await fetchFileStatus();
    setFileStatus(status);
    setFiles(Object.keys(status).map((key) => ({ id: key, name: key, ...status[key] })));
    setLoading(false);
  };

  useEffect(() => {
    refreshFileStatus();
  }, []);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : expandedAccordion);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h5" gutterBottom display="flex" justifyContent="space-between" alignItems="center">
        File Status Tracker
        <IconButton onClick={refreshFileStatus} color="primary">
          <Refresh />
        </IconButton>
      </Typography>
      {filesList.map((file) => (
        <Box key={file} sx={{ mb: 2, p: 2, border: "1px solid #ddd", borderRadius: "8px" }}>
          <Grid container alignItems="center">
            <Grid item xs={4}>
              <Typography sx={{ textAlign: "left" }}>{file}</Typography>
            </Grid>
            <Grid item xs={4} sx={{ textAlign: "center" }}>
              {loading ? <CircularProgress size={20} /> : getStatusIcon(fileStatus[file]?.status)}
            </Grid>
            <Grid item xs={2} sx={{ textAlign: "center" }}>
              <input
                accept="*"
                style={{ display: "none" }}
                id={`upload-button-${file}`}
                type="file"
                onChange={(event) => handleFileUpload(event, file)}
              />
              <label htmlFor={`upload-button-${file}`}>
                <Button component="span" variant="contained" color="primary" startIcon={<CloudUploadIcon />} size="small">
                  Upload
                </Button>
              </label>
            </Grid>
            <Grid item xs={2} sx={{ textAlign: "center" }}>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<CloudDownloadIcon />}
                size="small"
                disabled={fileStatus[file]?.status !== "exists"}
              >
                Download
              </Button>
            </Grid>
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default FileStatus;
