
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { PartnersTable } from "@/components/partners/PartnersTable";
import { Partner } from "@/hooks/use-partners";

export interface PartnersTableCardProps {
  partners: Partner[];
  isLoading: boolean;
  error: string;
  onEdit: (partner: Partner) => void;
  onDelete: (partnerId: string) => Promise<boolean>;
}

export function PartnersTableCard({ 
  partners, 
  isLoading, 
  error, 
  onEdit: onEditPartner, 
  onDelete: onDeletePartner 
}: PartnersTableCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Parceiros</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        ) : (
          <PartnersTable 
            partners={partners} 
            isLoading={isLoading} 
            onEditPartner={onEditPartner}
            onDeletePartner={(partner) => onDeletePartner(partner.id)}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default PartnersTableCard;
