
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

const PartnersAndClients = () => {
  const [activeTab, setActiveTab] = useState("partners");
  const [searchTerm, setSearchTerm] = useState("");

  const mockPartners = [
    {
      id: "1",
      company_name: "Tech Solutions LTDA",
      commission_rate: 5.5,
      created_at: "2024-01-15",
    },
    {
      id: "2", 
      company_name: "Digital Commerce Inc",
      commission_rate: 3.2,
      created_at: "2024-02-20",
    }
  ];

  const mockClients = [
    {
      id: "1",
      business_name: "Supermercado ABC",
      contact_name: "João Silva",
      email: "joao@abc.com",
      status: "ACTIVE",
    },
    {
      id: "2",
      business_name: "Restaurante XYZ",
      contact_name: "Maria Santos",
      email: "maria@xyz.com", 
      status: "INACTIVE",
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Parceiros e Clientes</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar {activeTab === "partners" ? "Parceiro" : "Cliente"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="partners">Parceiros</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4" />
            <Input
              placeholder={`Buscar ${activeTab === "partners" ? "parceiros" : "clientes"}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>

        <TabsContent value="partners">
          <Card>
            <CardHeader>
              <CardTitle>Parceiros</CardTitle>
              <CardDescription>
                Gerencie os parceiros do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome da Empresa</TableHead>
                      <TableHead>Taxa de Comissão</TableHead>
                      <TableHead>Data de Criação</TableHead>
                      <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPartners.map((partner) => (
                      <TableRow key={partner.id}>
                        <TableCell className="font-medium">{partner.company_name}</TableCell>
                        <TableCell>{partner.commission_rate}%</TableCell>
                        <TableCell>{new Date(partner.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Clientes</CardTitle>
              <CardDescription>
                Gerencie os clientes do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome da Empresa</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.business_name}</TableCell>
                        <TableCell>{client.contact_name}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>
                          <Badge variant={client.status === 'ACTIVE' ? 'default' : 'secondary'}>
                            {client.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PartnersAndClients;
