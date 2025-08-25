import React, { useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useContacts } from "../../../hooks/contacts/useContacts";

const NewContactForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { loading, createContact } = useContacts({ autoFetch: false });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    const ok = await createContact(name, email, { redirectTo: "/contacts" });
    if (ok) {
      setName("");
      setEmail("");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>
          יצירת איש קשר חדש
        </Typography>

        <form onSubmit={onSubmit} noValidate>
          <TextField
            label="שם"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            autoComplete="name"
            required
          />

          <TextField
            label="אימייל"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            autoComplete="email"
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? "שומר..." : "שמור"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default NewContactForm;
