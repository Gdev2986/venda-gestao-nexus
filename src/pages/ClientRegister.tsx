import { PageHeader } from '@/components/page/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import ClientForm from '@/components/clients/ClientForm';

const ClientRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegisterSuccess = () => {
    toast({
      title: "Cliente registrado",
      description: "O cliente foi registrado com sucesso.",
    });
    navigate(PATHS.ADMIN.CLIENTS);
  };

  return (
    <div className="container py-6 space-y-6">
      <PageHeader
        title="Novo Cliente"
        description="Registre um novo cliente no sistema"
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Informações do Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientForm onSuccess={handleRegisterSuccess} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientRegister;
