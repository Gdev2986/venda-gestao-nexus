
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TaxRatesManager = () => {
  const [selectedTab, setSelectedTab] = useState("pix");
  const [baseRate, setBaseRate] = useState(0.99);
  const [partnerRate, setPartnerRate] = useState(1.5);
  const [totalRate, setTotalRate] = useState(1.99);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle>Gerenciar Taxas</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Bloco: Padrão</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button className="w-full sm:w-auto">Associar Clientes</Button>
            <Button className="w-full sm:w-auto">Adicionar</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="pix">PIX</TabsTrigger>
            <TabsTrigger value="debit">DÉBITO</TabsTrigger>
            <TabsTrigger value="credit">CRÉDITO</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pix" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Taxa Base (%) <span className="font-bold">{baseRate.toFixed(2)}%</span></Label>
                <Slider 
                  defaultValue={[baseRate]} 
                  max={5} 
                  step={0.01} 
                  onValueChange={(value) => setBaseRate(value[0])}
                />
                <Input 
                  type="number" 
                  value={baseRate} 
                  onChange={(e) => setBaseRate(parseFloat(e.target.value) || 0)}
                  step={0.01}
                  min={0}
                  max={5}
                  className="mt-2"
                />
              </div>
              <div className="space-y-2">
                <Label>Taxa Parceiro (%) <span className="font-bold">{partnerRate.toFixed(2)}%</span></Label>
                <Slider 
                  defaultValue={[partnerRate]} 
                  max={5} 
                  step={0.01}
                  onValueChange={(value) => setPartnerRate(value[0])}
                />
                <Input 
                  type="number" 
                  value={partnerRate} 
                  onChange={(e) => setPartnerRate(parseFloat(e.target.value) || 0)}
                  step={0.01}
                  min={0}
                  max={5}
                  className="mt-2"
                />
              </div>
              <div className="space-y-2">
                <Label>Taxa Total <span className="font-bold">{totalRate.toFixed(2)}%</span></Label>
                <Slider 
                  defaultValue={[totalRate]} 
                  max={10} 
                  step={0.01}
                  onValueChange={(value) => setTotalRate(value[0])} 
                />
                <Input 
                  type="number" 
                  value={totalRate} 
                  onChange={(e) => setTotalRate(parseFloat(e.target.value) || 0)}
                  step={0.01}
                  min={0}
                  max={10}
                  className="mt-2"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="debit" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Taxa Base (%) <span className="font-bold">1.49%</span></Label>
                <Slider defaultValue={[1.49]} max={5} step={0.01} />
                <Input 
                  type="number" 
                  value={1.49} 
                  step={0.01}
                  min={0}
                  max={5}
                  className="mt-2"
                />
              </div>
              <div className="space-y-2">
                <Label>Taxa Parceiro (%) <span className="font-bold">1.75%</span></Label>
                <Slider defaultValue={[1.75]} max={5} step={0.01} />
                <Input 
                  type="number" 
                  value={1.75} 
                  step={0.01}
                  min={0}
                  max={5}
                  className="mt-2"
                />
              </div>
              <div className="space-y-2">
                <Label>Taxa Total <span className="font-bold">2.49%</span></Label>
                <Slider defaultValue={[2.49]} max={10} step={0.01} />
                <Input 
                  type="number" 
                  value={2.49} 
                  step={0.01}
                  min={0}
                  max={10}
                  className="mt-2"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="credit" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Taxa Base (%) <span className="font-bold">2.99%</span></Label>
                <Slider defaultValue={[2.99]} max={10} step={0.01} />
                <Input 
                  type="number" 
                  value={2.99} 
                  step={0.01}
                  min={0}
                  max={10}
                  className="mt-2"
                />
              </div>
              <div className="space-y-2">
                <Label>Taxa Parceiro (%) <span className="font-bold">2.50%</span></Label>
                <Slider defaultValue={[2.50]} max={10} step={0.01} />
                <Input 
                  type="number" 
                  value={2.50} 
                  step={0.01}
                  min={0}
                  max={10}
                  className="mt-2"
                />
              </div>
              <div className="space-y-2">
                <Label>Taxa Total <span className="font-bold">3.99%</span></Label>
                <Slider defaultValue={[3.99]} max={15} step={0.01} />
                <Input 
                  type="number" 
                  value={3.99} 
                  step={0.01}
                  min={0}
                  max={15}
                  className="mt-2"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TaxRatesManager;
