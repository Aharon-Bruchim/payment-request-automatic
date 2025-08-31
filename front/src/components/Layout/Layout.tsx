import React from "react";
import { Container, Box } from "@mui/material";
import { Navigation } from "../Navigation/Navigation";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <Navigation />

      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundImage: "url('/background_pdf.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          opacity: 0.15,
          zIndex: -1,
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ py: 6, position: "relative", zIndex: 1 }}>
        {children}
      </Container>
    </>
  );
};
