
import { Route } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";
import AuthLayout from "../layouts/AuthLayout";

// Auth pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

export const AuthRoutes = (
  <Route element={<AuthLayout />}>
    <Route 
      path="/login" 
      element={
        <AuthGuard requireAuth={false}>
          <Login />
        </AuthGuard>
      } 
    />
    <Route 
      path="/register" 
      element={
        <AuthGuard requireAuth={false}>
          <Register />
        </AuthGuard>
      } 
    />
    <Route 
      path="/forgot-password" 
      element={
        <AuthGuard requireAuth={false}>
          <ForgotPassword />
        </AuthGuard>
      } 
    />
    <Route 
      path="/reset-password" 
      element={
        <AuthGuard requireAuth={false}>
          <ResetPassword />
        </AuthGuard>
      } 
    />
  </Route>
);
