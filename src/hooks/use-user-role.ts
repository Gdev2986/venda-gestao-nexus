
import { useState, useEffect } from "react";
import { UserRole } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.ADMIN);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchUserRole = async () => {
      // Se não houver usuário, não faz sentido buscar o perfil
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Erro ao buscar perfil do usuário:', error);
          return;
        }

        if (data && data.role) {
          setUserRole(data.role as UserRole);
          // Armazena também no localStorage para persistência entre sessões
          localStorage.setItem("userRole", data.role);
        }
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
      }
    };

    // Busca o perfil quando o usuário mudar
    fetchUserRole();
    
    // Fallback para o localStorage caso a busca falhe
    const storedRole = localStorage.getItem("userRole");
    if (storedRole && Object.values(UserRole).includes(storedRole as UserRole)) {
      setUserRole(storedRole as UserRole);
    }
  }, [user]);

  const updateUserRole = (role: UserRole) => {
    setUserRole(role);
    localStorage.setItem("userRole", role);
  };

  return { userRole, updateUserRole };
};
