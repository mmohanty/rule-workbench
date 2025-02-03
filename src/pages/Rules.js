import React, { useState, useEffect } from "react";
import axios from "axios"; // Or use fetch
import {
  DndContext,
  closestCenter,
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
  DialogActions,
  TextField,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon, DragIndicator as DragIndicatorIcon } from "@mui/icons-material";

// Initial pool data (remains constant)
const initialPool = [
  { id: "pool-1", label: "Item A" },
  { id: "pool-2", label: "Item B", requiresInput: true, inputs: ["start", "end"] },
  { id: "pool-3", label: "Item C" },
  { id: "pool-4", label: "Item D", requiresInput: true, inputs: ["from", "to"] },
  { id: "pool-5", label: "Item E" },
];

const mockServerData = {
  key1: [
    { id: "copy-1", label: "Item B", requiresInput: true, inputs: ["start", "end"], start: "10", end: "20" },
    { id: "copy-2", label: "Item C" }
  ],
  key2: [
    { id: "copy-3", label: "Item D", requiresInput: true, inputs: ["from", "to"], from: "A", to: "B" }
  ],
  key3: [],
};

// Drop containers start empty
const initialContainers = {
  key1: [],
  key2: [],
  key3: [],
  key4: [],
  key5: [],
};

// Draggable item component
function SortableItem({ item, onEdit, onRemove, isPoolItem }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  return (
    <ListItem
      ref={setNodeRef}
      sx={{
        transform: CSS.Transform.toString(transform),
        transition: "transform 0.2s ease-in-out",
        display: "flex",
        alignItems: "center",
        padding: "10px",
        marginBottom: "4px",
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        borderRadius: "6px",
        cursor: "pointer",
        boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
        justifyContent: "space-between",
      }}
      {...attributes}
      {...listeners}
      onClick={() => onEdit(item)} // Calls handleEditItem
    >
      <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
        <DragIndicatorIcon sx={{ marginRight: 1 }} />
        {item.label} {item.start && ` (Start: ${item.start}, End: ${item.end})`}
      </Box>

      {!isPoolItem && (
        <Button variant="outlined" color="error" size="small" onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}>
          Remove
        </Button>
      )}
    </ListItem>
  );
}

// Sortable container with correct drop zone registration
function SortableContainer({ id, items, onEdit, onRemove, isPool }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
      <List
        component={Paper}
        variant="outlined"
        ref={setNodeRef}
        sx={{
          minHeight: "50px",
          padding: "10px",
          width: "100%",
          maxWidth: "600px",
          margin: "auto",
        }}
      >
        {items.map((item) => (
          <SortableItem key={item.id} item={item} onEdit={onEdit} onRemove={onRemove} isPoolItem={isPool} />
        ))}
      </List>
    </SortableContext>
  );
}




