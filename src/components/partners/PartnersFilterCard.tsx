
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PartnerFilter from './PartnerFilter';
import { FilterValues } from "@/types";

interface PartnersFilterCardProps {
  onFilter: (values: FilterValues) => void;
  isLoading?: boolean;
}

const PartnersFilterCard: React.FC<PartnersFilterCardProps> = ({ 
  onFilter,
  isLoading = false
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <PartnerFilter 
          onApplyFilter={onFilter}
          isLoading={isLoading} 
        />
      </CardContent>
    </Card>
  );
};

export default PartnersFilterCard;
