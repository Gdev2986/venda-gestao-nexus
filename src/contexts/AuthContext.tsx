
import * as React from "react";
import { AuthContext, useAuth, AuthProvider } from "@/providers/AuthProvider";

// Re-export AuthContext and useAuth from the provider
export { AuthContext, useAuth, AuthProvider };

// Re-export auth types
export * from "./auth-types";
