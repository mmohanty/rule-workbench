import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Collapse,
  IconButton,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import { Add, ExpandLess, ExpandMore, Delete, Edit } from "@mui/icons-material";

const RuleMapping = () => {
  const [rules, setRules] = useState({});
  const [expanded, setExpanded] = useState({});
  const [dialog, setDialog] = useState({ open: false, type: "", key: "", subKey: "" });
  const [jsonDialog, setJsonDialog] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // Simulating an API call with static data
    const staticData = {
      "Rule1": { "Condition1": "Value1", "Condition2": "Value2" },
      "Rule2": { "ConditionA": "ValueA", "ConditionB": "ValueB" }
    };
    
    setRules(staticData);
  }, []);

  const openDialog = (type, key = "", subKey = "") => {
    setDialog({ open: true, type, key, subKey });
    setInputValue(subKey || key);
  };

  const closeDialog = () => {
    setDialog({ open: false, type: "", key: "", subKey: "" });
    setInputValue("");
  };

  const openJsonDialog = () => {
    setJsonDialog(true);
  };

  const closeJsonDialog = () => {
    setJsonDialog(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Rule Mapping</Typography>
      <Button variant="contained" startIcon={<Add />} onClick={() => openDialog("addKey")} sx={{ mt: 2, mr: 2 }}>
        Add Key
      </Button>
      <Button variant="contained" color="secondary" onClick={openJsonDialog} sx={{ mt: 2, mr: 2 }}>
        Generate JSON
      </Button>
      <Button variant="contained" color="success" sx={{ mt: 2 }}>
        Submit
      </Button>
      <Box sx={{ mt: 3 }}>
        {Object.entries(rules).map(([key, values]) => (
          <Box key={key} sx={{ mb: 2, border: "1px solid #ccc", p: 2, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">{key}</Typography>
              <Box>
                <IconButton onClick={() => openDialog("renameKey", key)}><Edit /></IconButton>
                <IconButton onClick={() => openDialog("addSubKey", key)}><Add /></IconButton>
                <IconButton onClick={() => setExpanded({ ...expanded, [key]: !expanded[key] })}>
                  {expanded[key] ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
                <IconButton onClick={() => {
                  const updatedRules = { ...rules };
                  delete updatedRules[key];
                  setRules(updatedRules);
                }}><Delete /></IconButton>
              </Box>
            </Box>
            <Collapse in={expanded[key]}>
              <Box sx={{ mt: 2 }}>
                {Object.entries(values).map(([subKey, value]) => (
                  <Box key={subKey} sx={{ display: "flex", gap: 2, mb: 1, alignItems: "center" }}>
                    <TextField 
                      label={subKey} 
                      value={value} 
                      fullWidth 
                    />
                  </Box>
                ))}
              </Box>
            </Collapse>
          </Box>
        ))}
      </Box>
      <Dialog open={jsonDialog} onClose={closeJsonDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Generated JSON</DialogTitle>
        <DialogContent>
          <pre>{JSON.stringify(rules, null, 2)}</pre>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeJsonDialog} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RuleMapping;
