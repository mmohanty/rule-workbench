import React, { useState } from "react";
import {
  Button,
  Container,
  Typography,
  Box,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DndContext, 
  closestCorners, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragOverlay } from "@dnd-kit/core";
import SortableContainer from "./SortableContainer";
import { initialPool, mockServerData } from "./data";
import SortableItem from "./SortableItem";
import { arrayMove } from "@dnd-kit/sortable";

function Rules() {
  const [containers, setContainers] = useState(mockServerData);
  const [selectedKey, setSelectedKey] = useState(Object.keys(mockServerData)[0]);
  const [previewJSON, setPreviewJSON] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialogItem, setOpenDialogItem] = useState(null); // FIX: Added state
  const [inputValues, setInputValues] = useState({}); // FIX: Added state

  const [activeItem, setActiveItem] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));


  const handleDragStart = (event) => {
    setActiveItem(event.active.data.current);
  };


  const handleKeyChange = (event) => {
    setSelectedKey(event.target.value);
  };

  const filteredPool = initialPool.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragEnd = (event) => {
    setActiveItem(null);
    const { active, over } = event;
    if (!over) return;

    let overContainer = selectedKey;

    setContainers((prev) => {
        const updatedContainers = { ...prev };
        
        // Find the active item in the container
        const activeIndex = updatedContainers[overContainer].findIndex((item) => item.id === active.id);
        const overIndex = updatedContainers[overContainer].findIndex((item) => item.id === over.id);

        // If the active item exists in the container, reorder it instead of duplicating
        if (activeIndex !== -1) {
            updatedContainers[overContainer] = arrayMove(updatedContainers[overContainer], activeIndex, overIndex);
        } else {
            const activeItem = initialPool.find((item) => item.id === active.id) ||
                Object.values(prev).flat().find((item) => item.id === active.id);

            if (!activeItem) return prev;

            // If item requires input, open dialog before adding
            if (active.id.startsWith("pool") && activeItem.requiresInput) {
                setTimeout(() => {
                    setOpenDialogItem({ ...activeItem, id: `copy-${crypto.randomUUID()}`, container: overContainer });
                }, 100);
                return prev; // Wait for user input before adding
            }

            // Otherwise, add the item directly
            updatedContainers[overContainer] = [
                ...(updatedContainers[overContainer] || []),
                { ...activeItem, id: `copy-${crypto.randomUUID()}` },
            ];
        }

        return updatedContainers;
    });
};

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

  // Save user input and add item to the drop area
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
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom align="center">
        Drag-and-Drop JSON Editor
      </Typography>

      <Box display="flex" gap={3} justifyContent="center" alignItems="flex-start">
        <Box flex="1" minWidth="250px">
          <TextField
            fullWidth
            label="Search Items"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <DndContext sensors={sensors} collisionDetection={closestCorners} 
          onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <SortableContainer id="pool" items={filteredPool} />
            
          </DndContext>
        </Box>

        <Box flex="2" minWidth="500px">
          <Select fullWidth value={selectedKey} onChange={handleKeyChange}>
            {Object.keys(containers).map((key) => (
              <MenuItem key={key} value={key}>
                {key}
              </MenuItem>
            ))}
          </Select>

          <Box mt={3} border="1px solid #ddd" borderRadius="6px" padding="16px">
            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <SortableContainer id={selectedKey} items={containers[selectedKey]} onRemove={handleRemoveItem} onUpdate={handleUpdateItem} />
            
            {/* Drag Overlay for Smooth Dragging */}
            <DragOverlay>
                {activeItem ? <SortableItem item={activeItem} isDragging /> : null}
            </DragOverlay>
            </DndContext>
          </Box>
        </Box>
      </Box>

      {/* Dialog for User Input */}
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
    {previewJSON && (
    <Dialog open={true} onClose={() => setPreviewJSON(null)} fullWidth maxWidth="md">
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
    )}

    <Box display="flex" justifyContent="center" mt={4} gap={2}>
    <Button variant="contained" color="primary" onClick={handlePreview}>
        Preview JSON
    </Button>
    <Button variant="contained" color="success" onClick={handleSubmit}>
        Submit JSON
    </Button>
    </Box>
    </Container>
  );
}

export default Rules;
