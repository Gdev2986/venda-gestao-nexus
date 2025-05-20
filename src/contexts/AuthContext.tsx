
// This file is for backward compatibility
// Re-export AuthContext and useAuth from the provider
import { AuthContext, useAuth, AuthProvider } from "@/providers/AuthProvider";

export { AuthContext, useAuth, AuthProvider };

// Re-export auth types
export * from "./auth-types";
