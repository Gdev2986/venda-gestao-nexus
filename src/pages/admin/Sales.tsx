
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/routes/paths";

const Sales = () => {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page is under construction.</p>
          <Button asChild className="ml-auto">
            <a href={PATHS.ADMIN.SALE_NEW}>Nova Venda</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;
