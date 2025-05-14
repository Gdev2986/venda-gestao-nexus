
// Direct re-export from the context to avoid circular references
import { useAuth } from "@/contexts/AuthContext";

export { useAuth };
// Removida exportação default redundante que pode causar problemas de importação
