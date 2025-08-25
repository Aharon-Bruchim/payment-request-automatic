import React from "react";
import { Container } from "@mui/material";
import { Navigation } from "../Navigation/Navigation";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <Navigation />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {children}
      </Container>
    </>
  );
};
