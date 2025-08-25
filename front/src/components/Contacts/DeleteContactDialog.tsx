import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

interface Props {
  open: boolean;
  contactName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteContactDialog: React.FC<Props> = ({
  open,
  contactName,
  onClose,
  onConfirm,
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>אישור מחיקה</DialogTitle>
    <DialogContent>האם אתה בטוח שברצונך למחוק את {contactName}?</DialogContent>
    <DialogActions>
      <Button onClick={onClose}>ביטול</Button>
      <Button onClick={onConfirm} color="error">
        מחק
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteContactDialog;
