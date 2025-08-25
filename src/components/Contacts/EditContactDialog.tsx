import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

interface Props {
  open: boolean;
  name: string;
  email: string;
  onClose: () => void;
  onChangeName: (val: string) => void;
  onChangeEmail: (val: string) => void;
  onConfirm: () => void;
}

const EditContactDialog: React.FC<Props> = ({
  open,
  name,
  email,
  onClose,
  onChangeName,
  onChangeEmail,
  onConfirm,
}) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>עריכת איש קשר</DialogTitle>
    <DialogContent>
      <TextField
        fullWidth
        label="שם"
        margin="dense"
        value={name}
        onChange={(e) => onChangeName(e.target.value)}
      />
      <TextField
        fullWidth
        label="אימייל"
        margin="dense"
        value={email}
        onChange={(e) => onChangeEmail(e.target.value)}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>ביטול</Button>
      <Button onClick={onConfirm} variant="contained" color="primary">
        עדכן
      </Button>
    </DialogActions>
  </Dialog>
);

export default EditContactDialog;
