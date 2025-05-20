
import * as React from "react";
import { X, Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export type Client = {
  id: string;
  business_name: string;
};

interface ClientSelectProps {
  clients: Client[];
  selectedClientIds: string[];
  onSelectedChange: (selectedIds: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
}

export function ClientSelect({
  clients,
  selectedClientIds,
  onSelectedChange,
  placeholder = "Selecionar clientes...",
  emptyMessage = "Nenhum cliente encontrado.",
  className,
  disabled = false,
}: ClientSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const selectedClients = clients.filter(client => 
    selectedClientIds.includes(client.id)
  );

  const filteredClients = clients.filter(client => 
    client.business_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (clientId: string) => {
    if (selectedClientIds.includes(clientId)) {
      onSelectedChange(selectedClientIds.filter(id => id !== clientId));
    } else {
      onSelectedChange([...selectedClientIds, clientId]);
    }
  };

  const handleRemove = (clientId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelectedChange(selectedClientIds.filter(id => id !== clientId));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !searchQuery && selectedClientIds.length > 0) {
      onSelectedChange(selectedClientIds.slice(0, -1));
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            selectedClientIds.length > 0 ? "h-auto min-h-10 py-2" : "h-10",
            className
          )}
          disabled={disabled}
          onClick={() => setOpen(!open)}
        >
          <div className="flex flex-wrap gap-1">
            {selectedClients.length > 0 ? (
              selectedClients.map(client => (
                <Badge 
                  key={client.id} 
                  variant="secondary"
                  className="mr-1 mb-1 flex items-center gap-1"
                >
                  {client.business_name}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={(e) => handleRemove(client.id, e)}
                  />
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="h-4 w-4 shrink-0 opacity-50 mr-2" />
            <CommandInput 
              placeholder="Buscar cliente..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
              onKeyDown={handleKeyDown}
              className="flex-1 py-2 outline-none border-0 focus:ring-0"
            />
          </div>
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {filteredClients.map(client => (
              <CommandItem
                key={client.id}
                value={client.id}
                onSelect={() => {
                  handleSelect(client.id);
                  setSearchQuery("");
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedClientIds.includes(client.id) ? "opacity-100" : "opacity-0"
                  )}
                />
                <span>{client.business_name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
