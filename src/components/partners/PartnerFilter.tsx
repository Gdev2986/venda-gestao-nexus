
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, SearchIcon, RefreshCwIcon, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterValues {
  search: string;
  dateRange?: {
    from: Date;
    to?: Date;
  };
}

interface PartnerFilterProps {
  onFilter: (values: FilterValues) => void;
  onAddPartner: () => void;
  onRefresh: () => void;
}

const PartnerFilter: React.FC<PartnerFilterProps> = ({ 
  onFilter, 
  onAddPartner,
  onRefresh
}) => {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<{
    from: Date;
    to?: Date;
  }>();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onFilter({
      search: e.target.value,
      dateRange: date
    });
  };

  const handleDateSelect = (selectedDate: {
    from: Date;
    to?: Date;
  } | undefined) => {
    setDate(selectedDate);
    onFilter({
      search,
      dateRange: selectedDate
    });
  };

  const handleClearFilters = () => {
    setSearch("");
    setDate(undefined);
    onFilter({
      search: "",
      dateRange: undefined
    });
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome da empresa..."
              value={search}
              onChange={handleSearchChange}
              className="pl-9"
            />
          </div>
          
          <div className="grid gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                        {format(date.to, "dd/MM/yyyy", { locale: ptBR })}
                      </>
                    ) : (
                      format(date.from, "dd/MM/yyyy", { locale: ptBR })
                    )
                  ) : (
                    <span>Data de cadastro</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={date}
                  onSelect={handleDateSelect}
                  numberOfMonths={2}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleClearFilters}
            >
              Limpar filtros
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={onRefresh}
            >
              <RefreshCwIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="default" 
              className="flex-1"
              onClick={onAddPartner}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Novo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PartnerFilter;
