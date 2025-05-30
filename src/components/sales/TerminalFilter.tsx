
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [filteredTerminals, setFilteredTerminals] = useState<string[]>(terminals);
  
  // Update filtered terminals when search term or terminals list changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTerminals(terminals);
      return;
    }
    
    const normalizedSearch = searchTerm.toLowerCase();
    setFilteredTerminals(
      terminals.filter(terminal => 
        terminal.toLowerCase().includes(normalizedSearch)
      )
    );
  }, [searchTerm, terminals]);
  
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
    onTerminalsChange([...terminals]);
  };
  
  const handleClearAll = () => {
    onTerminalsChange([]);
  };

  return (
    <Card className="w-full">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-medium">Terminais</CardTitle>
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
            >
              Selecionar todos
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearAll}
              className="text-xs h-8"
            >
              Limpar seleção
            </Button>
          </div>
          
          <ScrollArea className="h-40 pr-4">
            <div className="space-y-2">
              {filteredTerminals.map((terminal) => (
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
              ))}
              
              {filteredTerminals.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  Nenhum terminal encontrado
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
