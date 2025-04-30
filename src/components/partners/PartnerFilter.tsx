
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { FilterValues } from "@/types";

interface PartnerFilterProps {
  onFilter: (filter: FilterValues) => void;
}

const PartnerFilter = ({ onFilter }: PartnerFilterProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [commissionRange, setCommissionRange] = useState<[number, number]>([0, 100]);
  
  const handleCommissionChange = (value: number[]) => {
    // Ensure we have exactly two values and they are numbers
    if (Array.isArray(value) && value.length >= 2) {
      setCommissionRange([value[0], value[1]]);
    }
  };
  
  const handleFilter = () => {
    onFilter({
      search: searchTerm,
      searchTerm: searchTerm,
      commissionRange
    });
  };
  
  const handleReset = () => {
    setSearchTerm("");
    setCommissionRange([0, 100]);
    onFilter({
      search: "",
      searchTerm: "",
      commissionRange: [0, 100]
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="company-name">Company Name</Label>
        <Input
          id="company-name"
          placeholder="Search by company name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Commission Range (%)</Label>
        <div className="pt-4 px-2">
          <Slider 
            min={0} 
            max={100} 
            step={1} 
            value={[commissionRange[0], commissionRange[1]]} 
            onValueChange={handleCommissionChange}
            className="mb-6" 
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{commissionRange[0]}%</span>
            <span>{commissionRange[1]}%</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <Button onClick={handleFilter} variant="default">Apply Filters</Button>
        <Button onClick={handleReset} variant="outline">Reset</Button>
      </div>
    </div>
  );
};

export default PartnerFilter;
