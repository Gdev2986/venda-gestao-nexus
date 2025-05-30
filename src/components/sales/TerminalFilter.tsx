
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { optimizedSalesService } from "@/services/optimized-sales.service";

interface TerminalFilterProps {
  terminals: string[];
  selectedTerminals: string[];
  onTerminalsChange: (selectedTerminals: string[]) => void;
}

const TerminalFilter = ({
  terminals,
  selectedTerminals,
  onTerminalsChange
}: TerminalFilterProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [availableTerminals, setAvailableTerminals] = useState<string[]>([]);
  const [filteredTerminals, setFilteredTerminals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load available terminals from API
  useEffect(() => {
    const loadTerminals = async () => {
      setIsLoading(true);
      try {
        const uniqueTerminals = await optimizedSalesService.getUniqueTerminals();
        const terminalNames = uniqueTerminals.map(t => t.terminal);
        setAvailableTerminals(terminalNames);
      } catch (error) {
        console.error('Error loading terminals:', error);
        setAvailableTerminals([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTerminals();
  }, []);
  
  // Update filtered terminals when search term or available terminals change
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTerminals(availableTerminals);
      return;
    }
    
    const normalizedSearch = searchTerm.toLowerCase();
    setFilteredTerminals(
      availableTerminals.filter(terminal => 
        terminal.toLowerCase().includes(normalizedSearch)
      )
    );
  }, [searchTerm, availableTerminals]);
  
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
    onTerminalsChange([...filteredTerminals]);
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
            disabled={isLoading}
          />
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSelectAll}
              className="text-xs h-8"
              disabled={isLoading || filteredTerminals.length === 0}
            >
              Selecionar todos
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearAll}
              className="text-xs h-8"
              disabled={isLoading || selectedTerminals.length === 0}
            >
              Limpar seleção
            </Button>
          </div>
          
          <ScrollArea className="h-40 pr-4">
            <div className="space-y-2">
              {isLoading ? (
                <div className="text-sm text-muted-foreground">Carregando terminais...</div>
              ) : filteredTerminals.length > 0 ? (
                filteredTerminals.map((terminal) => (
                  <div key={terminal} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`terminal-${terminal}`} 
                      checked={selectedTerminals.includes(terminal)}
                      onCheckedChange={(checked) => 
                        handleTerminalChange(terminal, checked === true)
                      }
                    />
                    <Label 
                      htmlFor={`terminal-${terminal}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {terminal}
                    </Label>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  {availableTerminals.length === 0 
                    ? "Nenhum terminal disponível" 
                    : "Nenhum terminal encontrado"}
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
