
import React from "react";
import { Route } from "react-router-dom";
import { PATHS } from "./paths";

// Import auth pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";

export const AuthRoutes = (
  <>
    <Route path={PATHS.LOGIN} element={<Login />} />
    <Route path={PATHS.REGISTER} element={<Register />} />
    <Route path={PATHS.FORGOT_PASSWORD} element={<ForgotPassword />} />
    <Route path={PATHS.RESET_PASSWORD} element={<ResetPassword />} />
  </>
);
