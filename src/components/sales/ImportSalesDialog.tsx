
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ImportSalesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImportSalesDialog = ({ open, onOpenChange }: ImportSalesDialogProps) => {
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real application, you would parse the file and handle the upload
    toast({
      title: "Arquivo selecionado",
      description: `${file.name} será processado. Esta funcionalidade está em desenvolvimento.`,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importar Vendas</DialogTitle>
          <DialogDescription>
            Faça o upload de um arquivo CSV ou Excel contendo as informações das vendas.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="file">Arquivo</Label>
            <Input
              id="file"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
            />
          </div>
          <div className="text-sm text-muted-foreground">
            O arquivo deve conter as colunas: Data, Terminal, Valor Bruto, Valor Líquido, Forma de Pagamento.
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" onClick={() => {
            toast({
              title: "Importação iniciada",
              description: "O processo de importação foi iniciado. Você será notificado quando for concluído.",
            });
            onOpenChange(false);
          }}>
            Importar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportSalesDialog;
