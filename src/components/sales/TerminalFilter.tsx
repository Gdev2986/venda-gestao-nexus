
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { optimizedSalesService } from "@/services/optimized-sales.service";

interface TerminalFilterProps {
  selectedTerminals: string[];
  onTerminalsChange: (selectedTerminals: string[]) => void;
}

const TerminalFilter = ({
  selectedTerminals,
  onTerminalsChange
}: TerminalFilterProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [availableTerminals, setAvailableTerminals] = useState<Array<{terminal: string, usage_count: number}>>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar terminais disponíveis com debounce
  useEffect(() => {
    const loadTerminals = async () => {
      setIsLoading(true);
      try {
        const terminals = await optimizedSalesService.getUniqueTerminals(searchTerm);
        setAvailableTerminals(terminals);
      } catch (error) {
        console.error('Error loading terminals:', error);
        setAvailableTerminals([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(loadTerminals, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Handle individual terminal selection
  const handleTerminalChange = (terminal: string, isChecked: boolean) => {
    if (isChecked) {
      onTerminalsChange([...selectedTerminals, terminal]);
    } else {
      onTerminalsChange(selectedTerminals.filter(t => t !== terminal));
    }
  };

  // Handle select/clear all terminals
  const handleSelectAll = () => {
    const allTerminals = availableTerminals.map(t => t.terminal);
    onTerminalsChange(allTerminals);
  };

  const handleClearAll = () => {
    onTerminalsChange([]);
  };

  return (
    <Card className="w-full">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-medium">
          Terminais {selectedTerminals.length > 0 && `(${selectedTerminals.length} selecionados)`}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="space-y-3">
          <Input
            placeholder="Buscar terminais..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSelectAll}
              className="text-xs h-8"
              disabled={isLoading}
            >
              Selecionar todos
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearAll}
              className="text-xs h-8"
              disabled={selectedTerminals.length === 0}
            >
              Limpar seleção
            </Button>
          </div>
          
          {/* Mostrar terminais selecionados */}
          {selectedTerminals.length > 0 && (
            <div className="border rounded p-2 bg-muted/20">
              <Label className="text-xs font-medium text-muted-foreground">Selecionados:</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedTerminals.map((terminal) => (
                  <span 
                    key={terminal} 
                    className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                  >
                    {terminal}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <ScrollArea className="h-40 pr-4">
            <div className="space-y-2">
              {isLoading ? (
                <div className="text-sm text-muted-foreground text-center py-4">
                  Carregando terminais...
                </div>
              ) : availableTerminals.length > 0 ? (
                availableTerminals.map((terminalData) => (
                  <div key={terminalData.terminal} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`terminal-${terminalData.terminal}`} 
                      checked={selectedTerminals.includes(terminalData.terminal)}
                      onCheckedChange={(checked) => 
                        handleTerminalChange(terminalData.terminal, checked === true)
                      }
                    />
                    <Label 
                      htmlFor={`terminal-${terminalData.terminal}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {terminalData.terminal}
                      <span className="text-xs text-muted-foreground ml-2">
                        ({terminalData.usage_count.toLocaleString()} vendas)
                      </span>
                    </Label>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-4">
                  {searchTerm 
                    ? "Nenhum terminal encontrado para a busca"
                    : "Nenhum terminal disponível"}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default TerminalFilter;
