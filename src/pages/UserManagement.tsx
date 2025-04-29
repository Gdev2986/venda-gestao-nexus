
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserManagement } from "@/components/user-management/useUserManagement";
import UserTable from "@/components/user-management/UserTable";
import LoadingState from "@/components/user-management/LoadingState";
import ErrorState from "@/components/user-management/ErrorState";
import AccessCheckingState from "@/components/user-management/AccessCheckingState";

const UserManagement = () => {
  const { 
    users, 
    setUsers, 
    loading, 
    error, 
    checkingAccess,
    retryFetch,
    currentPage,
    totalPages,
    handlePageChange,
    handleFilterChange
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
              <UserTable 
                users={users} 
                setUsers={setUsers} 
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onFilterChange={handleFilterChange}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default UserManagement;
