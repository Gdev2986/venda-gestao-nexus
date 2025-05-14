
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { UserRole } from "@/types";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

interface UsersTabProps {
  openRoleModal: (user: ProfileData) => void;
}

export function UsersTab({ openRoleModal }: UsersTabProps) {
  const [users, setUsers] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from("profiles")
          .select("id, name, email, role, created_at")
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        
        setUsers(data || []);
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setError(err.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const getRoleClass = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "bg-red-100 text-red-800";
      case UserRole.FINANCIAL:
        return "bg-green-100 text-green-800";
      case UserRole.LOGISTICS:
        return "bg-blue-100 text-blue-800";
      case UserRole.PARTNER:
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Error: {error}</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="mt-2"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b transition-colors hover:bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium">Nome</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Email</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Função</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Data de Criação</th>
                <th className="h-12 px-4 text-right align-middle font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr 
                    key={user.id} 
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <td className="p-4 align-middle">{user.name || "N/A"}</td>
                    <td className="p-4 align-middle">{user.email}</td>
                    <td className="p-4 align-middle">
                      <span className={`px-2 py-1 rounded-full text-xs ${getRoleClass(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => openRoleModal(user)}
                      >
                        Alterar Função
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
