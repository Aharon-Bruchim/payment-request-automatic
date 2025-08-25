import { Component, ReactNode } from "react";
import { Box, Button, Typography } from "@mui/material";

type Props = { children: ReactNode; fallback?: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <Box
          sx={{
            minHeight: "50vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h5">משהו השתבש</Typography>
          <Typography variant="body2">
            נסה לרענן את הדף או לחזור מאוחר יותר.
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            רענון
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}