function Rules() {
  const [containers, setContainers] = useState(initialContainers);
  const [nextId, setNextId] = useState(6);
  const [activeItem, setActiveItem] = useState(null);
  const [open, setOpen] = useState(false);
  const [pendingDrop, setPendingDrop] = useState(null);
  const [formData, setFormData] = useState({ id: "", label: "", start: "", end: "", container: "" });

  const [jsonDialogOpen, setJsonDialogOpen] = useState(false);
  const [finalJson, setFinalJson] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setContainers(mockServerData); // Mimic API response
      setLoading(false);
    }, 1000); // Simulate a network delay (optional)
  }, []);

  // useEffect_unused(() => {
  //   axios.get("/api/config") // Replace with your actual API endpoint
  //     .then((response) => {
  //       const serverData = response.data; // Assume server returns { key1: [...], key2: [...], etc. }
  //       setContainers(serverData); // Set the state with pre-filled data
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching config:", error);
  //       setLoading(false);
  //     });
  // }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const findContainer = (id) =>
    Object.keys(containers).find((key) => containers[key].some((item) => item.id === id));

  const handleDragStart = (event) => {
    const draggedItem = initialPool.find((item) => item.id === event.active.id) || 
                        Object.values(containers).flat().find((item) => item.id === event.active.id);
    setActiveItem(draggedItem);
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

  const handleDropWithInput = () => {
    if (pendingDrop) {
      const { item, overContainer } = pendingDrop;
  
      // Collect user inputs dynamically
      const inputValues = {};
      item.inputs.forEach((inputField) => {
        inputValues[inputField] = formData[inputField] || "";
      });
  
      const updatedItem = {
        ...item,
        id: `copy-${nextId}`,
        ...inputValues,
      };
  
      setNextId((prev) => prev + 1);
  
      setContainers((prev) => ({
        ...prev,
        [overContainer]: [...prev[overContainer], updatedItem],
      }));
  
      setPendingDrop(null);
    } else if (formData.container) {
      // Editing an existing item
      setContainers((prev) => ({
        ...prev,
        [formData.container]: prev[formData.container].map((item) =>
          item.id === formData.id ? { ...item, ...formData } : item
        ),
      }));
    }
  
    // Close modal and reset form
    setOpen(false);
    setFormData({});
  };
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) {
      setActiveItem(null);
      return;
    }
  
    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id) || over.id;
  
    if (!activeContainer || !overContainer) {
      setActiveItem(null);
      return;
    }
  
    if (activeContainer === overContainer) {
      // Reorder within the same drop container
      const updatedItems = [...containers[activeContainer]];
      const oldIndex = updatedItems.findIndex((item) => item.id === active.id);
      const newIndex = updatedItems.findIndex((item) => item.id === over.id);
  
      if (oldIndex !== newIndex) {
        setContainers((prev) => ({
          ...prev,
          [activeContainer]: arrayMove(updatedItems, oldIndex, newIndex),
        }));
      }
    } else {
      // Moving between different containers
      const activeItem = containers[activeContainer].find((item) => item.id === active.id);
      setContainers((prev) => ({
        ...prev,
        [activeContainer]: prev[activeContainer].filter((item) => item.id !== active.id),
        [overContainer]: [...prev[overContainer], activeItem],
      }));
    }
  
    setActiveItem(null);
  };
  
  
  
  const handleEditItem = (item) => {
    const container = findContainer(item.id);
    
    if (!item.requiresInput) {
      return; // Do nothing if user input is not required
    }

    // Initialize formData with existing values or empty fields
    const inputData = {};
    item.inputs?.forEach((inputField) => {
      inputData[inputField] = item[inputField] || "";
    });
  
    setFormData({ id: item.id, label: item.label, container, inputs: item.inputs, ...inputData });
    setOpen(true);
  };

  const handleUpdateItem = () => {
    if (formData.container) {
      setContainers((prev) => ({
        ...prev,
        [formData.container]: prev[formData.container].map((item) =>
          item.id === formData.id ? { ...item, start: formData.start, end: formData.end } : item
        ),
      }));
    }
    setOpen(false);
    setFormData({ id: "", label: "", start: "", end: "", container: "" });
  };

  const generateFinalJSON = () => {
    const result = {};
  
    Object.keys(containers).forEach((key) => {
      result[key] = containers[key].map((item) => {
        const formattedItem = {
          id: item.id,
          label: item.label,
        };
  
        // Add user inputs dynamically if they exist
        if (item.inputs) {
          item.inputs.forEach((inputField) => {
            formattedItem[inputField] = item[inputField] || "";
          });
        }
  
        return formattedItem;
      });
    });
  
    setFinalJson(result);
    setJsonDialogOpen(true);
  };
  

    if (loading) {
      return <Typography>Loading...</Typography>; // Show loading message while fetching
    }
  return (
    <Container maxWidth="md">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="calc(100vh - 120px)" paddingTop={10}>
        <Paper elevation={3} sx={{ padding: 3, width: "100%", maxWidth: "900px" }}>
          <Typography variant="h4" gutterBottom align="center">
            Drag-and-Drop JSON Editor
          </Typography>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Typography variant="h5" align="center" sx={{ marginBottom: 2 }}>
              Pool
            </Typography>
            {/* Pool (No Remove Button) */}
            <SortableContainer id="pool" items={initialPool} onEdit={() => {}} isPool={true}/>

            {Object.keys(containers).map((key) => (
              <Accordion key={key} sx={{ width: "100%" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">{key}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <SortableContainer id={key} items={containers[key]} onEdit={handleEditItem} onRemove={handleRemoveItem} />
                </AccordionDetails>
              </Accordion>
            ))}
          </DndContext>

          {/* Added Buttons Here */}
          <Box mt={3} display="flex" justifyContent="space-between" width="100%">
            <Button variant="contained" color="primary" onClick={generateFinalJSON}>
              Generate JSON
            </Button>
            <Button variant="contained" color="secondary" onClick={() => console.log("Submitting JSON:", JSON.stringify(containers, null, 2))}>
              Submit
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Input Modal for User Configuration */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{pendingDrop ? "Configure Item" : "Edit Item"}</DialogTitle>
        <DialogContent>
          {formData.label && (
            <Typography variant="h6" gutterBottom>
              {formData.label}
            </Typography>
          )}

          {/* Ensure inputs appear dynamically */}
          {(pendingDrop?.item?.inputs || formData.inputs)?.map((inputField) => (
            <TextField
              key={inputField}
              label={inputField}
              fullWidth
              margin="dense"
              value={formData[inputField] || ""}
              onChange={(e) => setFormData({ ...formData, [inputField]: e.target.value })}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDropWithInput} color="primary">Save</Button>
        </DialogActions>
      </Dialog>



      {/* JSON Display Modal */}
      <Dialog open={jsonDialogOpen} onClose={() => setJsonDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Generated JSON</DialogTitle>
        <DialogContent>
          <Paper sx={{ padding: 2, backgroundColor: "#f5f5f5" }}>
            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {JSON.stringify(finalJson, null, 2)}
            </pre>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJsonDialogOpen(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Rules;
