import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, TextField, Button, Typography, Box, IconButton, Accordion, AccordionSummary, AccordionDetails, Modal, Paper } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const JsonEditor = () => {
  const { param } = useParams();
  const [keyValuePairs, setKeyValuePairs] = useState([]);
  const [jsonOutput, setJsonOutput] = useState(null);
  const [filterKey, setFilterKey] = useState("");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    // Static data for initial rendering, replace this with an API call later
    const staticData = [
      { key: "Name", value: "John Doe" },
      { key: "Email", value: "john.doe@example.com" },
      { key: "Phone", value: "123-456-7890" }
    ];
    setKeyValuePairs(staticData);
  }, []);

  const handleAddPair = () => {
    setKeyValuePairs([...keyValuePairs, { key: "", value: "" }]);
  };

  const handleRemovePair = (index) => {
    const updatedPairs = keyValuePairs.filter((_, i) => i !== index);
    setKeyValuePairs(updatedPairs);
  };

  const handleChange = (index, field, value) => {
    const updatedPairs = [...keyValuePairs];
    updatedPairs[index][field] = value;
    setKeyValuePairs(updatedPairs);
  };

  const generateJson = () => {
    const jsonObject = keyValuePairs
      .filter(pair => pair.key)
      .map(pair => ({ field_name: pair.key, field_value: pair.value }));
    setJsonOutput(JSON.stringify(jsonObject, null, 2));
    setOpenModal(true);
  };

  const handleSubmit = () => {
    console.log("Submitting JSON:", jsonOutput);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        JSON Editor - {param}
      </Typography>
      <TextField
        label="Filter by Key"
        variant="outlined"
        fullWidth
        value={filterKey}
        onChange={(e) => setFilterKey(e.target.value)}
        sx={{ mb: 2 }}
      />
      {keyValuePairs
        .filter(pair => pair.key.toLowerCase().includes(filterKey.toLowerCase()))
        .map((pair, index) => (
          <Accordion key={index} sx={{ width: "100%" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ flexGrow: 1 }}>{pair.key || "New Key"}</Typography>
              <IconButton onClick={() => handleRemovePair(index)} color="error">
                <DeleteIcon />
              </IconButton>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                label="Key"
                variant="outlined"
                value={pair.key}
                onChange={(e) => handleChange(index, "key", e.target.value)}
                fullWidth
                sx={{ fontSize: "1.2rem", mb: 2 }}
              />
              <TextField
                label="Value"
                variant="outlined"
                multiline
                minRows={4}
                value={pair.value}
                onChange={(e) => handleChange(index, "value", e.target.value)}
                fullWidth
                sx={{ fontSize: "1.2rem" }}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      <Button startIcon={<AddIcon />} onClick={handleAddPair} variant="contained" color="primary" sx={{ fontSize: "1.2rem", padding: "10px 20px", mt: 3 }}>
        Add Key
      </Button>
      <Box mt={3} display="flex" justifyContent="center" gap={2}>
        <Button onClick={generateJson} variant="contained" color="secondary" sx={{ fontSize: "1.2rem", padding: "10px 20px" }}>
          Generate JSON
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="success" sx={{ fontSize: "1.2rem", padding: "10px 20px" }}>
          Submit
        </Button>
      </Box>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Paper sx={{ p: 4, maxWidth: "80%", margin: "auto", mt: 10 }}>
          <Typography variant="h6">Generated JSON</Typography>
          <Typography variant="body1" component="pre" sx={{ fontSize: "1.2rem", mt: 2 }}>
            {jsonOutput}
          </Typography>
        </Paper>
      </Modal>
    </Container>
  );
};

export default JsonEditor;
