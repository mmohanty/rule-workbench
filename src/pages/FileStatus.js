import React, { useState, useEffect } from "react";
import { Box, Button, CircularProgress, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { ExpandMore, Refresh } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

const filesList = ["Certificate", "Driving License", "Municipality Card"];

const fetchFileStatus = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        Certificate: "exists",
        "Driving License": "not_found",
        "Municipality Card": "error",
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

const columns = [
  { field: "name", headerName: "File Name", flex: 1 },
  { field: "createdAt", headerName: "Date Created", flex: 1 },
  { field: "lastUpdated", headerName: "Last Updated", flex: 1 },
  { field: "size", headerName: "Size", flex: 1 },
  { field: "contentType", headerName: "Type", flex: 1 },
  {
    field: "download",
    headerName: "Action",
    flex: 1,
    renderCell: (params) => (
      <Button
        variant="outlined"
        color="secondary"
        startIcon={<CloudDownloadIcon />}
        size="small"
        disabled={params.row.status !== "exists"}
      >
        Download
      </Button>
    ),
  },
];

const FileStatus = () => {
  const [fileStatus, setFileStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [gridLoading, setGridLoading] = useState({});
  const [files, setFiles] = useState([]);

  const refreshFileStatus = async () => {
    setLoading(true);
    const status = await fetchFileStatus();
    setFileStatus(status);
    setLoading(false);
  };

  const refreshGridData = async (gridIndex) => {
    setGridLoading((prev) => ({ ...prev, [gridIndex]: true }));
    // Simulate a fetch call (replace with real API call if needed)
    setTimeout(() => {
      setFiles([...files]); // Simulating refresh by triggering re-render
      setGridLoading((prev) => ({ ...prev, [gridIndex]: false }));
    }, 1000);
  };

  useEffect(() => {
    refreshFileStatus();
  }, []);

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h5" gutterBottom display="flex" justifyContent="space-between" alignItems="center">
        File Status Tracker
        <IconButton onClick={refreshFileStatus} color="primary">
          <Refresh />
        </IconButton>
      </Typography>
      {filesList.map((file) => (
        <Grid
          container
          key={file}
          sx={{ alignItems: "center", mb: 2, p: 2, border: "1px solid #ddd", borderRadius: "8px" }}
        >
          <Grid item xs={4}>
            <Typography sx={{ textAlign: "left" }}>{file}</Typography>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: "center" }}>
            {loading ? <CircularProgress size={20} /> : getStatusIcon(fileStatus[file])}
          </Grid>
          <Grid item xs={2} sx={{ textAlign: "center" }}>
            <Button variant="contained" color="primary" startIcon={<CloudUploadIcon />} size="small">
              Upload
            </Button>
          </Grid>
          <Grid item xs={2} sx={{ textAlign: "center" }}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<CloudDownloadIcon />}
              size="small"
              disabled={fileStatus[file] !== "exists"}
            >
              Download
            </Button>
          </Grid>
        </Grid>
      ))}
      {["File Details Grid 1", "File Details Grid 2"].map((title, index) => (
        <Accordion key={index} sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6">{title}</Typography>
            <IconButton onClick={() => refreshGridData(index)} color="primary" sx={{ marginLeft: "auto" }}>
              {gridLoading[index] ? <CircularProgress size={20} /> : <Refresh />}
            </IconButton>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ height: 300 }}>
              <DataGrid rows={files} columns={columns} pageSize={5} checkboxSelection getRowId={(row) => row.id} />
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default FileStatus;
