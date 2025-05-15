
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import PartnersTable from "@/components/partners/PartnersTable";
import { Partner } from "@/types";

export interface PartnersTableCardProps {
  partners: Partner[];
  loading?: boolean; // Changed isLoading to loading to match use-partners.ts
  error?: string | null; // Made error optional and allowed null
  onEdit?: (partner: Partner) => void;
  onDelete?: (partnerId: string) => Promise<boolean>;
}

export function PartnersTableCard({ 
  partners, 
  loading = false,  // Provided default value
  error = null,    // Provided default value
  onEdit = () => {}, // Provided default function
  onDelete = async () => true // Provided default function
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
            isLoading={loading} 
            onEdit={onEdit}
            onDelete={(partner) => onDelete(partner.id)}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default PartnersTableCard;
