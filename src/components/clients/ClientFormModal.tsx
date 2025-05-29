
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { ClientFormSchema, ClientFormValues } from "./form/ClientFormSchema";
import { ClientFormCompanyInfo } from "./form/ClientFormCompanyInfo";
import { ClientFormContactInfo } from "./form/ClientFormContactInfo";
import { ClientFormAddressInfo } from "./form/ClientFormAddressInfo";
import { ClientFormActions } from "./form/ClientFormActions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Copy, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useClients, ClientUserCreationResult } from "@/hooks/use-clients";

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialData?: Client;
  onSubmit?: (data: any) => Promise<boolean>;
}

const ClientFormModal = ({
  isOpen,
  onClose,
  title,
  initialData,
  onSubmit,
}: ClientFormModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userCreationResult, setUserCreationResult] = useState<ClientUserCreationResult | null>(null);
  const [passwordCopied, setPasswordCopied] = useState(false);
  const { toast } = useToast();
  const { addClient } = useClients();
  
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(ClientFormSchema),
    defaultValues: {
      // Company information
      company_name: initialData?.company_name || "",
      cnpj: initialData?.cnpj || "",
      partner_id: initialData?.partner_id || "",
      initial_balance: initialData?.initial_balance || 0,
      
      // Contact information
      contact_name: initialData?.contact_name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      
      // Address information
      address: initialData?.address || "",
      address_number: initialData?.address_number || "",
      neighborhood: initialData?.neighborhood || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      zip_code: initialData?.zip_code || "",
    }
  });
  
  const handleSubmitForm = async (formData: ClientFormValues) => {
    setIsLoading(true);
    try {
      if (onSubmit) {
        const success = await onSubmit(formData);
        if (success) {
          onClose();
        }
      } else {
        // Use the enhanced addClient function
        const clientData = {
          business_name: formData.company_name,
          contact_name: formData.contact_name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip_code,
          document: formData.cnpj,
          partner_id: formData.partner_id === "none" ? undefined : formData.partner_id,
          balance: formData.initial_balance || 0,
        };
        
        const result = await addClient(clientData);
        
        if (result.client && result.userResult?.success) {
          setUserCreationResult(result.userResult);
        } else {
          throw new Error(result.userResult?.error || 'Failed to create client');
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Erro ao processar dados: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyPasswordToClipboard = async () => {
    if (userCreationResult?.temp_password) {
      try {
        await navigator.clipboard.writeText(userCreationResult.temp_password);
        setPasswordCopied(true);
        toast({
          title: "Copiado!",
          description: "Senha temporária copiada para a área de transferência.",
        });
        setTimeout(() => setPasswordCopied(false), 2000);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível copiar a senha.",
        });
      }
    }
  };

  const copyCredentialsToClipboard = async () => {
    if (userCreationResult) {
      const credentials = `Email: ${userCreationResult.email}\nSenha temporária: ${userCreationResult.temp_password}`;
      try {
        await navigator.clipboard.writeText(credentials);
        toast({
          title: "Copiado!",
          description: "Credenciais copiadas para a área de transferência.",
        });
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível copiar as credenciais.",
        });
      }
    }
  };
  
  const closeModalAndReset = () => {
    setUserCreationResult(null);
    setPasswordCopied(false);
    form.reset();
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={userCreationResult ? undefined : onClose}>
      <DialogContent className="max-w-[95%] sm:max-w-[80%] md:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        {userCreationResult?.success ? (
          <div className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertTitle>Cliente e usuário criados com sucesso!</AlertTitle>
              <AlertDescription>
                Um usuário foi criado com acesso temporário de 24 horas. O cliente precisará
                alterar a senha no primeiro acesso.
              </AlertDescription>
            </Alert>
            
            <Card className="p-4 border border-yellow-200 bg-yellow-50">
              <div className="space-y-3">
                <div className="font-medium text-lg">Credenciais de acesso temporário:</div>
                
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Email:</span> 
                    <span className="ml-2 font-mono text-sm bg-white px-2 py-1 rounded border">
                      {userCreationResult.email}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium">Senha temporária:</span> 
                    <span className="ml-2 font-mono text-sm bg-white px-2 py-1 rounded border">
                      {userCreationResult.temp_password}
                    </span>
                  </div>
                  
                  <div className="text-sm text-amber-700">
                    <strong>Válido até:</strong> {new Date(userCreationResult.expires_at!).toLocaleString('pt-BR')}
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground bg-white p-3 rounded border">
                  <strong>Instruções para o cliente:</strong>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Acesse o sistema com o email e senha temporária</li>
                    <li>No primeiro login, será solicitada a alteração da senha</li>
                    <li>Escolha uma senha segura de sua preferência</li>
                    <li>O acesso temporário expira em 24 horas</li>
                  </ol>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    size="sm" 
                    onClick={copyPasswordToClipboard}
                    className="flex items-center gap-2"
                  >
                    {passwordCopied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {passwordCopied ? "Copiado!" : "Copiar senha"}
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={copyCredentialsToClipboard}
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copiar tudo
                  </Button>
                </div>
              </div>
            </Card>
            
            <div className="flex justify-end">
              <Button onClick={closeModalAndReset}>
                Fechar
              </Button>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-6">
              <ClientFormCompanyInfo form={form} />
              <ClientFormContactInfo form={form} />
              <ClientFormAddressInfo form={form} />
              <ClientFormActions onCancel={onClose} isLoading={isLoading} />
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClientFormModal;
