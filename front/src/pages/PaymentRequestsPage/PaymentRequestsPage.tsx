import React from "react";
import { Typography, Box, Container } from "@mui/material";
import { PaymentRequestForm } from "../../components/PaymentRequests/PaymentRequestForm";
import { useSearchParams } from "react-router-dom";

const PaymentRequests: React.FC = () => {
  const [searchParams] = useSearchParams();
  const clientName = searchParams.get("clientName") || "";
  const clientEmail = searchParams.get("clientEmail") || "";

  return (
    <Container maxWidth="md">
      <Box textAlign="right" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          יצירת בקשת תשלום
        </Typography>
      </Box>
      <PaymentRequestForm
        prefillClientName={clientName}
        prefillClientEmail={clientEmail}
      />
    </Container>
  );
};

export default PaymentRequests;
