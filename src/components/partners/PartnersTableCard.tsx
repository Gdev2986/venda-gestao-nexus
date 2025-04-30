
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { PartnersTable } from "@/components/partners/PartnersTable";
import { Partner } from "@/hooks/use-partners";

export interface PartnersTableCardProps {
  partners: Partner[];
  isLoading: boolean;
  error: string;
  onEditPartner: (partner: Partner) => void;
  onDeletePartner: (partner: Partner) => Promise<boolean> | void;
}

const PartnersTableCard = ({ 
  partners, 
  isLoading, 
  error, 
  onEditPartner, 
  onDeletePartner 
}: PartnersTableCardProps) => {
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
            onDeletePartner={onDeletePartner}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PartnersTableCard;
