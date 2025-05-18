import * as React from "react";
import { X, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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

export interface OptionType {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: OptionType[];
  selected: OptionType[];
  onChange: (selected: OptionType[]) => void;
  placeholder?: string;
  className?: string;
  emptyMessage?: string;
  isLoading?: boolean;
}

interface MultiSelectControlledProps {
  options: OptionType[];
  value: OptionType[];
  onChange: (selected: OptionType[]) => void;
  placeholder?: string;
  className?: string;
  emptyMessage?: string;
  isLoading?: boolean;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Selecione itens...",
  className,
  emptyMessage = "Nenhum item encontrado.",
  isLoading = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (item: OptionType) => {
    onChange(selected.filter((i) => i.value !== item.value));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          onClick={() => setOpen(!open)}
        >
          <div className="flex gap-1 flex-wrap">
            {selected.length === 0 && placeholder}
            {selected.map((item) => (
              <Badge
                variant="secondary"
                key={item.value}
                className="mr-1 mb-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnselect(item);
                }}
              >
                {item.label}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            ))}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="w-full">
          <CommandInput placeholder="Pesquisar..." />
          <CommandEmpty>
            {isLoading ? "Carregando..." : emptyMessage}
          </CommandEmpty>
          <CommandGroup className="max-h-60 overflow-y-auto">
            {options.map((option) => {
              const isSelected = selected.some((item) => item.value === option.value);
              return (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    if (isSelected) {
                      onChange(selected.filter((item) => item.value !== option.value));
                    } else {
                      onChange([...selected, option]);
                    }
                  }}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <Check className="h-3 w-3" />
                  </div>
                  <span>{option.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// This is the version that gets exported and used in the component
export const MultiSelect = ({
  options,
  value,
  onChange,
  placeholder = "Selecione itens...",
  className,
  emptyMessage = "Nenhum item encontrado.",
  isLoading = false,
}: MultiSelectControlledProps) => {
  return (
    <MultiSelectInternal
      options={options}
      selected={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      emptyMessage={emptyMessage}
      isLoading={isLoading}
    />
  );
};

// This is the internal component that keeps track of its own state
export const MultiSelectInternal = ({
  options,
  selected,
  onChange,
  placeholder = "Selecione itens...",
  className,
  emptyMessage = "Nenhum item encontrado.",
  isLoading = false,
}: MultiSelectProps) => {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (item: OptionType) => {
    onChange(selected.filter((i) => i.value !== item.value));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          onClick={() => setOpen(!open)}
        >
          <div className="flex gap-1 flex-wrap">
            {selected.length === 0 && placeholder}
            {selected.map((item) => (
              <Badge
                variant="secondary"
                key={item.value}
                className="mr-1 mb-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnselect(item);
                }}
              >
                {item.label}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            ))}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="w-full">
          <CommandInput placeholder="Pesquisar..." />
          <CommandEmpty>
            {isLoading ? "Carregando..." : emptyMessage}
          </CommandEmpty>
          <CommandGroup className="max-h-60 overflow-y-auto">
            {options.map((option) => {
              const isSelected = selected.some((item) => item.value === option.value);
              return (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    if (isSelected) {
                      onChange(selected.filter((item) => item.value !== option.value));
                    } else {
                      onChange([...selected, option]);
                    }
                  }}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <Check className="h-3 w-3" />
                  </div>
                  <span>{option.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
