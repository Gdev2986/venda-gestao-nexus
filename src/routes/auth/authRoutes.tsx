
import { Route } from "react-router-dom";
import { PATHS } from "../paths";

// Import Auth Pages
import Login from "../../pages/auth/Login";
import Register from "../../pages/auth/Register";
import ForgotPassword from "../../pages/auth/ForgotPassword";
import ResetPassword from "../../pages/auth/ResetPassword";
import ChangePassword from "../../pages/auth/ChangePassword";

// Auth Routes (Not Protected)
export const authRoutes = [
  <Route key="login" path={PATHS.LOGIN} element={<Login />} />,
  <Route key="register" path={PATHS.REGISTER} element={<Register />} />,
  <Route key="forgot-password" path={PATHS.FORGOT_PASSWORD} element={<ForgotPassword />} />,
  <Route key="reset-password" path={PATHS.RESET_PASSWORD} element={<ResetPassword />} />,
  <Route key="change-password" path={PATHS.CHANGE_PASSWORD} element={<ChangePassword />} />,
];
