
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
import SupportHeader from "@/components/support/SupportHeader";
import SupportCard from "@/components/support/SupportCard";
import RequestsList from "@/components/support/RequestsList";
import NewRequestDialog from "@/components/support/NewRequestDialog";
import RequestDetailsDialog from "@/components/support/RequestDetailsDialog";

// Define types
interface SupportRequest {
  id: string;
  subject: string;
  message: string;
  type: "MACHINE" | "SUPPLIES" | "PAYMENT" | "OTHER";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  created_at: string;
  response?: string;
}

const Support = () => {
  const location = useLocation();
  const isNewMachineRequest = location.state?.requestType === "MACHINE";
  
  const [requests, setRequests] = useState<SupportRequest[]>([
    {
      id: "1",
      subject: "Máquina com erro na impressão",
      message: "Minha máquina está imprimindo com falhas nas bordas dos recibos.",
      type: "MACHINE",
      status: "IN_PROGRESS",
      created_at: "2023-06-15T10:30:00Z",
      response: "Estamos enviando um técnico para verificar o problema. Previsão de atendimento: 16/06/2023."
    },
    {
      id: "2",
      subject: "Solicitação de bobinas",
      message: "Preciso de 10 bobinas para a máquina modelo TX-500.",
      type: "SUPPLIES",
      status: "OPEN",
      created_at: "2023-06-18T14:20:00Z"
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);
  
  const { toast } = useToast();
  
  // Show the dialog automatically if coming from the "Request New Machine" button
  useState(() => {
    if (isNewMachineRequest) {
      setShowNewRequestDialog(true);
    }
  });
  
  const handleCreateRequest = (subject: string, message: string, requestType: "MACHINE" | "SUPPLIES" | "PAYMENT" | "OTHER") => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newRequest: SupportRequest = {
        id: `req-${Date.now()}`,
        subject,
        message,
        type: requestType,
        status: "OPEN",
        created_at: new Date().toISOString()
      };
      
      setRequests([newRequest, ...requests]);
      setShowNewRequestDialog(false);
      setIsLoading(false);
      
      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de suporte foi enviada com sucesso.",
      });
    }, 1000);
  };
  
  const handleViewDetails = (request: SupportRequest) => {
    setSelectedRequest(request);
    setShowDetailsDialog(true);
  };
  
  return (
    <div className="space-y-6">
      <SupportHeader onNewRequest={() => setShowNewRequestDialog(true)} />
      
      <SupportCard
        title="Minhas Solicitações"
        description="Verifique o status de suas solicitações de suporte"
      >
        <RequestsList
          requests={requests}
          onViewDetails={handleViewDetails}
        />
      </SupportCard>
      
      {/* New Request Dialog */}
      <NewRequestDialog
        open={showNewRequestDialog}
        onOpenChange={setShowNewRequestDialog}
        onSubmit={handleCreateRequest}
        isLoading={isLoading}
        initialSubject={isNewMachineRequest ? "Solicitação de nova máquina" : ""}
        initialType={isNewMachineRequest ? "MACHINE" : "MACHINE"}
      />
      
      {/* Request Details Dialog */}
      <RequestDetailsDialog
        request={selectedRequest}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
      />
    </div>
  );
};

export default Support;
