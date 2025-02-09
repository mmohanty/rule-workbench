import React, { useState, useEffect } from "react";
import { Box, Button, CircularProgress, Typography, Grid, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import axios from "axios";
import { ExpandMore } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DataGrid } from "@mui/x-data-grid";

const filesList = ["Certificate", "Driving License", "Municipality Card"];

const FileStatus = () => {
  const [fileStatus, setFileStatus] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkFilesStatus();
  }, []);

  const checkFilesStatus = async () => {
    setLoading(true);
    setTimeout(() => {
      const status = {
        Certificate: "exists",
        "Driving License": "not_found",
        "Municipality Card": "error",
      };
      setFileStatus(status);
      setLoading(false);
    }, 1000);
  };

  const uploadFile = async (fileName, content) => {
    try {
      const response = await axios.post("/api/upload", {
        fileName,
        content,
      });
      console.log("Upload response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const downloadFile = async (fileName) => {
    try {
      const response = await axios.get(`/api/download?fileName=${fileName}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  //   const handleUpload = (fileName, event) => {
  //     const file = event.target.files[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onload = async (e) => {
  //         try {
  //           await uploadFile(fileName, e.target.result);
  //           setFileStatus((prev) => ({ ...prev, [fileName]: "exists" }));
  //         } catch (error) {
  //           console.error("Upload failed for", fileName);
  //         }
  //       };
  //       reader.readAsText(file);
  //     }
  //   };

  //   const handleDownload = (fileName) => {
  //     downloadFile(fileName);
  //   };

  const handleUpload = (fileName, event) => {
    const file = event.target.files[0];
    if (file) {
      console.log(`Uploading ${fileName}:`, file);
      setFileStatus((prev) => ({ ...prev, [fileName]: "exists" }));
    }
  };

  const handleDownload = (fileName) => {
    console.log(`Downloading ${fileName}`);
    alert(`${fileName} downloaded!`);
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

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        File Status Tracker
      </Typography>
      <Grid
        container
        sx={{
          fontWeight: "bold",
          borderBottom: "2px solid #000",
          mb: 2,
          p: 1,
          alignItems: "center",
        }}
      >
        <Grid item xs={4} sx={{ textAlign: "left" }}>
          File Name
        </Grid>
        <Grid item xs={4} sx={{ textAlign: "center" }}>
          Status
        </Grid>
        {/* <Grid item xs={2} sx={{ textAlign: "center" }}>Upload</Grid>
        <Grid item xs={2} sx={{ textAlign: "center" }}>Download</Grid> */}
      </Grid>
      {filesList.map((file) => (
        <Grid
          container
          key={file}
          sx={{
            alignItems: "center",
            mb: 2,
            p: 2,
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <Grid item xs={4}>
            <Typography sx={{ textAlign: "left" }}>{file}</Typography>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: "center" }}>
            {loading ? (
              <CircularProgress size={20} />
            ) : (
              getStatusIcon(fileStatus[file])
            )}
          </Grid>
          <Grid item xs={2} sx={{ textAlign: "center" }}>
            <input
              type="file"
              style={{ display: "none" }}
              id={`upload-${file}`}
              onChange={(event) => handleUpload(file, event)}
            />
            <label htmlFor={`upload-${file}`}>
              <Button
                component="span"
                variant="contained"
                color="primary"
                startIcon={<CloudUploadIcon />}
                size="small"
              >
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
              onClick={() => handleDownload(file)}
              disabled={fileStatus[file] !== "exists"}
            >
              Download
            </Button>
          </Grid>
        </Grid>
      ))}

      <Accordion key="file-grid1" sx={{ mt: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Comparison</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ height: 300 }}>
            <DataGrid
              rows={[]}
              columns={[
                { field: "id", headerName: "ID", width: 70 },
                { field: "name", headerName: "Name", width: 130 },
                { field: "age", headerName: "Age", width: 90 },]}
              pageSize={5}
              checkboxSelection
              getRowId={(row) => row.id}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FileStatus;
