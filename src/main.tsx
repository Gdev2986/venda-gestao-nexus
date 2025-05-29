
import * as React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import AuthProvider from "@/providers/AuthProvider";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { Toaster } from "@/components/ui/sonner";
import App from "./App";
import "./index.css";

// Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

// Render safely
function renderApp() {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("❌ Root element not found");
    return;
  }

  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="dark" storageKey="sigmapay-theme">
            <AuthProvider>
              <NotificationsProvider>
                <App />
                <Toaster />
              </NotificationsProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </React.StrictMode>
    );
    console.log("✅ Application rendered successfully");
  } catch (error) {
    console.error("❌ Failed to render application:", error);
  }
}

// Wait for DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderApp);
} else {
  renderApp();
}

// Catch unexpected errors
window.onerror = function (message, source, lineno, colno, error) {
  console.error("🔴 Global error caught:", { message, source, lineno, colno, error });
  return false;
};
