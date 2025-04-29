
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PartnersTable from "@/components/partners/PartnersTable";
import { Partner } from "@/types";

interface PartnersTableCardProps {
  partners: Partner[];
  isLoading: boolean;
  onEditPartner: (partner: Partner) => void;
  onDeletePartner: (partner: Partner) => void;
}

export function PartnersTableCard({
  partners,
  isLoading,
  onEditPartner,
  onDeletePartner,
}: PartnersTableCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Parceiros</CardTitle>
        <CardDescription>Listagem completa de parceiros cadastrados no sistema.</CardDescription>
      </CardHeader>
      <CardContent>
        <PartnersTable
          partners={partners}
          isLoading={isLoading}
          onViewPartner={onEditPartner}
        />
      </CardContent>
    </Card>
  );
}

export default PartnersTableCard;
