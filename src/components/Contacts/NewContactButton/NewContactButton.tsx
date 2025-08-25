import React from "react";
import { Fab } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const NewContactButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Fab
      color="primary"
      aria-label="הוסף"
      onClick={() => navigate("/contacts/new")}
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 1000,
      }}
    >
      <Add />
    </Fab>
  );
};

export default NewContactButton;
