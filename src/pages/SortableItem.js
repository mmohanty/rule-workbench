import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ListItem, Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { DragIndicator as DragIndicatorIcon } from "@mui/icons-material";

function SortableItem({ item, onRemove, onUpdate, isPoolItem = false }) {
    const { attributes, listeners, setNodeRef, transform } = useSortable({ id: item.id });
    const [open, setOpen] = useState(false);
    const [updatedInputs, setUpdatedInputs] = useState({ ...item.userInputs });
  
    // Prevent dialog from opening if the item is in the pool
    const handleOpen = () => {
      if (!isPoolItem && item.requiresInput) {
        setOpen(true);
      }
    };
  
    const handleClose = () => setOpen(false);
  
    const handleSave = () => {
      onUpdate(item.id, updatedInputs);
      handleClose();
    };
  
    return (
      <>
        <ListItem
          ref={setNodeRef}
          sx={{
            transform: CSS.Transform.toString(transform),
            display: "flex",
            alignItems: "center",
            padding: "10px",
            marginBottom: "4px",
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: "6px",
            cursor: item.requiresInput && !isPoolItem ? "pointer" : "default",
            justifyContent: "space-between",
          }}
          {...attributes}
          {...listeners}
          onClick={handleOpen} // Only triggers if not in the pool
        >
          <Box display="flex" alignItems="center">
            <DragIndicatorIcon sx={{ marginRight: 1 }} />
            <Typography>
              {item.label}
              {item.requiresInput && item.userInputs
                ? ` (${Object.values(item.userInputs).join(", ")})`
                : ""}
            </Typography>
          </Box>
  
          {onRemove && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(item.id);
              }}
            >
              Remove
            </Button>
          )}
        </ListItem>
  
        {/* Dialog for Editing Inputs (Only Opens for Dropped Items) */}
        {!isPoolItem && item.requiresInput && (
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Edit {item.label}</DialogTitle>
            <DialogContent>
              {item.inputs?.map((field) => (
                <TextField
                  key={field}
                  fullWidth
                  margin="dense"
                  label={field}
                  value={updatedInputs[field] || ""}
                  onChange={(e) =>
                    setUpdatedInputs((prev) => ({ ...prev, [field]: e.target.value }))
                  }
                />
              ))}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">Cancel</Button>
              <Button onClick={handleSave} color="primary">Save</Button>
            </DialogActions>
          </Dialog>
        )}
      </>
    );
  }  

export default SortableItem;
