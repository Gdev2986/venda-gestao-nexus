
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Users, DollarSign, Eye } from "lucide-react";
import { Partner } from "@/types/partner.types";

interface PartnerBlockProps {
  partner: Partner;
  onSelect: (partner: Partner) => void;
  onViewDetails: (partner: Partner) => void;
  isSelected?: boolean;
}

export const PartnerBlock = ({ partner, onSelect, onViewDetails, isSelected }: PartnerBlockProps) => {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={() => onSelect(partner)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{partner.company_name}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(partner);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {partner.contact_name || 'Sem contato'}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {partner.total_sales || 0} vendas
          </span>
        </div>
        
        {partner.contact_email && (
          <div className="text-xs text-muted-foreground truncate">
            {partner.contact_email}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
