
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

const PartnerSettings = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Configurações" 
        description="Gerencie suas preferências e informações de conta"
      />
      
      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="company">Dados da Empresa</TabsTrigger>
          <TabsTrigger value="payment">Dados de Pagamento</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-2xl">
                      JD
                    </div>
                    <Button variant="outline" size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                      +
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="name">
                      Nome
                    </label>
                    <Input id="name" defaultValue="João da Silva" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">
                      Email
                    </label>
                    <Input id="email" type="email" defaultValue="joao@empresa.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="phone">
                      Telefone
                    </label>
                    <Input id="phone" defaultValue="(11) 98765-4321" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="position">
                      Cargo
                    </label>
                    <Input id="position" defaultValue="Gerente Comercial" />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button>Salvar Alterações</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Empresa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="company-name">
                      Razão Social
                    </label>
                    <Input id="company-name" defaultValue="Empresa ABC Ltda" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="company-cnpj">
                      CNPJ
                    </label>
                    <Input id="company-cnpj" defaultValue="12.345.678/0001-00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="company-address">
                      Endereço
                    </label>
                    <Input id="company-address" defaultValue="Av. Exemplo, 123" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="company-city">
                      Cidade/UF
                    </label>
                    <Input id="company-city" defaultValue="São Paulo/SP" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="company-about">
                    Sobre a Empresa
                  </label>
                  <Textarea 
                    id="company-about" 
                    defaultValue="Empresa especializada em serviços de consultoria tecnológica..." 
                    className="min-h-[100px]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="company-website">
                    Site
                  </label>
                  <Input id="company-website" defaultValue="https://www.empresa-abc.com.br" />
                </div>
                
                <div className="pt-4">
                  <Button>Salvar Alterações</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Dados de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="pix-type">
                      Tipo de Chave PIX
                    </label>
                    <select 
                      id="pix-type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="cnpj">CNPJ</option>
                      <option value="email">Email</option>
                      <option value="phone">Telefone</option>
                      <option value="random">Chave Aleatória</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="pix-key">
                      Chave PIX
                    </label>
                    <Input id="pix-key" defaultValue="12.345.678/0001-00" />
                  </div>
                </div>
                
                <div className="border-b my-4"></div>
                
                <div>
                  <h3 className="font-medium mb-2">Dados Bancários</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="bank">
                      Banco
                    </label>
                    <Input id="bank" defaultValue="Banco XYZ" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="agency">
                      Agência
                    </label>
                    <Input id="agency" defaultValue="0001" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="account">
                      Conta
                    </label>
                    <Input id="account" defaultValue="12345-6" />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button>Salvar Alterações</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Segurança da Conta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Alterar Senha</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="current-password">
                        Senha Atual
                      </label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="new-password">
                        Nova Senha
                      </label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="confirm-password">
                        Confirmar Nova Senha
                      </label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                  <Button className="mt-3">Alterar Senha</Button>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="font-medium mb-3">Segundo Fator de Autenticação</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Adicione uma camada extra de segurança à sua conta com autenticação de dois fatores.
                  </p>
                  <Button variant="outline">Configurar 2FA</Button>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="font-medium mb-3">Dispositivos Conectados</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Chrome em Windows</p>
                        <p className="text-xs text-muted-foreground">São Paulo, Brasil • Ativo agora</p>
                      </div>
                      <Button variant="ghost" size="sm">Este dispositivo</Button>
                    </div>
                    <div className="flex justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Safari em iPhone</p>
                        <p className="text-xs text-muted-foreground">São Paulo, Brasil • Última atividade: 2 dias atrás</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-500">Desconectar</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PartnerSettings;
