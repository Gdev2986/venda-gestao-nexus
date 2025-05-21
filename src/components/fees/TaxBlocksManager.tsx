
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Link, Settings } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import TaxBlockEditor from "./TaxBlockEditor";
import TaxBlockClientAssociation from "./TaxBlockClientAssociation";

// Mock data for tax blocks
const initialBlocks = [
  { id: "1", name: "Bloco Padrão", description: "Taxas padrão do sistema" },
  { id: "2", name: "Bloco Premium", description: "Taxas reduzidas para clientes premium" },
  { id: "3", name: "Bloco Novos Clientes", description: "Taxas promocionais para novos clientes" }
];

const TaxBlocksManager = () => {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlock, setSelectedBlock] = useState<{id: string, name: string, description: string} | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isAssociating, setIsAssociating] = useState(false);

  // Filter blocks based on search term
  const filteredBlocks = blocks.filter(block => 
    block.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    block.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateBlock = (newBlock: {name: string, description: string}) => {
    const blockWithId = {
      id: `block_${Date.now()}`,
      ...newBlock
    };
    setBlocks([...blocks, blockWithId]);
    setIsCreating(false);
  };

  const handleEditBlock = (updatedBlock: {id: string, name: string, description: string}) => {
    setBlocks(blocks.map(block => 
      block.id === updatedBlock.id ? updatedBlock : block
    ));
    setSelectedBlock(null);
  };

  const handleDeleteBlock = (blockId: string) => {
    setBlocks(blocks.filter(block => block.id !== blockId));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <div className="relative w-full sm:w-96">
          <Input
            placeholder="Buscar blocos de taxa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <span className="absolute left-3 top-2.5 text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </span>
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-1" /> Novo Bloco
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Bloco de Taxas</DialogTitle>
              </DialogHeader>
              <TaxBlockEditor 
                onSave={handleCreateBlock} 
                onCancel={() => setIsCreating(false)} 
              />
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAssociating} onOpenChange={setIsAssociating}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Link className="h-4 w-4 mr-1" /> Associar Clientes
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Associar Blocos a Clientes</DialogTitle>
              </DialogHeader>
              <TaxBlockClientAssociation blocks={blocks} onClose={() => setIsAssociating(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBlocks.map((block) => (
          <Card key={block.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-muted p-4">
                <h3 className="font-semibold text-lg">{block.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{block.description}</p>
              </div>
              <div className="p-4 pt-2 flex gap-2 justify-end">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedBlock(block)}
                    >
                      <Settings className="h-4 w-4 mr-1" /> Configurar Taxas
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Configurar Taxas - {block.name}</DialogTitle>
                    </DialogHeader>
                    <TaxBlockEditor 
                      block={block} 
                      onSave={handleEditBlock} 
                      onCancel={() => setSelectedBlock(null)}
                      onDelete={() => handleDeleteBlock(block.id)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TaxBlocksManager;
