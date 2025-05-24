import { Route } from "react-router-dom";
import { PATHS } from "./paths";

// Layouts
import AuthLayout from "../layouts/AuthLayout";

// Auth pages
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import ChangePassword from "../pages/auth/ChangePassword";

export const AuthRoutes = (
  <Route element={<AuthLayout />}>
    <Route path={PATHS.LOGIN} element={<Login />} />
    <Route path={PATHS.FORGOT_PASSWORD} element={<ForgotPassword />} />
    <Route path={PATHS.RESET_PASSWORD} element={<ResetPassword />} />
    <Route path={PATHS.CHANGE_PASSWORD} element={<ChangePassword />} />
  </Route>
);
