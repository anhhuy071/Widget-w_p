import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MainLayout from "./layouts/MainLayout";
import "./assets/css/index.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <MainLayout />
  </StrictMode>,
);
