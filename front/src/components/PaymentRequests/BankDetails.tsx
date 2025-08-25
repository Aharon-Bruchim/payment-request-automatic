import React from "react";
import { Paper, Typography } from "@mui/material";

export const BankDetails: React.FC = () => {
  return (
    <Paper elevation={1} sx={{ p: 2, textAlign: "right" }}>
      <Typography variant="subtitle1" fontWeight="bold">
        פרטי בנק להעברה
      </Typography>
      <Typography>בנק: הפועלים (12)</Typography>
      <Typography>סניף: 698</Typography>
      <Typography>מספר חשבון: 66806</Typography>
    </Paper>
  );
};
