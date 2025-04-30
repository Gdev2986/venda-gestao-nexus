
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PartnerFilter from "@/components/partners/PartnerFilter";
import { type FilterValues } from "@/hooks/use-partners";

interface PartnersFilterCardProps {
  onFilter: (values: FilterValues) => void;
}

export function PartnersFilterCard({ onFilter }: PartnersFilterCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
        <CardDescription>
          Utilize os filtros abaixo para encontrar parceiros específicos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PartnerFilter onFilter={onFilter} />
      </CardContent>
    </Card>
  );
}

export default PartnersFilterCard;
