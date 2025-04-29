
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  model: z.string().min(2, {
    message: "O modelo deve ter pelo menos 2 caracteres.",
  }),
  serialNumber: z.string().min(2, {
    message: "O número de série deve ter pelo menos 2 caracteres.",
  }),
  status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"]),
  clientId: z.string().optional(),
});

type MachineFormValues = z.infer<typeof formSchema>;

export interface MachineFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MachineFormValues) => void;
  initialData?: {
    id?: string;
    model: string;
    serialNumber: string;
    status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
    clientId?: string;
  };
  title?: string;
  clients?: { id: string; business_name: string }[];
}

const MachineForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title = "Nova Máquina",
  clients = [],
}: MachineFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues: Partial<MachineFormValues> = {
    model: initialData?.model || "",
    serialNumber: initialData?.serialNumber || "",
    status: initialData?.status || "ACTIVE",
    clientId: initialData?.clientId || "",
  };

  const form = useForm<MachineFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = async (data: MachineFormValues) => {
    try {
      setIsLoading(true);
      onSubmit(data);
      toast({
        title: initialData ? "Máquina atualizada" : "Máquina cadastrada",
        description: initialData
          ? "A máquina foi atualizada com sucesso."
          : "A máquina foi cadastrada com sucesso.",
      });
      onClose();
    } catch (error) {
      console.error("Erro ao salvar máquina:", error);
      toast({
        title: "Erro",
        description:
          "Ocorreu um erro ao salvar a máquina. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Preencha os dados da máquina abaixo
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  <FormControl>
                    <Input placeholder="Modelo da máquina" {...field} />
                  </FormControl>
                  <FormMessage>{String(form.formState.errors.model?.message || "")}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Série</FormLabel>
                  <FormControl>
                    <Input placeholder="Número de série da máquina" {...field} />
                  </FormControl>
                  <FormMessage>{String(form.formState.errors.serialNumber?.message || "")}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Ativa</SelectItem>
                      <SelectItem value="INACTIVE">Inativa</SelectItem>
                      <SelectItem value="MAINTENANCE">Em Manutenção</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Status atual da máquina
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {clients.length > 0 && (
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.business_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Cliente associado à máquina
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MachineForm;
