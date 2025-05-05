
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserManagement } from "@/components/user-management/useUserManagement";
import UserTable from "@/components/user-management/UserTable";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Simple components for loading and error states
const LoadingState = () => (
  <div className="flex justify-center items-center p-12">
    <Spinner />
    <span className="ml-2">Carregando usuários...</span>
  </div>
);

const ErrorState = ({ errorMessage, onRetry }: { errorMessage: string, onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center p-12">
    <AlertCircle className="h-12 w-12 text-destructive mb-4" />
    <h3 className="text-lg font-medium mb-2">Erro ao carregar dados</h3>
    <p className="text-muted-foreground mb-4">{errorMessage}</p>
    <Button onClick={onRetry}>Tentar novamente</Button>
  </div>
);

const AccessCheckingState = () => (
  <div className="flex justify-center items-center p-12">
    <Spinner />
    <span className="ml-2">Verificando permissões...</span>
  </div>
);

// Simple filter component
const UserFilters = ({ onFilterChange }: { onFilterChange: (filters: any) => void }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Filter controls would go here */}
    </div>
  );
};

const UserManagement = () => {
  const { 
    users, 
    loading, 
    error, 
    checkingAccess,
    retryFetch,
    currentPage,
    totalPages,
    totalUsers,
    handlePageChange,
    handleFilterChange,
    filters
  } = useUserManagement();

  if (checkingAccess) {
    return (
      <MainLayout>
        <AccessCheckingState />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os usuários do sistema
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Usuários</CardTitle>
            <CardDescription>
              Altere as funções dos usuários ou visualize seus detalhes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState errorMessage={error} onRetry={retryFetch} />
            ) : (
              <div className="space-y-4">
                <UserFilters onFilterChange={handleFilterChange} />
                <UserTable 
                  users={users} 
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
                {totalUsers > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Mostrando {users.length} de {totalUsers} usuários
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default UserManagement;
