import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItem,
  Paper,
  Box,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon, DragIndicator as DragIndicatorIcon } from "@mui/icons-material";
import SortableItem from "./SortableItem";

const initialPool = [
  { id: "pool-1", label: "Item A" },
  { id: "pool-2", label: "Item B", requiresInput: true, inputs: ["start", "end"] },
  { id: "pool-3", label: "Item C" },
  { id: "pool-4", label: "Item D", requiresInput: true, inputs: ["from", "to"] },
  { id: "pool-5", label: "Item E" },
];

const mockServerData = {
  key1: [],
  key2: [],
  key3: [],
};

function SortableContainer({ id, items, onRemove, onUpdate }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
      <List
        component={Paper}
        variant="outlined"
        ref={setNodeRef}
        sx={{
          minHeight: `${100 + items.length * 50}px`, // Expand dynamically
          padding: "10px",
          width: "100%",
          maxWidth: "400px",
          margin: "auto",
          transition: "min-height 0.3s ease-in-out",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {items.map((item) => (
          <SortableItem key={item.id} item={item} onRemove={onRemove} onUpdate={onUpdate} />
        ))}
      </List>
    </SortableContext>
  );
}



function Rules() {

  const [openDialogItem, setOpenDialogItem] = useState(null);
  const [inputValues, setInputValues] = useState({});

  const [containers, setContainers] = useState(mockServerData);
  const [activeItem, setActiveItem] = useState(null);

  const [previewJSON, setPreviewJSON] = useState(null);

  const [expandedContainers, setExpandedContainers] = useState(Object.keys(mockServerData)); // Track expanded containers

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );


  const handleUpdateItem = (itemId, newInputs) => {
    setContainers((prev) => {
      const updatedContainers = {};
      Object.keys(prev).forEach((key) => {
        updatedContainers[key] = prev[key].map((item) =>
          item.id === itemId ? { ...item, userInputs: newInputs } : item
        );
      });
      return updatedContainers;
    });
  };

  const handleDialogSave = () => {
    if (!openDialogItem) return;
  
    setContainers((prev) => {
      const updatedContainers = { ...prev };
  
      updatedContainers[openDialogItem.container] = [
        ...(updatedContainers[openDialogItem.container] || []),
        { ...openDialogItem, userInputs: inputValues, id: `copy-${crypto.randomUUID()}` },
      ];
  
      return updatedContainers;
    });
  
    setOpenDialogItem(null);
    setInputValues({});
  };
  
  
  // Generate Final JSON
  const handlePreview = () => {
    const finalData = Object.keys(containers).reduce((result, key) => {
      result[key] = containers[key].map(({ id, label, requiresInput, userInputs }) => ({
        id,
        label,
        requiresInput,
        params: requiresInput ? userInputs : {},
      }));
      return result;
    }, {});
    setPreviewJSON(finalData);
  };

  const handleSubmit = () => {
    console.log("Final JSON Submitted:", previewJSON);
    alert("JSON Submitted! Check the console for output.");
  };
  
  const handleDragStart = (event) => {
    setActiveItem(event.active.data.current);
  };
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
  
    console.log("Dropped item:", active.id);
    console.log("Over target ID:", over.id);
  
    // 🛠 Step 1: Identify the correct container
    let overContainer = Object.keys(containers).find((key) => key === over.id);
  
    // If `over.id` is an item, find its parent container
    if (!overContainer) {
      overContainer = Object.keys(containers).find((key) =>
        containers[key].some((item) => item.id === over.id)
      );
    }
  
    // 🛠 Step 2: Ensure only expanded containers are used
    if (!overContainer || !expandedContainers.includes(overContainer)) {
      console.warn("Drop target is not expanded:", over.id);
  
      // Find the next closest **expanded** container
      const nextAvailableContainer = expandedContainers.find((key) => key !== overContainer);
  
      if (nextAvailableContainer) {
        overContainer = nextAvailableContainer;
      } else {
        console.warn("No expanded containers available. Drop ignored.");
        return;
      }
    }
  
    // 🛠 Step 3: Find the active item
    const activeItem = initialPool.find((item) => item.id === active.id) ||
      Object.values(containers).flat().find((item) => item.id === active.id);
  
    if (!activeItem) return;
  
    // 🛠 Step 4: If the item requires input, open the dialog BEFORE adding it
    if (activeItem.requiresInput) {
      setTimeout(() => {
        setOpenDialogItem({
          ...activeItem,
          id: `copy-${crypto.randomUUID()}`, // Ensure unique ID
          container: overContainer,
        });
      }, 100);
      return; // Prevent adding the item until user input is provided
    }
  
    // 🛠 Step 5: Append the dropped item to the correct container
    setContainers((prev) => {
      const updatedContainers = { ...prev };
  
      updatedContainers[overContainer] = [
        ...(updatedContainers[overContainer] || []), // Keep existing items
        { ...activeItem, id: `copy-${crypto.randomUUID()}` }, // Ensure unique ID for each dropped item
      ];
  
      console.log("Updated state:", updatedContainers);
      return { ...updatedContainers }; // Ensure proper state update
    });
  
    setActiveItem(null);
  };
  
  
  
  const handleRemoveItem = (itemId) => {
    setContainers((prev) => {
      const updatedContainers = {};
      Object.keys(prev).forEach((key) => {
        updatedContainers[key] = prev[key].filter((item) => item.id !== itemId);
      });
      return updatedContainers;
    });
  };

  return (
    <>
    {/* Main DndContext and UI */}
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom align="center">
            Drag-and-Drop JSON Editor
          </Typography>

          <Box display="flex" gap={3} justifyContent="center" alignItems="flex-start">
            <Box flex="1" minWidth="300px">
              <Typography variant="h5" align="center">Pool</Typography>
              <SortableContainer id="pool" items={initialPool} />
            </Box>

            <Box flex="2" minWidth="500px">
              {Object.keys(containers).map((key) => (
                <Accordion key={key} sx={{ width: "100%" }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">{key}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                  <SortableContainer id={key} items={containers[key]} onRemove={handleRemoveItem} onUpdate={handleUpdateItem} />
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Box>

          <DragOverlay>
            {activeItem ? (
              <Paper
                sx={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  backgroundColor: "#fff",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <DragIndicatorIcon sx={{ marginRight: 1 }} />
                {activeItem.label}
              </Paper>
            ) : null}
          </DragOverlay>
        </Container>
      </DndContext>

    {/* Buttons for Preview & Submit (Outside DndContext) */}
    <Box display="flex" justifyContent="center" mt={4} gap={2}>
        <Button variant="contained" color="primary" onClick={handlePreview}>
          Preview JSON
        </Button>
        <Button variant="contained" color="success" onClick={handleSubmit}>
          Submit JSON
        </Button>
    </Box>
    {/* Dialog for User Input on Drop */}
      {openDialogItem && (
        <Dialog open={true} onClose={() => setOpenDialogItem(null)}>
          <DialogTitle>Enter Details for {openDialogItem.label}</DialogTitle>
          <DialogContent>
            {openDialogItem.inputs?.map((field) => (
              <TextField
                key={field}
                fullWidth
                margin="dense"
                label={field}
                value={inputValues[field] || ""}
                onChange={(e) =>
                  setInputValues((prev) => ({ ...prev, [field]: e.target.value }))
                }
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialogItem(null)} color="secondary">Cancel</Button>
            <Button onClick={handleDialogSave} color="primary">Save</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Dialog to Show JSON Preview */}
      <Dialog open={!!previewJSON} onClose={() => setPreviewJSON(null)} fullWidth maxWidth="md">
        <DialogTitle>Preview JSON</DialogTitle>
        <DialogContent>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: "14px" }}>
            {JSON.stringify(previewJSON, null, 2)}
          </pre>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewJSON(null)} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Rules;
