
import { useState, useEffect } from "react";
import { UserRole } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Helper para limpar todos os dados de autenticação do storage
const clearAllAuthData = () => {
  try {
    // Limpar sessionStorage
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("redirectPath");
    
    // Limpar localStorage
    localStorage.removeItem("userRole");
    
    // Limpar todos os itens relacionados ao Supabase
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error("Erro ao limpar dados de autenticação:", error);
  }
};

// Helper para armazenar e recuperar dados de autenticação com segurança
const getAuthData = (key: string) => {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting ${key} from storage:`, error);
    return null;
  }
};

const setAuthData = (key: string, value: any) => {
  try {
    // Use sessionStorage for auth data for better security
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting ${key} in storage:`, error);
  }
};

// Function to normalize role values 
const normalizeUserRole = (role: any): UserRole => {
  if (!role) return UserRole.CLIENT; // Default fallback
  
  // If it's already a valid UserRole enum value, return it
  if (Object.values(UserRole).includes(role as UserRole)) {
    return role as UserRole;
  }
  
  // Convert to uppercase string for comparison
  const upperRole = role.toString().toUpperCase();
  
  // Map to correct UserRole enum value
  switch (upperRole) {
    case "ADMIN": return UserRole.ADMIN;
    case "CLIENT": return UserRole.CLIENT;
    case "PARTNER": return UserRole.PARTNER;
    case "FINANCIAL": return UserRole.FINANCIAL;
    case "LOGISTICS": return UserRole.LOGISTICS;
    case "MANAGER": return UserRole.MANAGER;
    case "FINANCE": return UserRole.FINANCE;
    case "SUPPORT": return UserRole.SUPPORT;
    case "USER": return UserRole.USER;
    default: 
      console.warn(`Unknown role value: ${role}, defaulting to CLIENT`);
      return UserRole.CLIENT;
  }
};

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.CLIENT); // Default to CLIENT
  const [isRoleLoading, setIsRoleLoading] = useState<boolean>(true);
  const { user, signOut } = useAuth();
  
  useEffect(() => {
    const fetchUserRole = async () => {
      // Reset role loading state when user changes
      setIsRoleLoading(true);
      
      // If there's no user, don't fetch profile
      if (!user) {
        console.log("useUserRole - No user, defaulting to CLIENT");
        setUserRole(UserRole.CLIENT); // Default to client when not logged in
        setIsRoleLoading(false);
        return;
      }

      try {
        // First check sessionStorage for cached role
        const cachedRole = getAuthData("userRole");
        
        if (cachedRole && Object.values(UserRole).includes(cachedRole as UserRole)) {
          console.log("useUserRole - Using cached role:", cachedRole);
          setUserRole(normalizeUserRole(cachedRole));
          setIsRoleLoading(false);
        } else {
          console.log("useUserRole - No valid cached role found, fetching from database");
        }
        
        // Always verify with database to ensure role is current
        console.log("useUserRole - Fetching user role from database for user ID:", user.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          
          // Se for um erro de autenticação ou não encontrado, fazer logout
          if (error.code === 'PGRST116' || error.code === '404') {
            console.log("Token expirado ou usuário não encontrado, fazendo logout");
            clearAllAuthData();
            await signOut();
            return;
          }
          
          // If there's an error but we have a cached role, keep using it
          if (!cachedRole) {
            console.log("useUserRole - Error fetching role and no cache, using default CLIENT");
            setUserRole(UserRole.CLIENT);
          }
        } else if (data && data.role) {
          // Normalize the role to ensure it matches our enum
          const normalizedRole = normalizeUserRole(data.role);
          console.log("useUserRole - Database role:", data.role, "Normalized role:", normalizedRole);
          setUserRole(normalizedRole);
          
          // Store in sessionStorage for persistence
          setAuthData("userRole", normalizedRole);
        } else {
          console.log("useUserRole - No role found in database, using default or cached role");
          if (!cachedRole) {
            setUserRole(UserRole.CLIENT);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Em caso de erro, tentar fazer logout para limpar o estado
        clearAllAuthData();
      } finally {
        setIsRoleLoading(false);
      }
    };

    // Fetch profile when user changes
    fetchUserRole();
  }, [user, signOut]);

  const updateUserRole = (role: UserRole) => {
    const normalizedRole = normalizeUserRole(role);
    console.log("useUserRole - Updating role to:", normalizedRole);
    setUserRole(normalizedRole);
    setAuthData("userRole", normalizedRole);
  };

  return { userRole, isRoleLoading, updateUserRole };
};
