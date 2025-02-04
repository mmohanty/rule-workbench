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
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { DataGrid, GridToolbarContainer, GridToolbar } from "@mui/x-data-grid";

const CustomGridToolbar = ({ addCondition }) => (
  <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'space-between' }}>
    <GridToolbar />
    <IconButton onClick={addCondition} color="primary">
      <Add />
    </IconButton>
  </GridToolbarContainer>
);

const RuleMapping = () => {
  const [rules, setRules] = useState({});
  const [selectedRule, setSelectedRule] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    setRules({ "RULE1": { "Key1": "Value1" }, "RULE2": { "Key2": "Value2" } });
  }, []);

  const addCondition = () => {
    if (!selectedRule) return;

    setRules((prevRules) => {
      const updatedRules = { ...prevRules };
      if (!updatedRules[selectedRule]) updatedRules[selectedRule] = {};
      
      const newCondition = `NEW_CONDITION_${Object.keys(updatedRules[selectedRule]).length + 1}`;
      updatedRules[selectedRule][newCondition] = "";
      return updatedRules;
    });
  };

  const deleteCondition = (conditionId) => {
    if (!selectedRule) return;
    setRules((prevRules) => {
      const updatedRules = { ...prevRules };
      delete updatedRules[selectedRule][conditionId];
      return updatedRules;
    });
  };

  const handleEditCellChange = (params) => {
    const { id, field, value } = params;
    setRules((prevRules) => {
      const updatedRules = { ...prevRules };
      if (updatedRules[selectedRule]) {
        updatedRules[selectedRule] = {
          ...updatedRules[selectedRule],
          [id]: field === "value" ? value : updatedRules[selectedRule][id]
        };
      }
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
    { field: "id", headerName: "Condition Name", flex: 1, editable: false },
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

  const rows = selectedRule && rules[selectedRule]
    ? Object.entries(rules[selectedRule]).map(([key, value]) => ({ id: key, value }))
    : [];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Rule Mapping</Typography>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Select Rule</InputLabel>
        <Select
          value={selectedRule}
          onChange={(e) => setSelectedRule(e.target.value)}
        >
          {Object.keys(rules).map((rule) => (
            <MenuItem key={rule} value={rule}>{rule}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedRule && (
        <Box sx={{ mt: 2, height: 400 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            onCellEditCommit={handleEditCellChange}
            slots={{ toolbar: () => <CustomGridToolbar addCondition={addCondition} /> }}
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
