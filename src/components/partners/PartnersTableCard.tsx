
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PartnersTable } from "@/components/partners/PartnersTable";
import { type Partner } from "@/hooks/use-partners";

interface PartnersTableCardProps {
  partners: Partner[];
  isLoading: boolean;
  loading?: boolean; // Add this to support existing code
  error?: string;
  onEdit?: (partner: Partner) => void;
  onDelete?: (partnerId: string) => Promise<boolean>;
  onEditPartner: (partner: Partner) => void;
  onDeletePartner: (partner: Partner) => void;
}

export function PartnersTableCard({
  partners,
  isLoading,
  loading, // Support for existing code
  error,
  onEdit,
  onDelete,
  onEditPartner,
  onDeletePartner,
}: PartnersTableCardProps) {
  // Use loading prop if isLoading is not provided
  const isLoadingState = isLoading || loading || false;
  
  // Use the appropriate handlers based on what's provided
  const handleEdit = onEdit || onEditPartner;
  const handleDelete = async (partner: Partner) => {
    if (onDelete) {
      return await onDelete(partner.id);
    } else if (onDeletePartner) {
      onDeletePartner(partner);
      return true;
    }
    return false;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Parceiros</CardTitle>
        <CardDescription>Listagem completa de parceiros cadastrados no sistema.</CardDescription>
      </CardHeader>
      <CardContent>
        <PartnersTable
          partners={partners}
          isLoading={isLoadingState}
          onEditPartner={handleEdit}
          onDeletePartner={handleDelete}
        />
      </CardContent>
    </Card>
  );
}

export default PartnersTableCard;
