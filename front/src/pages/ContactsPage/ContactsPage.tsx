import { Box, Paper, Typography, Alert } from "@mui/material";
import ContactsList from "../../components/Contacts/ContactsList";
import NewContactButton from "../../components/Contacts/NewContactButton/NewContactButton";
import { useContacts } from "../../hooks/useContacts";
import { AppLoader } from "../../components/common/AppLoader";

export default function ContactsPage() {
  const { contacts, loading, error } = useContacts({ autoFetch: true });

  return (
    <>
      <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom>
            רשימת אנשי קשר
          </Typography>
          {loading ? (
            <AppLoader />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <ContactsList contacts={contacts} />
          )}
        </Paper>
      </Box>
      <NewContactButton />
    </>
  );
}
