import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";
import App from "./App";
import "./index.css";
import { Toaster } from "@/components/ui/sonner";
import { KineProvider } from "./context/KineContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <KineProvider>
          <Toaster closeButton richColors position="top-center" duration={5000} />
          <App />
        </KineProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
