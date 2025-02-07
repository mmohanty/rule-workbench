import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  InputAdornment,
  IconButton,
  Tooltip,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Select,
  Radio,
} from "@mui/material";
import {
  Search,
  SwapHoriz,
  Refresh,
  Visibility,
  Send,
} from "@mui/icons-material";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";

const FileGridPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("fileName"); // Default to File Name search
  const [files, setFiles] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const [limit, setLimit] = useState("100"); // State for dropdown
  const [viewType, setViewType] = useState("Full"); // State for radio buttons

  const toggleSearchType = () => {
    setSearchType((prevType) =>
      prevType === "fileName" ? "fileId" : "fileName"
    );
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handleViewTypeChange = (event) => {
    setViewType(event.target.value);
  };
  // Mock Data for Testing
  const mockData = [
    { id: 1, fileId: "F123", fileName: "Report_ABC.pdf", status: "Pending" },
    {
      id: 2,
      fileId: "F124",
      fileName: "Invoice_2024.docx",
      status: "Approved",
    },
    { id: 3, fileId: "F125", fileName: "Presentation.pptx", status: "Pending" },
    {
      id: 4,
      fileId: "F126",
      fileName: "ProjectPlan.xlsx",
      status: "In Progress",
    },
  ];

  const toCamelCase = (str) =>
    str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  
  const transformData = (data) =>
    data.map((item) => {
      const transformedItem = Object.keys(item).reduce((acc, key) => {
        const newKey = toCamelCase(key);
        acc[newKey] = item[key]; // Convert key & assign value
        return acc;
      }, {});
  
      // Ensure MUI DataGrid gets an `id` field (use loan_id as id)
      transformedItem.id = item.loan_id;
  
      return transformedItem;
    });
  // Function to Load Dummy Data Instead of API Call
  const fetchMockFiles = () => {
    if (!searchQuery.trim()) {
      setFiles(mockData); // If search is empty, reset to full data
      return;
    }

    const filteredData = mockData.filter(
      (file) =>
        searchType === "fileId"
          ? file.fileId.toLowerCase() === searchQuery.toLowerCase() // Exact match for File ID
          : file.fileName.toLowerCase().includes(searchQuery.toLowerCase()) // Partial match for File Name
    );

    setFiles([...filteredData]); // Ensure React state updates correctly
  };

  // Function to Refresh Grid with Dummy Data
  const refreshGrid = () => {
    setSearchQuery(""); // Clear search
    setFiles([]); // Reset grid
    fetchMockFiles(); // Load Mock Data
  };

  const handleSubmit = async () => {
    try {
      alert(`Submitting files: ${selectedRows.join(", ")}`);
      setSelectedRows([]);
    } catch (error) {
      console.error("Error submitting files:", error);
    }
  };

  const CustomToolbar = () => (
    <GridToolbarContainer
      sx={{ display: "flex", gap: 1, alignItems: "center", padding: "8px" }}
    >
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector
        slotProps={{ tooltip: { title: "Change density" } }}
      />
      {/* Refresh Button with Label */}
      <Tooltip title="Refresh Grid">
        <Button variant="text" startIcon={<Refresh />} onClick={refreshGrid}>
          Refresh
        </Button>
      </Tooltip>
      {/* Export Button */}
      <GridToolbarExport />
    </GridToolbarContainer>
  );

  const columns = [
    { field: "fileId", headerName: "File ID", width: 150 },
    { field: "fileName", headerName: "File Name", flex: 1 },
    { field: "status", headerName: "Status", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          {/* View Button */}
          <Tooltip title="View File">
            <IconButton
              onClick={() => alert(`Viewing file ${params.row.fileId}`)}
            >
              <Visibility />
            </IconButton>
          </Tooltip>

          {/* Submit Button */}
          {/* Submit Button (Now using an Icon) */}
          <Tooltip title="Submit File">
            <IconButton
              color="primary"
              onClick={() => alert(`Submitting file ${params.row.fileId}`)}
            >
              <Send />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box p={2}>
      {/* First Section: Search, Grid, and Submit Button */}
      <Paper variant="outlined" sx={{ p: 2, border: "1px solid #ccc", mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Loan Management
        </Typography>
  
        {/* Search Input with Toggle Inside */}
        <TextField
          fullWidth
          label={`Search by ${searchType === "fileId" ? "File ID" : "File Name"}`}
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {searchType === "fileId" ? "🔢" : "📄"}
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {/* Toggle Button for Search Type */}
                <IconButton onClick={toggleSearchType} title="Toggle Search Type">
                  <SwapHoriz />
                </IconButton>
                {/* Search Button */}
                <IconButton onClick={fetchMockFiles}>
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
  
        {/* Data Grid with Custom Toolbar */}
        <DataGrid
          rows={files}
          columns={columns}
          checkboxSelection
          disableSelectionOnClick
          onSelectionModelChange={(newSelection) => setSelectedRows(newSelection)}
          autoHeight
          slots={{ toolbar: CustomToolbar }}
        />
  
        {/* Submit Button */}
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSubmit}
          disabled={selectedRows.length === 0}
          sx={{ mt: 2 }}
        >
          Submit Selected
        </Button>
      </Paper>
  
      {/* Second Section: Dropdown, Radio Buttons, and Submit */}
      <Paper variant="outlined" sx={{ p: 2, border: "1px solid #ccc" }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          View & Limit Settings
        </Typography>
  
        <Box display="flex" alignItems="center" gap={2}>
          {/* Dropdown for limit selection */}
          <FormControl size="small">
            <InputLabel>Limit</InputLabel>
            <Select value={limit} onChange={handleLimitChange}>
              <MenuItem value="100">100</MenuItem>
              <MenuItem value="500">500</MenuItem>
              <MenuItem value="1000">1000</MenuItem>
              <MenuItem value="FULL">FULL</MenuItem>
            </Select>
          </FormControl>
  
          {/* Radio buttons for Full or Half */}
          <RadioGroup row value={viewType} onChange={handleViewTypeChange}>
            <FormControlLabel value="Full" control={<Radio />} label="Full" />
            <FormControlLabel value="Half" control={<Radio />} label="Half" />
          </RadioGroup>
  
          {/* Submit Button */}
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
            disabled={selectedRows.length === 0}
          >
            Submit Selected
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default FileGridPage;
