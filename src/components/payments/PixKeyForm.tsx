
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, X } from "lucide-react";
import { phoneMask, cpfMask, cnpjMask } from "@/lib/masks";

interface PixKeyFormProps {
  onSubmit: (data: {
    key: string;
    type: string;
    name: string;
  }) => Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
  className?: string;
}

export function PixKeyForm({
  onSubmit,
  isSubmitting = false,
  onCancel,
  className = "",
}: PixKeyFormProps) {
  const [keyType, setKeyType] = useState<string>("CPF");
  const [keyValue, setKeyValue] = useState<string>("");
  const [keyName, setKeyName] = useState<string>("");
  const [formErrors, setFormErrors] = useState<{
    type?: string;
    key?: string;
    name?: string;
  }>({});

  // This effect ensures the keyValue is masked correctly when the keyType changes
  useEffect(() => {
    if (keyValue) {
      // Clear the value when changing types to avoid validation confusion
      setKeyValue("");
    }
  }, [keyType]);

  const handleKeyValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Apply appropriate mask based on keyType
    let maskedValue = value;
    if (keyType === "CPF") {
      maskedValue = cpfMask(value);
    } else if (keyType === "CNPJ") {
      maskedValue = cnpjMask(value);
    } else if (keyType === "PHONE") {
      maskedValue = phoneMask(value);
    }
    
    setKeyValue(maskedValue);
    
    // Clear error when user types
    if (formErrors.key) {
      setFormErrors(prev => ({ ...prev, key: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: {
      type?: string;
      key?: string;
      name?: string;
    } = {};

    if (!keyType) {
      errors.type = "O tipo de chave é obrigatório";
    }

    if (!keyValue) {
      errors.key = "A chave é obrigatória";
    } else {
      // Validate CPF format: xxx.xxx.xxx-xx
      if (keyType === "CPF" && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(keyValue)) {
        errors.key = "CPF inválido. Use o formato: xxx.xxx.xxx-xx";
      }
      
      // Validate CNPJ format: xx.xxx.xxx/xxxx-xx
      else if (keyType === "CNPJ" && !/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(keyValue)) {
        errors.key = "CNPJ inválido. Use o formato: xx.xxx.xxx/xxxx-xx";
      }
      
      // Validate Email format
      else if (keyType === "EMAIL" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(keyValue)) {
        errors.key = "Email inválido";
      }
      
      // Validate Phone format: (xx) 9xxxx-xxxx
      else if (keyType === "PHONE" && !/^\(\d{2}\) \d{5}-\d{4}$/.test(keyValue)) {
        errors.key = "Telefone inválido. Use o formato: (xx) 9xxxx-xxxx";
      }
    }

    if (!keyName) {
      errors.name = "O nome da chave é obrigatório";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Remove masks from the key value before submitting
        let cleanKeyValue = keyValue;
        if (keyType === "CPF") {
          cleanKeyValue = keyValue.replace(/\D/g, "");
        } else if (keyType === "CNPJ") {
          cleanKeyValue = keyValue.replace(/\D/g, "");
        } else if (keyType === "PHONE") {
          cleanKeyValue = keyValue.replace(/\D/g, "");
        }
        
        await onSubmit({
          type: keyType,
          key: cleanKeyValue,
          name: keyName,
        });
        
        // Reset form on success
        setKeyType("CPF");
        setKeyValue("");
        setKeyName("");
      } catch (error) {
        console.error("Error adding PIX key:", error);
        toast({
          title: "Erro ao adicionar chave PIX",
          description: "Não foi possível adicionar a chave PIX. Por favor, tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`space-y-4 ${className}`}
    >
      <div className="space-y-2">
        <Label htmlFor="key-type">Tipo de Chave</Label>
        <Select
          value={keyType}
          onValueChange={setKeyType}
        >
          <SelectTrigger id="key-type">
            <SelectValue placeholder="Selecione o tipo de chave" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CPF">CPF</SelectItem>
            <SelectItem value="CNPJ">CNPJ</SelectItem>
            <SelectItem value="EMAIL">Email</SelectItem>
            <SelectItem value="PHONE">Telefone</SelectItem>
            <SelectItem value="RANDOM">Chave Aleatória</SelectItem>
          </SelectContent>
        </Select>
        {formErrors.type && (
          <p className="text-sm text-destructive">{formErrors.type}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="key-value">Chave PIX</Label>
        <Input
          id="key-value"
          placeholder={
            keyType === "CPF" ? "123.456.789-10" :
            keyType === "CNPJ" ? "12.345.678/0001-90" :
            keyType === "EMAIL" ? "email@exemplo.com" :
            keyType === "PHONE" ? "(11) 98765-4321" :
            "Chave aleatória"
          }
          value={keyValue}
          onChange={handleKeyValueChange}
          maxLength={
            keyType === "CPF" ? 14 :
            keyType === "CNPJ" ? 18 :
            keyType === "PHONE" ? 15 :
            undefined
          }
        />
        {formErrors.key && (
          <p className="text-sm text-destructive">{formErrors.key}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="key-name">Nome (identificação)</Label>
        <Input
          id="key-name"
          placeholder="Ex: PIX Banco XYZ"
          value={keyName}
          onChange={(e) => {
            setKeyName(e.target.value);
            if (formErrors.name) {
              setFormErrors(prev => ({ ...prev, name: undefined }));
            }
          }}
        />
        {formErrors.name && (
          <p className="text-sm text-destructive">{formErrors.name}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
        )}
        <Button 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adicionando...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Chave
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
