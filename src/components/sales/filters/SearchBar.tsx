
import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: FormEvent) => void;
}

const SearchBar = ({ searchTerm, onSearchChange, onSearchSubmit }: SearchBarProps) => {
  return (
    <form 
      className="flex-1" 
      onSubmit={onSearchSubmit}
    >
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por código, terminal ou cliente..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
        {searchTerm && (
          <button
            type="button"
            className="absolute right-3 top-2.5"
            onClick={() => onSearchChange("")}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
