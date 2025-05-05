import { PixKeysManager } from "@/components/settings";

const Settings = () => {
  // Mock PixKey data for demo
  const mockPixKeys = [
    {
      id: "1",
      key_type: "CPF",
      type: "CPF",
      key: "123.456.789-00",
      owner_name: "Chave Pessoal",
      name: "Chave Pessoal",
      isDefault: true,
      is_active: true,
      user_id: "user123",
      created_at: "2023-05-01T00:00:00Z",
      updated_at: "2023-05-01T00:00:00Z",
      bank_name: "Banco do Brasil"
    },
    {
      id: "2",
      key_type: "EMAIL",
      type: "EMAIL",
      key: "email@example.com",
      owner_name: "Chave Email",
      name: "Chave Email",
      isDefault: false,
      is_active: true,
      user_id: "user123",
      created_at: "2023-05-02T00:00:00Z",
      updated_at: "2023-05-02T00:00:00Z",
      bank_name: "Nubank"
    }
  ];

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-3xl font-bold mb-6">Configurações</h2>

      <div className="space-y-6">
        <PixKeysManager pixKeys={mockPixKeys} />
        {/* Other settings components would go here */}
      </div>
    </div>
  );
};

export default Settings;
