import { Paper, Stack, Button, Typography, Box } from "@mui/material";
import { Send, Edit, Delete } from "@mui/icons-material";
import { Contact } from "../../types/contact";
import EditContactDialog from "./EditContactDialog";
import DeleteContactDialog from "./DeleteContactDialog";
import { useEditContactDialog } from "../../hooks/useEditContactDialog";
import { useDeleteContactDialog } from "../../hooks/useDeleteContactDialog";
import { useContacts } from "../../hooks/useContacts";

export default function ContactCard({ contact }: { contact: Contact }) {
  const edit = useEditContactDialog(contact.name, contact.email);
  const del = useDeleteContactDialog();

  const { deleteId, updateId, sendMessage, updateContact, deleteContact } =
    useContacts({ autoFetch: false });

  const handleConfirmUpdate = async () => {
    await updateContact(contact.id, edit.name, edit.email);
    edit.closeDialog();
  };

  const handleConfirmDelete = async () => {
    await deleteContact(contact.id, contact.name);
    del.closeDialog();
  };

  const isDeleting = deleteId === contact.id;
  const isUpdating = updateId === contact.id;

  return (
    <>
      <Paper
        elevation={2}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row-reverse" },
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderRadius: 3,
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            textAlign: { xs: "center", sm: "right" },
            flexGrow: 1,
            ml: { sm: 4 },
            mt: { xs: 1, sm: 0 },
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            {contact.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {contact.email}
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ flexShrink: 0, width: { xs: "100%", sm: "auto" } }}
        >
          <Button
            fullWidth
            variant="contained"
            color="success"
            onClick={() => sendMessage(contact.name, contact.email)}
            startIcon={<Send />}
          >
            שלח
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="info"
            onClick={edit.openDialog}
            startIcon={<Edit />}
            disabled={isUpdating}
          >
            {isUpdating ? "שומר..." : "ערוך"}
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="error"
            onClick={del.openDialog}
            startIcon={<Delete />}
            disabled={isDeleting}
          >
            {isDeleting ? "מוחק..." : "מחק"}
          </Button>
        </Stack>
      </Paper>

      <EditContactDialog
        open={edit.open}
        name={edit.name}
        email={edit.email}
        onChangeName={edit.setName}
        onChangeEmail={edit.setEmail}
        onClose={edit.closeDialog}
        onConfirm={handleConfirmUpdate}
      />

      <DeleteContactDialog
        open={del.open}
        contactName={contact.name}
        onClose={del.closeDialog}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
