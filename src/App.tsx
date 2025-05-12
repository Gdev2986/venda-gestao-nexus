import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { Spinner } from "./components/ui/spinner";
import { ThemeProvider } from "./components/theme-provider";
import RootLayout from "./layouts/RootLayout";
import { Toaster } from "./components/ui/sonner";

// Route imports
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Profile = lazy(() => import("./pages/Profile"));
const Clients = lazy(() => import("./pages/Clients"));
const Sales = lazy(() => import("./pages/Sales"));
const Partners = lazy(() => import("./pages/Partners"));
const NotificationsPage = lazy(() => import("./pages/Notifications"));
const Payments = lazy(() => import("./pages/Payments"));
const PixKeys = lazy(() => import("./pages/PixKeys"));

// Admin Routes
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));

// Error Pages
const NotFound = lazy(() => import("./pages/NotFound"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));

// Route definitions
import { adminRoutes } from "./routes/admin/adminRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
      { path: "/profile", element: <Profile /> },
      { path: "/clients", element: <Clients /> },
      { path: "/sales", element: <Sales /> },
      { path: "/partners", element: <Partners /> },
      { path: "/notifications", element: <NotificationsPage /> },
      { path: "/payments", element: <Payments /> },
      { path: "/pix-keys", element: <PixKeys /> },
      { path: "/unauthorized", element: <Unauthorized /> },
      // Admin Routes
      { path: "/admin", element: <AdminDashboard /> },
      ...adminRoutes,
    ],
  },
]);

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <AuthProvider>
          <Suspense fallback={<Spinner />}>
            <RouterProvider router={router} />
          </Suspense>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
