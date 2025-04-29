import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

// Pages
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Clients from "@/pages/Clients";
import ClientRegister from "@/pages/ClientRegister";
import ClientRegistration from "@/pages/ClientRegistration";
import Machines from "@/pages/Machines";
import Partners from "@/pages/Partners";
import Payments from "@/pages/Payments";
import Reports from "@/pages/Reports";
import Fees from "@/pages/Fees";
import Support from "@/pages/Support";
import Settings from "@/pages/Settings";
import Sales from "@/pages/Sales";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";

// Initialize QueryClient
const queryClient = new QueryClient();

const App = () => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/clients",
    element: <Clients />,
  },
  {
    path: "/client-register",
    element: <ClientRegistration />,
  },
  {
    path: "/clients/new",
    element: <ClientRegister />,
  },
  {
    path: "/clients/:id",
    element: <ClientRegister />,
  },
  {
    path: "/machines",
    element: <Machines />,
  },
  {
    path: "/partners",
    element: <Partners />,
  },
  {
    path: "/payments",
    element: <Payments />,
  },
  {
    path: "/reports",
    element: <Reports />,
  },
  {
    path: "/fees",
    element: <Fees />,
  },
  {
    path: "/support",
    element: <Support />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/sales",
    element: <Sales />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default App;
