import { Stack, Typography } from "@mui/material";
import { Contact } from "../../types/contact";
import ContactCard from "./ContactCard";

export default function ContactsList({ contacts }: { contacts: Contact[] }) {
  if (contacts.length === 0) return <Typography>לא נמצאו אנשי קשר.</Typography>;
  return (
    <Stack spacing={2}>
      {contacts.map((c) => (
        <ContactCard key={c.id} contact={c} />
      ))}
    </Stack>
  );
}
