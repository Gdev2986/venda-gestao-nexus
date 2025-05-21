
import { Input } from "@/components/ui/input";
import React from "react";

interface SupportSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SupportSearch = ({ searchTerm, setSearchTerm }: SupportSearchProps) => {
  return (
    <div className="relative w-64">
      <Input
        type="search"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-8"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
};

export default SupportSearch;
