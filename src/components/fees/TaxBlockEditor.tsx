
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Save, Trash2, AlertCircle } from "lucide-react";
import { TaxBlocksService, BlockWithRates, TaxRate } from "@/services/tax-blocks.service";
import { useToast } from "@/hooks/use-toast";
import { PaymentMethod } from "@/types/enums";
import TaxRatesManager from "./TaxRatesManager";
import TaxBlockLinkedClients from "./TaxBlockLinkedClients";

interface TaxBlockEditorProps {
  block: BlockWithRates | null;
  onSave: (block: BlockWithRates) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
  isSubmitting: boolean;
}

const TaxBlockEditor = ({ block, onSave, onCancel, onDelete, isSubmitting }: TaxBlockEditorProps) => {
  const [name, setName] = useState(block?.name || "");
  const [description, setDescription] = useState(block?.description || "");
  const [rates, setRates] = useState<TaxRate[]>(block?.rates || []);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    if (block) {
      setName(block.name);
      setDescription(block.description || "");
      setRates(block.rates || []);
    }
  }, [block]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os erros antes de continuar",
        variant: "destructive"
      });
      return;
    }

    const blockData: BlockWithRates = {
      id: block?.id || "",
      name: name.trim(),
      description: description.trim() || null,
      rates,
      created_at: block?.created_at,
      updated_at: block?.updated_at
    };

    onSave(blockData);
  };

  const handleDelete = () => {
    if (block && onDelete) {
      if (confirm("Tem certeza que deseja excluir este bloco de taxas?")) {
        onDelete(block.id);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">
            {block ? "Editar Bloco de Taxas" : "Novo Bloco de Taxas"}
          </h2>
        </div>
        <div className="flex gap-2">
          {block && onDelete && (
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          )}
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Informações Gerais</TabsTrigger>
          <TabsTrigger value="rates">Taxas</TabsTrigger>
          <TabsTrigger value="clients">Clientes Vinculados</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Bloco</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Bloco Padrão"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.name}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição do bloco de taxas..."
                rows={3}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rates">
          <TaxRatesManager
            rates={rates}
            onRatesChange={setRates}
          />
        </TabsContent>

        <TabsContent value="clients">
          {block ? (
            <TaxBlockLinkedClients blockId={block.id} />
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Salve o bloco primeiro para ver os clientes vinculados.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxBlockEditor;
