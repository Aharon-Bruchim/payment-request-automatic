import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CssBaseline } from "@mui/material";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <CssBaseline />
    <App />
  </BrowserRouter>
);
