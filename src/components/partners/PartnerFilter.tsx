
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Search, RefreshCw } from 'lucide-react';
import { FilterValues } from '@/types';

interface PartnerFilterProps {
  onFilter: (values: FilterValues) => void;
  loading?: boolean;
}

export default function PartnerFilter({ onFilter, loading = false }: PartnerFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [commissionRange, setCommissionRange] = useState<[number, number]>([0, 100]);
  const [initialCommissionRange] = useState<[number, number]>([0, 100]);

  useEffect(() => {
    // Apply initial filters on mount
    handleFilter();
  }, []);

  const handleFilter = () => {
    onFilter({
      searchTerm,
      commissionRange,
    });
  };

  const handleReset = () => {
    setSearchTerm('');
    setCommissionRange(initialCommissionRange);
    onFilter({
      searchTerm: '',
      commissionRange: initialCommissionRange,
    });
  };

  const handleCommissionChange = (value: number[]) => {
    // Ensure we only take exactly two values for the range
    const [min, max] = value;
    setCommissionRange([min, max]);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="search">Pesquisar</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="search"
                placeholder="Nome da empresa ou contato..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Comissão (%)</Label>
            <div className="px-2">
              <Slider
                defaultValue={commissionRange}
                min={0}
                max={100}
                step={1}
                value={[commissionRange[0], commissionRange[1]]}
                onValueChange={handleCommissionChange}
                className="my-4"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{commissionRange[0]}%</span>
                <span>{commissionRange[1]}%</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <Button onClick={handleFilter} disabled={loading}>
              Filtrar
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={loading}
              className="flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Redefinir
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
