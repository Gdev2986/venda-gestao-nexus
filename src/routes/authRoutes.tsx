
import { Route } from "react-router-dom";
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
      element={<Login />} 
    />
    <Route 
      path="/register" 
      element={<Register />} 
    />
    <Route 
      path="/forgot-password" 
      element={<ForgotPassword />} 
    />
    <Route 
      path="/reset-password" 
      element={<ResetPassword />} 
    />
  </Route>
);
