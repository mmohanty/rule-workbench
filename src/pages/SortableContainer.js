import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Paper, List, Typography } from "@mui/material";
import SortableItem from "./SortableItem"; // Component for individual items

function SortableContainer({ id, items, onRemove, onUpdate }) {
    const { setNodeRef } = useDroppable({ id });
  
    return (
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <Paper
          ref={setNodeRef}
          variant="outlined"
          sx={{
            //minHeight: { xs: "120px", sm: "150px", md: "180px" },
            //maxHeight: { xs: "300px", sm: "400px", md: "500px" },
            //overflowY: "auto",
            padding: "10px",
            width: "100%",
            backgroundColor: items.length > 0 ? "#f9f9f9" : "#ffffff",
            transition: "background-color 0.2s ease-in-out",
            touchAction: "none",
          }}
        >
          {items.length === 0 ? (
            <Typography align="center" color="textSecondary">
              Drag and drop items here
            </Typography>
          ) : (
            <List>
              {items.map((item) => (
                <SortableItem
                  key={item.id}
                  item={item}
                  onRemove={id !== "pool" ? onRemove : null}
                  onUpdate={onUpdate}
                  isPoolItem={id === "pool"} // Prevent dialog for pool items
                />
              ))}
            </List>
          )}
        </Paper>
      </SortableContext>
    );
  }
  
  
export default SortableContainer;
