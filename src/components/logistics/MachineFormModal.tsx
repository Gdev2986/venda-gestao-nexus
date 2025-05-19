
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useClients } from "@/hooks/use-clients";
import { saveMachine } from "@/hooks/use-machines";
import { Form } from "@/components/ui/form";

// Import refactored components
import { machineFormSchema, MachineFormValues } from "./machine-form/MachineFormSchema";
import { MachineSerialField } from "./machine-form/MachineSerialField";
import { MachineModelField } from "./machine-form/MachineModelField";
import { MachineStatusField } from "./machine-form/MachineStatusField";
import { MachineClientField } from "./machine-form/MachineClientField";
import { MachineFormActions } from "./machine-form/MachineFormActions";

interface MachineFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  machine?: any; // For editing existing machine
  onSave: (machine: any) => void;
}

const MachineFormModal = ({ open, onOpenChange, machine, onSave }: MachineFormModalProps) => {
  const { toast } = useToast();
  const { clients } = useClients();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // Initialize form with default values
  const form = useForm<MachineFormValues>({
    resolver: zodResolver(machineFormSchema),
    defaultValues: {
      serialNumber: machine?.serialNumber || "",
      model: machine?.model || "",
      status: machine?.status || "ACTIVE",
      clientId: machine?.clientId || undefined,
    },
  });
  
  // Reset form when modal opens with new data
  React.useEffect(() => {
    if (open) {
      form.reset({
        serialNumber: machine?.serialNumber || "",
        model: machine?.model || "",
        status: machine?.status || "ACTIVE",
        clientId: machine?.clientId || undefined,
      });
    }
  }, [open, machine, form]);
  
  const onSubmit = async (data: MachineFormValues) => {
    setIsSubmitting(true);
    try {
      const savedMachine = await saveMachine(data);
      
      toast({
        title: "Máquina salva com sucesso",
        description: "A máquina foi adicionada ao sistema.",
      });
      
      onSave(savedMachine);
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar a máquina. Tente novamente.",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle cancel button click
  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      // Ensure clean state when closing the modal
      if (!isOpen) {
        // Small delay to allow animation to complete
        setTimeout(() => {
          form.reset();
        }, 100);
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {machine ? "Editar Máquina" : "Cadastrar Nova Máquina"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da máquina abaixo. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <MachineSerialField />
            <MachineModelField />
            <MachineStatusField />
            <MachineClientField clients={clients} />
            <MachineFormActions onCancel={handleCancel} isSubmitting={isSubmitting} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MachineFormModal;
