import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Add, Delete, UploadFile } from "@mui/icons-material";
import { DataGrid, GridToolbarContainer, GridToolbar } from "@mui/x-data-grid";

const CustomGridToolbar = ({ addCondition, handleImport }) => (
  <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
    <input
      accept="application/json"
      style={{ display: 'none' }}
      id="import-json"
      type="file"
      onChange={handleImport}
    />
    <label htmlFor="import-json">
      <IconButton color="primary" component="span">
        <UploadFile />
      </IconButton>
    </label>
    <IconButton onClick={addCondition} color="primary">
      <Add />
    </IconButton>
  </GridToolbarContainer>
);

const RuleMapping = () => {
  const [rules, setRules] = useState({
    "RULE1": [
      { id: "1", name: "CONDITION1", value: "VALUE1" },
      { id: "2", name: "CONDITION2", value: "VALUE2" }
    ],
    "RULE2": [
      { id: "3", name: "CONDITION3", value: "VALUE3" }
    ]
  });
  const [selectedRule, setSelectedRule] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    if (selectedRule && rules[selectedRule]) {
      setRowData(rules[selectedRule]);
    } else {
      setRowData([]);
    }
  }, [selectedRule, rules]);

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          setRules(importedData);
        } catch (error) {
          console.error("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  const addCondition = () => {
    if (!selectedRule) return;
    
    const newId = (rowData.length + 1 + Math.max(...rowData.map(c => parseInt(c.id, 10) || 0), 0)).toString();
    const newCondition = { id: newId, name: `CONDITION${newId}`, value: `VALUE${newId}` };

    setRules((prevRules) => {
      const updatedRules = { ...prevRules };
      updatedRules[selectedRule] = [...updatedRules[selectedRule], newCondition];
      return updatedRules;
    });

    setRowData((prevData) => [...prevData, newCondition]);
  };

  const deleteCondition = (conditionId) => {
    if (!selectedRule) return;
    
    setRules((prevRules) => {
      const updatedRules = { ...prevRules };
      updatedRules[selectedRule] = updatedRules[selectedRule].filter((condition) => condition.id !== conditionId);
      return updatedRules;
    });

    setRowData((prevData) => prevData.filter((row) => row.id !== conditionId));
  };

  const onCellEditCommit = (params) => {
    const { id, field, value } = params;
    if (!selectedRule) return;
    
    const updatedValue = value.toUpperCase();
    setRules((prevRules) => {
      const updatedRules = { ...prevRules };
      updatedRules[selectedRule] = updatedRules[selectedRule].map((condition) =>
        condition.id === id ? { ...condition, [field]: updatedValue } : condition
      );
      return updatedRules;
    });

    setRowData((prevData) => prevData.map((row) =>
      row.id === id ? { ...row, [field]: updatedValue } : row
    ));
  };

  const handlePreview = () => {
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  const handleSubmit = () => {
    console.log("Submitting data:", rules);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 1, editable: false },
    { field: "name", headerName: "Condition Name", flex: 1, editable: true },
    { field: "value", headerName: "Value", flex: 1, editable: true },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={() => deleteCondition(params.row.id)} color="error">
          <Delete />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Rule Mapping</Typography>
      <FormControl fullWidth sx={{ mt: 2 }} variant="outlined">
        <InputLabel shrink>Select Rule</InputLabel>
        <Select
          value={selectedRule}
          onChange={(e) => setSelectedRule(e.target.value)}
          label="Select Rule"
        >
          {Object.keys(rules).map((rule) => (
            <MenuItem key={rule} value={rule}>{rule}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedRule && (
        <Box sx={{ mt: 2, height: 400, width: "100%" }}>
          <DataGrid
            rows={rowData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            pagination
            onCellEditCommit={onCellEditCommit}
            slots={{ toolbar: CustomGridToolbar }}
            //slots={{ toolbar: () => <CustomGridToolbar addCondition={addCondition} handleImport={handleImport} /> }}
          />
        </Box>
      )}
      {selectedRule && (
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button variant="contained" color="secondary" onClick={handlePreview}>
            Preview
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default RuleMapping;
