
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./providers/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { NotificationsProvider } from "./contexts/notifications/NotificationsContext";

// Ensure there's a single React instance
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <NotificationsProvider>
            <App />
            <Toaster position="top-right" />
          </NotificationsProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
