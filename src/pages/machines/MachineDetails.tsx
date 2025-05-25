
import { useEffect, useState, ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { PATHS } from "@/routes/paths";
import { useDialog } from "@/hooks/use-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Machine, MachineStatus } from "@/types/machine.types";
import { useMachines } from "@/hooks/logistics/use-machines";
import CreateMachineDialog from "@/components/logistics/modals/CreateMachineDialog";
import { getMachineById } from "@/services/machine.service";

const MachineDetails = () => {
  const { machineId } = useParams();
  const navigate = useNavigate();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);
  const { refetch } = useMachines();
  const editDialog = useDialog();
  
  useEffect(() => {
    const fetchMachineDetails = async () => {
      if (!machineId) {
        navigate(PATHS.LOGISTICS.MACHINES);
        return;
      }
      
      setLoading(true);
      try {
        const foundMachine = await getMachineById(machineId);
        
        if (foundMachine) {
          setMachine(foundMachine);
        } else {
          // If machine not found, navigate back to machines list
          navigate(PATHS.LOGISTICS.MACHINES);
        }
      } catch (error) {
        console.error("Error fetching machine details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMachineDetails();
  }, [machineId, navigate]);
  
  const handleEditSuccess = async () => {
    // Refresh the machine data
    if (machineId) {
      const updatedMachine = await getMachineById(machineId);
      if (updatedMachine) {
        setMachine(updatedMachine);
      }
    }
    await refetch();
  };
  
  const getStatusBadge = (status: MachineStatus) => {
    switch (status) {
      case MachineStatus.ACTIVE:
        return <Badge className="bg-green-100 text-green-800">Operando</Badge>;
      case MachineStatus.STOCK:
        return <Badge className="bg-blue-100 text-blue-800">Em Estoque</Badge>;
      case MachineStatus.MAINTENANCE:
        return <Badge className="bg-yellow-100 text-yellow-800">Em Manutenção</Badge>;
      case MachineStatus.INACTIVE:
        return <Badge className="bg-gray-100 text-gray-800">Inativa</Badge>;
      case MachineStatus.BLOCKED:
        return <Badge className="bg-red-100 text-red-800">Bloqueada</Badge>;
      case MachineStatus.TRANSIT:
        return <Badge className="bg-purple-100 text-purple-800">Em Trânsito</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Define title and description with proper typing
  let pageTitle: ReactNode = loading ? <Skeleton className="h-8 w-48" /> : `Máquina: ${machine?.serial_number || "Detalhes"}`;
  let pageDescription: ReactNode = loading ? <Skeleton className="h-5 w-64" /> : `Informações detalhadas sobre a máquina e seu histórico`;
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={pageTitle}
        description={pageDescription}
        breadcrumbs={[
          { label: "Máquinas", href: PATHS.LOGISTICS.MACHINES },
          { label: loading ? "..." : (machine?.serial_number || "Detalhes"), href: "#" },
        ]}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(PATHS.LOGISTICS.MACHINES)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Button onClick={editDialog.open}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </div>
        }
      />

      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      ) : machine ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div>
                  Informações da Máquina
                </div>
                <div>
                  {machine.status && getStatusBadge(machine.status as MachineStatus)}
                </div>
              </CardTitle>
              <CardDescription>
                Detalhes de registro e configuração
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Número de Série</h3>
                  <p className="font-medium">{machine.serial_number}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Modelo</h3>
                  <p className="font-medium">{machine.model}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Cliente</h3>
                  <p className="font-medium">{machine.client?.business_name || "Não Vinculada"}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Data de Cadastro</h3>
                  <p className="font-medium">
                    {machine.created_at ? new Date(machine.created_at).toLocaleDateString('pt-BR') : "N/A"}
                  </p>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Observações</h3>
                  <p className="font-medium text-sm">
                    {machine.notes || "Nenhuma observação cadastrada."}
                  </p>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex items-start space-x-4">
                <div className="bg-muted rounded-md p-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Histórico de Atualizações</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Última atualização: {machine.updated_at ? new Date(machine.updated_at).toLocaleDateString('pt-BR') : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="transfers">
            <TabsList>
              <TabsTrigger value="transfers">Histórico de Transferências</TabsTrigger>
              <TabsTrigger value="maintenance">Histórico de Manutenção</TabsTrigger>
            </TabsList>
            <TabsContent value="transfers">
              <Card>
                <CardHeader>
                  <CardTitle>Transferências</CardTitle>
                  <CardDescription>
                    Histórico de transferências entre clientes e estoque
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Nenhum registro de transferência encontrado.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="maintenance">
              <Card>
                <CardHeader>
                  <CardTitle>Manutenção</CardTitle>
                  <CardDescription>
                    Registros de manutenção e assistência técnica
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Nenhum registro de manutenção encontrado.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <p>Máquina não encontrada.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate(PATHS.LOGISTICS.MACHINES)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para lista de máquinas
            </Button>
          </CardContent>
        </Card>
      )}
      
      {machine && (
        <CreateMachineDialog
          open={editDialog.isOpen}
          onOpenChange={editDialog.close}
          onSuccess={handleEditSuccess}
          machine={machine}
        />
      )}
    </div>
  );
};

export default MachineDetails;
