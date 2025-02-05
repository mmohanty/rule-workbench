import React, { useState, useEffect } from "react";
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
  TextField,
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
      { id: "1", name: "Key1", value: "Value1" },
      { id: "2", name: "Key2", value: "Value2" }
    ],
    "RULE2": [
      { id: "3", name: "Key3", value: "Value3" }
    ]
  });
  const [selectedRule, setSelectedRule] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [rowData, setRowData] = useState([]);

  //const [rules, setRules] = useState({});
//   useEffect(() => {
//     axios.get("/api/rules")
//       .then(response => {
//         setRules(response.data);
//       })
//       .catch(error => console.error("Error fetching rules:", error));
//   }, []);
  useEffect(() => {
    if (selectedRule && rules[selectedRule]) {
      setRowData([...rules[selectedRule]]);
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
    const newCondition = { id: newId, name: `KEY${newId}`, value: "" };

    setRules((prevRules) => {
      const updatedRules = { ...prevRules };
      updatedRules[selectedRule] = [...updatedRules[selectedRule], newCondition];
      return updatedRules;
    });
  };

  const deleteCondition = (conditionId) => {
    if (!selectedRule) return;
    
    setRules((prevRules) => {
      const updatedRules = { ...prevRules };
      updatedRules[selectedRule] = updatedRules[selectedRule].filter((condition) => condition.id !== conditionId);
      return updatedRules;
    });
  };

  const onCellEditCommit = (params) => {
    const { id, field, value } = params;
    if (!selectedRule) return;
    
    setRules((prevRules) => {
      const updatedRules = { ...prevRules };
      updatedRules[selectedRule] = updatedRules[selectedRule].map((condition) =>
        condition.id === id ? { ...condition, [field]: value.toUpperCase() } : condition
      );
      return updatedRules;
    });
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
            slots={{ toolbar: () => <CustomGridToolbar addCondition={addCondition} handleImport={handleImport} /> }}
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
      <Dialog open={previewOpen} onClose={handleClosePreview} maxWidth="sm" fullWidth>
        <DialogTitle>Preview Data</DialogTitle>
        <DialogContent>
          <pre>{JSON.stringify(rules, null, 2)}</pre>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RuleMapping;
