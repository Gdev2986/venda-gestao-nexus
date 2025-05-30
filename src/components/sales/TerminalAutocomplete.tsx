
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { optimizedSalesService, UniqueTerminal } from "@/services/optimized-sales.service";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TerminalAutocompleteProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const TerminalAutocomplete = ({ 
  value = "", 
  onChange, 
  disabled = false,
  placeholder = "Digite o terminal..."
}: TerminalAutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [terminals, setTerminals] = useState<UniqueTerminal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Buscar terminais quando o termo de busca muda
  useEffect(() => {
    const fetchTerminals = async () => {
      if (searchTerm.length >= 2 || searchTerm === "") {
        setIsLoading(true);
        try {
          const result = await optimizedSalesService.getUniqueTerminals(searchTerm);
          setTerminals(result);
        } catch (error) {
          console.error('Error fetching terminals:', error);
          setTerminals([]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    const debounceTimeout = setTimeout(fetchTerminals, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  // Carregar terminais iniciais
  useEffect(() => {
    const loadInitialTerminals = async () => {
      setIsLoading(true);
      try {
        const result = await optimizedSalesService.getUniqueTerminals();
        setTerminals(result);
      } catch (error) {
        console.error('Error loading initial terminals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialTerminals();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between text-left font-normal",
            !value && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          {value || placeholder}
          <div className="flex items-center ml-2">
            {value && (
              <X 
                className="h-4 w-4 opacity-50 hover:opacity-100 mr-1" 
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                }}
              />
            )}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder="Buscar terminal..." 
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandEmpty>
            {isLoading ? "Carregando..." : "Nenhum terminal encontrado"}
          </CommandEmpty>
          <CommandGroup className="max-h-64 overflow-y-auto">
            {terminals.map((item) => (
              <CommandItem
                key={item.terminal}
                value={item.terminal}
                onSelect={() => {
                  onChange(item.terminal === value ? "" : item.terminal);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === item.terminal ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="flex-1 truncate">{item.terminal}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  ({item.usage_count} vendas)
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TerminalAutocomplete;
