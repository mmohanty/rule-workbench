import React, { useState, useEffect } from "react";
import { Box, IconButton, Tabs, Tab, CircularProgress, Typography, Grid } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Refresh } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

const tabs = ["T3", "T4", "T5", "T6", "T7", "T8"];

const fetchFileStatus = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        Certificate: { status: "exists", createdAt: "2024-02-06", lastUpdated: "2024-02-07", size: "2MB", contentType: "application/pdf" }
      });
    }, 1000);
  });
};

const fetchTabFiles = async (tab) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: `${tab}-1`, name: `${tab} File 1`, status: "exists", size: "1MB", contentType: "application/pdf", lastUpdated: "2024-02-10" },
        { id: `${tab}-2`, name: `${tab} File 2`, status: "not_found", size: "500KB", contentType: "image/png", lastUpdated: "2024-02-12" }
      ]);
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
  const [selectedTab, setSelectedTab] = useState("T3");
  const [tabFiles, setTabFiles] = useState([]);
  const [tabLoading, setTabLoading] = useState(false);

  const refreshFileStatus = async () => {
    setLoading(true);
    const status = await fetchFileStatus();
    setFileStatus(status);
    setLoading(false);
  };

  const refreshTabFiles = async (tab) => {
    setTabLoading(true);
    const files = await fetchTabFiles(tab);
    setTabFiles(files);
    setTabLoading(false);
  };

  useEffect(() => {
    refreshFileStatus();
  }, []);

  useEffect(() => {
    refreshTabFiles(selectedTab);
  }, [selectedTab]);

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
      <Typography variant="h5" gutterBottom display="flex" justifyContent="space-between" alignItems="center">
        File Status Tracker
        <IconButton onClick={refreshFileStatus} color="primary">
          <Refresh />
        </IconButton>
      </Typography>
      <Box sx={{ mb: 2, p: 2, border: "1px solid #ddd", borderRadius: "8px" }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={4}>
            <Typography sx={{ textAlign: "left" }}>Certificate</Typography>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: "center" }}>
            {loading ? <CircularProgress size={20} /> : getStatusIcon(fileStatus.Certificate?.status)}
          </Grid>
          <Grid item xs={2} sx={{ textAlign: "center" }}>
            <IconButton color="primary">
              <CloudUploadIcon />
            </IconButton>
          </Grid>
          <Grid item xs={2} sx={{ textAlign: "center" }}>
            <IconButton color="secondary" disabled={fileStatus.Certificate?.status !== "exists"}>
              <CloudDownloadIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Typography variant="caption" sx={{ color: "gray", display: "block", mt: 1 }}>
          <strong>Created:</strong> {fileStatus.Certificate?.createdAt} | <strong>Last Updated:</strong> {fileStatus.Certificate?.lastUpdated} | <strong>Size:</strong> {fileStatus.Certificate?.size} | <strong>Type:</strong> {fileStatus.Certificate?.contentType}
        </Typography>
      </Box>
      <Tabs
        value={selectedTab}
        onChange={(event, newValue) => setSelectedTab(newValue)}
        sx={{ borderBottom: 1, borderColor: "divider", mb: 2, 
              '& .MuiTab-root': { borderRadius: '5px', px: 3, py: 1, fontWeight: 'bold', fontSize: '1rem',
              '&.Mui-selected': { backgroundColor: '#EDE7F6', color: '#4A148C', borderRadius: '8px' } } }}
      >
        {tabs.map((tab) => (
          <Tab key={tab} label={tab} value={tab} />
        ))}
        <IconButton onClick={() => refreshTabFiles(selectedTab)} color="primary">
          {tabLoading ? <CircularProgress size={20} /> : <Refresh />}
        </IconButton>
      </Tabs>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          {selectedTab} Files
        </Typography>
        <DataGrid rows={tabFiles} columns={[
          { field: "name", headerName: "File Name", flex: 2 },
          { field: "size", headerName: "Size", flex: 1 },
          { field: "contentType", headerName: "Type", flex: 1 },
          { field: "lastUpdated", headerName: "Last Updated", flex: 1 },
          { field: "status", headerName: "Status", flex: 1, renderCell: (params) => getStatusIcon(params.value) },
          {
            field: "upload",
            headerName: "Upload",
            flex: 1,
            renderCell: () => (
              <IconButton color="primary">
                <CloudUploadIcon />
              </IconButton>
            )
          },
          {
            field: "download",
            headerName: "Download",
            flex: 1,
            renderCell: (params) => (
              <IconButton color="secondary" disabled={params.row.status !== "exists"}>
                <CloudDownloadIcon />
              </IconButton>
            )
          }
        ]} pageSize={5} autoHeight />
      </Box>
    </Box>
  );
};

export default FileStatus;
