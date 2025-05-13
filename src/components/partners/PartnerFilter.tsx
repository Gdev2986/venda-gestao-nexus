
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { FilterValues } from "@/types";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface PartnerFilterProps {
  onFilter: (values: FilterValues) => void;
  onResetFilter: () => void;
}

export function PartnerFilter({ onFilter, onResetFilter }: PartnerFilterProps) {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date }>();
  const [commissionRange, setCommissionRange] = useState<[number, number]>([0, 100]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleFilter = () => {
    const filterValues: FilterValues = {
      search,
      dateRange,
      commissionRange
    };
    onFilter(filterValues);
  };

  const handleReset = () => {
    setSearch("");
    setDateRange(undefined);
    setCommissionRange([0, 100]);
    onResetFilter();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search partners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className={showAdvancedFilters ? "bg-accent" : ""}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
        <Button onClick={handleFilter}>Apply</Button>
        <Button variant="outline" onClick={handleReset}>Reset</Button>
      </div>

      {showAdvancedFilters && (
        <div className="bg-card p-4 rounded-md border space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Advanced Filters</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAdvancedFilters(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Date Range</Label>
              <DatePickerWithRange
                date={dateRange}
                setDate={setDateRange}
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="commission-range">Commission Range (%)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="min-commission"
                  type="number"
                  min={0}
                  max={100}
                  value={commissionRange[0]}
                  onChange={(e) => setCommissionRange([Number(e.target.value), commissionRange[1]])}
                  className="w-20"
                />
                <span>to</span>
                <Input
                  id="max-commission"
                  type="number"
                  min={0}
                  max={100}
                  value={commissionRange[1]}
                  onChange={(e) => setCommissionRange([commissionRange[0], Number(e.target.value)])}
                  className="w-20"
                />
                <span>%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
