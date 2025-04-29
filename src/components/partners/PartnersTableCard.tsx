
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PartnersTable } from "@/components/partners/PartnersTable";
import { type Partner } from "@/hooks/use-partners";

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
          onEditPartner={onEditPartner}
          onDeletePartner={onDeletePartner}
        />
      </CardContent>
    </Card>
  );
}
