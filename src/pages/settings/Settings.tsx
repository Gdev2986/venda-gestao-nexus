
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PixKey } from "@/types";

// Define the expected PixKey type to match what's used in the component
interface ExtendedPixKey extends PixKey {
  key_type: string;
  type: string;
  owner_name: string;
  name: string;
  isDefault: boolean;
  is_active: boolean;
  bank_name: string;
}

const Settings = () => {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page is under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
