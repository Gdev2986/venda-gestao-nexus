
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface PartnerFilter {
  companyName: string;
  commissionRange: [number, number];
}

interface PartnerFilterProps {
  onFilter: (filter: PartnerFilter) => void;
}

const PartnerFilter = ({ onFilter }: PartnerFilterProps) => {
  const [companyName, setCompanyName] = useState<string>("");
  const [commissionRange, setCommissionRange] = useState<[number, number]>([0, 100]);
  
  const handleCommissionChange = (value: number[]) => {
    // Ensure we have exactly two values and they are numbers
    if (Array.isArray(value) && value.length >= 2) {
      setCommissionRange([value[0], value[1]]);
    }
  };
  
  const handleFilter = () => {
    onFilter({
      companyName,
      commissionRange
    });
  };
  
  const handleReset = () => {
    setCompanyName("");
    setCommissionRange([0, 100]);
    onFilter({
      companyName: "",
      commissionRange: [0, 100]
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Partners</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="company-name">Company Name</Label>
          <Input
            id="company-name"
            placeholder="Search by company name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
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
      </CardContent>
    </Card>
  );
};

export default PartnerFilter;
