import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  PlusIcon, 
  Settings2Icon, 
  Trash2Icon, 
  CopyIcon, 
  HistoryIcon, 
  DownloadIcon, 
  SearchIcon, 
  HelpCircleIcon, 
  FilterIcon,
  InfoIcon,
  CheckIcon,
  XIcon
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger, 
} from "@/components/ui/tooltip";

// Fee types
const PAYMENT_TYPES = ["PIX", "DÉBITO", "CRÉDITO"] as const;
type PaymentType = typeof PAYMENT_TYPES[number];

// Interfaces
interface FeeBlock {
  id: string;
  name: string;
  color: string;
  clients: string[];
  created_at: string;
  updated_at: string;
}

interface Fee {
  id: string;
  blockId: string;
  paymentMethod: PaymentType;
  installments: number | null;
  baseRate: number;
  partnerRate: number;
  finalRate: number;
  created_at: string;
  updated_at: string;
}

interface BlockHistory {
  id: string;
  blockId: string;
  action: string;
  details: string;
  created_at: string;
  user: string;
}

interface Client {
  id: string;
  name: string;
  document: string;
  feeBlockId: string | null;
}

// Color options for fee blocks
const BLOCK_COLORS = [
  { name: "blue", class: "bg-blue-500" },
  { name: "green", class: "bg-green-500" },
  { name: "red", class: "bg-red-500" },
  { name: "yellow", class: "bg-yellow-500" },
  { name: "purple", class: "bg-purple-500" },
  { name: "pink", class: "bg-pink-500" },
  { name: "indigo", class: "bg-indigo-500" },
  { name: "teal", class: "bg-teal-500" },
];

const Fees = () => {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  
  // Fee blocks state
  const [feeBlocks, setFeeBlocks] = useState<FeeBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [newBlock, setNewBlock] = useState<{ name: string; color: string }>({
    name: "",
    color: "blue",
  });
  const [editingBlock, setEditingBlock] = useState<FeeBlock | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [blockToDelete, setBlockToDelete] = useState<string | null>(null);
  
  // Fees state
  const [fees, setFees] = useState<Fee[]>([]);
  const [showAddFeeDialog, setShowAddFeeDialog] = useState(false);
  const [newFee, setNewFee] = useState<Omit<Fee, "id" | "blockId" | "created_at" | "updated_at">>({
    paymentMethod: "PIX",
    installments: null,
    baseRate: 0,
    partnerRate: 0,
    finalRate: 0,
  });
  const [editingFee, setEditingFee] = useState<Fee | null>(null);
  const [activeTab, setActiveTab] = useState<PaymentType>("PIX");
  
  // Clients state
  const [clients, setClients] = useState<Client[]>([]);
  const [showAssignClientsDialog, setShowAssignClientsDialog] = useState(false);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [clientSearch, setClientSearch] = useState("");
  
  // History state
  const [blockHistory, setBlockHistory] = useState<BlockHistory[]>([]);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [selectedBlockHistory, setSelectedBlockHistory] = useState<string | null>(null);
  
  // Search and filter
  const [search, setSearch] = useState("");
  
  // Stats
  const [totalBlocks, setTotalBlocks] = useState(0);
  const [avgFeeRate, setAvgFeeRate] = useState(0);
  const [totalLinkedClients, setTotalLinkedClients] = useState(0);
  
  // Load data on component mount
  useEffect(() => {
    fetchFeeBlocks();
    fetchFees();
    fetchClients();
  }, []);
  
  // Update stats when data changes
  useEffect(() => {
    setTotalBlocks(feeBlocks.length);
    
    // Calculate average fee rate
    if (fees.length > 0) {
      const avgRate = fees.reduce((sum, fee) => sum + fee.finalRate, 0) / fees.length;
      setAvgFeeRate(avgRate);
    } else {
      setAvgFeeRate(0);
    }
    
    // Calculate total linked clients
    const linkedClients = clients.filter(client => client.feeBlockId !== null).length;
    setTotalLinkedClients(linkedClients);
  }, [feeBlocks, fees, clients]);
  
  // Fetch fee blocks from API
  const fetchFeeBlocks = async () => {
    setIsLoading(true);
    try {
      // Simulated API call
      setTimeout(() => {
        const mockBlocks: FeeBlock[] = [
          {
            id: "block-1",
            name: "Bloco Padrão",
            color: "blue",
            clients: ["client-1", "client-2"],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "block-2",
            name: "Bloco Premium",
            color: "green",
            clients: ["client-3"],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "block-3",
            name: "Bloco Parceiros",
            color: "purple",
            clients: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ];
        
        setFeeBlocks(mockBlocks);
        if (mockBlocks.length > 0 && !selectedBlock) {
          setSelectedBlock(mockBlocks[0].id);
        }
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching fee blocks:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os blocos de taxas.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  // Fetch fees from API
  const fetchFees = async () => {
    try {
      // Simulated API call
      setTimeout(() => {
        const mockFees: Fee[] = [
          {
            id: "fee-1",
            blockId: "block-1",
            paymentMethod: "PIX",
            installments: null,
            baseRate: 1.5,
            partnerRate: 0.5,
            finalRate: 2.0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "fee-2",
            blockId: "block-1",
            paymentMethod: "DÉBITO",
            installments: null,
            baseRate: 2.0,
            partnerRate: 0.7,
            finalRate: 2.7,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "fee-3",
            blockId: "block-1",
            paymentMethod: "CRÉDITO",
            installments: 1,
            baseRate: 2.5,
            partnerRate: 1.0,
            finalRate: 3.5,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "fee-4",
            blockId: "block-1",
            paymentMethod: "CRÉDITO",
            installments: 2,
            baseRate: 3.5,
            partnerRate: 1.5,
            finalRate: 5.0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "fee-5",
            blockId: "block-2",
            paymentMethod: "PIX",
            installments: null,
            baseRate: 1.0,
            partnerRate: 0.3,
            finalRate: 1.3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ];
        
        setFees(mockFees);
      }, 1000);
    } catch (error) {
      console.error("Error fetching fees:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as taxas.",
        variant: "destructive",
      });
    }
  };
  
  // Fetch clients from API
  const fetchClients = async () => {
    try {
      // Simulated API call
      setTimeout(() => {
        const mockClients: Client[] = [
          {
            id: "client-1",
            name: "Empresa ABC",
            document: "12.345.678/0001-90",
            feeBlockId: "block-1",
          },
          {
            id: "client-2",
            name: "Loja XYZ",
            document: "98.765.432/0001-10",
            feeBlockId: "block-1",
          },
          {
            id: "client-3",
            name: "Restaurante DEF",
            document: "45.678.901/0001-23",
            feeBlockId: "block-2",
          },
          {
            id: "client-4",
            name: "Consultoria GHI",
            document: "34.567.890/0001-45",
            feeBlockId: null,
          },
          {
            id: "client-5",
            name: "Farmácia JKL",
            document: "56.789.012/0001-67",
            feeBlockId: null,
          },
        ];
        
        setClients(mockClients);
      }, 1000);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes.",
        variant: "destructive",
      });
    }
  };
  
  // Handle creating a new fee block
  const handleCreateBlock = async () => {
    if (!newBlock.name.trim()) {
      toast({
        title: "Erro",
        description: "O nome do bloco é obrigatório.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Simulated API call
      const newBlockData: FeeBlock = {
        id: `block-${Date.now()}`,
        name: newBlock.name,
        color: newBlock.color,
        clients: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setFeeBlocks([...feeBlocks, newBlockData]);
      setShowBlockDialog(false);
      setNewBlock({ name: "", color: "blue" });
      
      toast({
        title: "Sucesso",
        description: "Bloco de taxas criado com sucesso.",
      });
    } catch (error) {
      console.error("Error creating fee block:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o bloco de taxas.",
        variant: "destructive",
      });
    }
  };
  
  // Handle updating a fee block
  const handleUpdateBlock = async () => {
    if (!editingBlock || !newBlock.name.trim()) {
      toast({
        title: "Erro",
        description: "O nome do bloco é obrigatório.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Simulated API call
      const updatedBlocks = feeBlocks.map(block => {
        if (block.id === editingBlock.id) {
          return {
            ...block,
            name: newBlock.name,
            color: newBlock.color,
            updated_at: new Date().toISOString(),
          };
        }
        return block;
      });
      
      setFeeBlocks(updatedBlocks);
      setShowBlockDialog(false);
      setEditingBlock(null);
      setNewBlock({ name: "", color: "blue" });
      
      toast({
        title: "Sucesso",
        description: "Bloco de taxas atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Error updating fee block:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o bloco de taxas.",
        variant: "destructive",
      });
    }
  };
  
  // Handle deleting a fee block
  const handleDeleteBlock = async () => {
    if (!blockToDelete) return;
    
    try {
      // Check if block has clients
      const blockToDeleteData = feeBlocks.find(block => block.id === blockToDelete);
      if (blockToDeleteData && blockToDeleteData.clients.length > 0) {
        toast({
          title: "Erro",
          description: "Não é possível excluir um bloco com clientes associados.",
          variant: "destructive",
        });
        setShowDeleteDialog(false);
        setBlockToDelete(null);
        return;
      }
      
      // Simulated API call
      const updatedBlocks = feeBlocks.filter(block => block.id !== blockToDelete);
      
      // Also remove fees associated with this block
      const updatedFees = fees.filter(fee => fee.blockId !== blockToDelete);
      
      setFeeBlocks(updatedBlocks);
      setFees(updatedFees);
      
      if (selectedBlock === blockToDelete) {
        setSelectedBlock(updatedBlocks.length > 0 ? updatedBlocks[0].id : null);
      }
      
      setShowDeleteDialog(false);
      setBlockToDelete(null);
      
      toast({
        title: "Sucesso",
        description: "Bloco de taxas excluído com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting fee block:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o bloco de taxas.",
        variant: "destructive",
      });
    }
  };
  
  // Handle creating a new fee
  const handleCreateFee = async () => {
    if (!selectedBlock) return;
    
    // Validate fee data
    if (newFee.baseRate < 0 || newFee.partnerRate < 0 || newFee.finalRate < 0) {
      toast({
        title: "Erro",
        description: "As taxas não podem ser negativas.",
        variant: "destructive",
      });
      return;
    }
    
    // For credit, installments are required
    if (newFee.paymentMethod === "CRÉDITO" && (!newFee.installments || newFee.installments < 1)) {
      toast({
        title: "Erro",
        description: "O número de parcelas é obrigatório para pagamentos em crédito.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Check if fee already exists
      const existingFee = fees.find(
        fee => 
          fee.blockId === selectedBlock && 
          fee.paymentMethod === newFee.paymentMethod && 
          fee.installments === newFee.installments
      );
      
      if (existingFee && !editingFee) {
        toast({
          title: "Erro",
          description: "Já existe uma taxa com essas configurações.",
          variant: "destructive",
        });
        return;
      }
      
      if (editingFee) {
        // Update existing fee
        const updatedFees = fees.map(fee => {
          if (fee.id === editingFee.id) {
            return {
              ...fee,
              paymentMethod: newFee.paymentMethod,
              installments: newFee.installments,
              baseRate: newFee.baseRate,
              partnerRate: newFee.partnerRate,
              finalRate: newFee.finalRate,
              updated_at: new Date().toISOString(),
            };
          }
          return fee;
        });
        
        setFees(updatedFees);
        toast({
          title: "Sucesso",
          description: "Taxa atualizada com sucesso.",
        });
      } else {
        // Create new fee
        const newFeeData: Fee = {
          id: `fee-${Date.now()}`,
          blockId: selectedBlock,
          paymentMethod: newFee.paymentMethod,
          installments: newFee.installments,
          baseRate: newFee.baseRate,
          partnerRate: newFee.partnerRate,
          finalRate: newFee.finalRate,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        setFees([...fees, newFeeData]);
        toast({
          title: "Sucesso",
          description: "Taxa criada com sucesso.",
        });
      }
      
      setShowAddFeeDialog(false);
      resetNewFee();
      setEditingFee(null);
    } catch (error) {
      console.error("Error creating/updating fee:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a taxa.",
        variant: "destructive",
      });
    }
  };
  
  // Handle removing a fee
  const handleRemoveFee = async (feeId: string) => {
    try {
      // Simulated API call
      const updatedFees = fees.filter(fee => fee.id !== feeId);
      setFees(updatedFees);
      
      toast({
        title: "Sucesso",
        description: "Taxa removida com sucesso.",
      });
    } catch (error) {
      console.error("Error removing fee:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a taxa.",
        variant: "destructive",
      });
    }
  };
  
  // Handle assigning clients to a fee block
  const handleAssignClients = async () => {
    if (!selectedBlock) return;
    
    try {
      // Simulated API call
      // Update clients
      const updatedClients = clients.map(client => {
        if (selectedClients.includes(client.id)) {
          return {
            ...client,
            feeBlockId: selectedBlock,
          };
        }
        return client;
      });
      
      // Update fee blocks
      const updatedBlocks = feeBlocks.map(block => {
        if (block.id === selectedBlock) {
          return {
            ...block,
            clients: selectedClients,
            updated_at: new Date().toISOString(),
          };
        }
        // Remove these clients from other blocks
        if (block.id !== selectedBlock) {
          return {
            ...block,
            clients: block.clients.filter(clientId => !selectedClients.includes(clientId)),
            updated_at: new Date().toISOString(),
          };
        }
        return block;
      });
      
      setClients(updatedClients);
      setFeeBlocks(updatedBlocks);
      setShowAssignClientsDialog(false);
      setSelectedClients([]);
      
      toast({
        title: "Sucesso",
        description: "Clientes associados com sucesso.",
      });
    } catch (error) {
      console.error("Error assigning clients:", error);
      toast({
        title: "Erro",
        description: "Não foi possível associar os clientes.",
        variant: "destructive",
      });
    }
  };
  
  // Handle duplicating a fee block
  const handleDuplicateBlock = async (blockId: string) => {
    try {
      const blockToDuplicate = feeBlocks.find(block => block.id === blockId);
      if (!blockToDuplicate) return;
      
      // Create new block
      const newBlockData: FeeBlock = {
        id: `block-${Date.now()}`,
        name: `${blockToDuplicate.name} (Cópia)`,
        color: blockToDuplicate.color,
        clients: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Duplicate fees
      const feesToDuplicate = fees.filter(fee => fee.blockId === blockId);
      const newFees = feesToDuplicate.map(fee => ({
        ...fee,
        id: `fee-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        blockId: newBlockData.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));
      
      setFeeBlocks([...feeBlocks, newBlockData]);
      setFees([...fees, ...newFees]);
      
      toast({
        title: "Sucesso",
        description: "Bloco de taxas duplicado com sucesso.",
      });
    } catch (error) {
      console.error("Error duplicating fee block:", error);
      toast({
        title: "Erro",
        description: "Não foi possível duplicar o bloco de taxas.",
        variant: "destructive",
      });
    }
  };
  
  // Handle exporting fee data
  const handleExport = async (format: 'csv' | 'pdf') => {
    setIsExporting(true);
    
    try {
      // Simulated export
      setTimeout(() => {
        toast({
          title: "Sucesso",
          description: `Dados exportados em formato ${format.toUpperCase()}.`,
        });
        setIsExporting(false);
      }, 2000);
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Erro",
        description: "Não foi possível exportar os dados.",
        variant: "destructive",
      });
      setIsExporting(false);
    }
  };
  
  // Handle editing a fee block
  const handleEditBlock = (block: FeeBlock) => {
    setEditingBlock(block);
    setNewBlock({
      name: block.name,
      color: block.color,
    });
    setShowBlockDialog(true);
  };
  
  // Handle editing a fee
  const handleEditFee = (fee: Fee) => {
    setEditingFee(fee);
    setNewFee({
      paymentMethod: fee.paymentMethod,
      installments: fee.installments,
      baseRate: fee.baseRate,
      partnerRate: fee.partnerRate,
      finalRate: fee.finalRate,
    });
    setShowAddFeeDialog(true);
  };
  
  // Handle initiating block deletion
  const handleDeleteBlockInitiate = (blockId: string) => {
    setBlockToDelete(blockId);
    setShowDeleteDialog(true);
  };
  
  // Reset new fee form
  const resetNewFee = () => {
    setNewFee({
      paymentMethod: activeTab,
      installments: activeTab === "CRÉDITO" ? 1 : null,
      baseRate: 0,
      partnerRate: 0,
      finalRate: 0,
    });
  };
  
  // Open assign clients dialog
  const openAssignClientsDialog = () => {
    if (!selectedBlock) return;
    
    const block = feeBlocks.find(b => b.id === selectedBlock);
    if (block) {
      setSelectedClients(block.clients);
    } else {
      setSelectedClients([]);
    }
    
    setShowAssignClientsDialog(true);
  };
  
  // Open history dialog
  const openHistoryDialog = (blockId: string) => {
    setSelectedBlockHistory(blockId);
    
    // Simulated API call to fetch history
    setTimeout(() => {
      const mockHistory: BlockHistory[] = [
        {
          id: "history-1",
          blockId,
          action: "Criação",
          details: "Bloco de taxas criado",
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          user: "Admin",
        },
        {
          id: "history-2",
          blockId,
          action: "Atualização",
          details: "Taxa de PIX alterada de 1.0% para 1.5%",
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          user: "Admin",
        },
        {
          id: "history-3",
          blockId,
          action: "Associação",
          details: "Cliente 'Empresa ABC' associado ao bloco",
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          user: "Admin",
        },
        {
          id: "history-4",
          blockId,
          action: "Atualização",
          details: "Taxa de Débito alterada de 2.5% para 2.0%",
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          user: "Admin",
        },
      ];
      
      setBlockHistory(mockHistory);
      setShowHistoryDialog(true);
    }, 500);
  };
  
  // Filter blocks based on search term
  const getFilteredBlocks = () => {
    if (!search) return feeBlocks;
    
    return feeBlocks.filter(block => 
      block.name.toLowerCase().includes(search.toLowerCase()) ||
      block.clients.length.toString().includes(search)
    );
  };
  
  // Get fees for the selected block and payment method
  const getSelectedBlockFees = () => {
    if (!selectedBlock) return [];
    
    return fees
      .filter(fee => fee.blockId === selectedBlock && fee.paymentMethod === activeTab)
      .sort((a, b) => {
        // Sort by installments for credit
        if (a.paymentMethod === "CRÉDITO" && b.paymentMethod === "CRÉDITO") {
          return (a.installments || 0) - (b.installments || 0);
        }
        return 0;
      });
  };
  
  // Get filtered clients for assignment
  const getFilteredClients = () => {
    if (!clientSearch) return clients;
    
    return clients.filter(client => 
      client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      client.document.includes(clientSearch)
    );
  };
  
  // Get block color class
  const getBlockColor = (color: string) => {
    const colorObj = BLOCK_COLORS.find(c => c.name === color);
    return colorObj ? colorObj.class : "bg-gray-500";
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Taxas</h2>
        {isAdmin && (
          <Button onClick={() => {
            setEditingBlock(null);
            setNewBlock({ name: "", color: "blue" });
            setShowBlockDialog(true);
          }}>
            <PlusIcon className="mr-2 h-4 w-4" />
            <span className="whitespace-nowrap">Novo Bloco de Taxas</span>
          </Button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Blocos</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">{totalBlocks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taxa Média</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">{avgFeeRate.toFixed(2)}%</div>
          </CardContent>
        </Card>
        
        <Card className="sm:col-span-2 md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clientes Vinculados</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">{totalLinkedClients}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou nº de clientes" 
            className="max-w-full sm:max-w-[300px]"
          />
          <Button variant="outline" size="icon" className="h-10 w-10 flex-shrink-0">
            <FilterIcon className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button 
            variant="outline" 
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="w-full sm:w-auto"
          >
            <span className="whitespace-nowrap">Exportar PDF</span>
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="w-full sm:w-auto"
          >
            <span className="whitespace-nowrap">Exportar CSV</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Blocos de Taxas</CardTitle>
            <CardDescription>
              Selecione um bloco para gerenciar suas taxas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <p>Carregando blocos...</p>
              </div>
            ) : (
              <div className="space-y-2">
                {getFilteredBlocks().length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhum bloco de taxas encontrado.
                  </p>
                ) : (
                  getFilteredBlocks().map((block) => (
                    <div 
                      key={block.id}
                      className={`flex items-center justify-between p-3 rounded-md cursor-pointer border ${
                        selectedBlock === block.id ? 'border-primary' : 'border-border'
                      } hover:border-primary transition-colors`}
                      onClick={() => setSelectedBlock(block.id)}
                    >
                      <div className="flex items-center space-x-2 min-w-0 overflow-hidden">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getBlockColor(block.color)}`} />
                        <div className="min-w-0 overflow-hidden">
                          <p className="font-medium truncate">{block.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {block.clients.length > 0 
                              ? `${block.clients.length} cliente(s)`
                              : "Nenhum cliente"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0" onClick={(e) => {
                                e.stopPropagation();
                                openHistoryDialog(block.id);
                              }}>
                                <HistoryIcon className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Ver histórico</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {isAdmin && (
                          <>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0" onClick={(e) => {
                                    e.stopPropagation();
                                    handleDuplicateBlock(block.id);
                                  }}>
                                    <CopyIcon className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Duplicar</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0" onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditBlock(block);
                                  }}>
                                    <Settings2Icon className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Editar</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0" onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteBlockInitiate(block.id);
                                  }}>
                                    <Trash2Icon className="h-3.5 w-3.5 text-destructive" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Excluir</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <CardTitle>Gerenciar Taxas</CardTitle>
              {selectedBlock && (
                <CardDescription>
                  Bloco: {feeBlocks.find(b => b.id === selectedBlock)?.name}
                </CardDescription>
              )}
            </div>
            {selectedBlock && (
              <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                <Button 
                  variant="outline" 
                  onClick={openAssignClientsDialog}
                  className="w-full sm:w-auto"
                >
                  <span className="whitespace-nowrap">Associar Clientes</span>
                </Button>
                {isAdmin && (
                  <Button 
                    onClick={() => {
                      resetNewFee();
                      setEditingFee(null);
                      setNewFee(prev => ({ ...prev, paymentMethod: activeTab }));
                      setShowAddFeeDialog(true);
                    }}
                    className="w-full sm:w-auto"
                  >
                    <span className="whitespace-nowrap">Adicionar Taxa</span>
                  </Button>
                )}
              </div>
            )}
          </CardHeader>
          <CardContent className="p-0 md:p-1">
            {!selectedBlock ? (
              <div className="text-center py-8 text-muted-foreground p-4">
                Selecione um bloco de taxas para gerenciar suas taxas
              </div>
            ) : (
              <Tabs defaultValue="PIX" value={activeTab} onValueChange={setActiveTab}>
                <div className="px-4">
                  <TabsList className="grid grid-cols-3 mb-4">
                    {PAYMENT_TYPES.map(type => (
                      <TabsTrigger key={type} value={type}>{type}</TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {PAYMENT_TYPES.map(type => (
                  <TabsContent key={type} value={type} className="mt-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {type === "CRÉDITO" && (
                              <TableHead className="w-[90px]">
                                <div className="flex items-center">
                                  Parcelas
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <HelpCircleIcon className="h-4 w-4 ml-1 text-muted-foreground" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Número de parcelas para pagamento em crédito</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </TableHead>
                            )}
                            <TableHead className="w-[120px]">
                              <div className="flex items-center">
                                Taxa Base (%)
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <HelpCircleIcon className="h-4 w-4 ml-1 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Taxa básica sem adicionais</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </TableHead>
                            <TableHead className="w-[140px]">
                              <div className="flex items-center">
                                Taxa Parceiro (%)
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <HelpCircleIcon className="h-4 w-4 ml-1 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Taxa repassada aos parceiros</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </TableHead>
                            <TableHead className="w-[120px]">
                              <div className="flex items-center">
                                Taxa Final (%)
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <HelpCircleIcon className="h-4 w-4 ml-1 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Taxa total cobrada do cliente</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </TableHead>
                            <TableHead className="text-right w-[170px]">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getSelectedBlockFees().length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={type === "CRÉDITO" ? 5 : 4} className="text-center py-10">
                                Nenhuma taxa cadastrada para {type.toLowerCase()}.
                              </TableCell>
                            </TableRow>
                          ) : (
                            getSelectedBlockFees().map((fee) => (
                              <TableRow key={fee.id}>
                                {type === "CRÉDITO" && <TableCell>{fee.installments}x</TableCell>}
                                <TableCell>{fee.baseRate.toFixed(2)}%</TableCell>
                                <TableCell>{fee.partnerRate.toFixed(2)}%</TableCell>
                                <TableCell>{fee.finalRate.toFixed(2)}%</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    {isAdmin ? (
                                      <>
                                        <Button variant="outline" size="sm" onClick={() => handleEditFee(fee)}>
                                          Editar
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          className="text-destructive hover:text-destructive"
                                          onClick={() => handleRemoveFee(fee.id)}
                                        >
                                          Remover
                                        </Button>
                                      </>
                                    ) : (
                                      <Badge variant="outline">Somente Visualização</Badge>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Fee Block Dialog */}
      <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingBlock ? "Editar Bloco de Taxas" : "Novo Bloco de Taxas"}
            </DialogTitle>
            <DialogDescription>
              {editingBlock 
                ? "Edite as informações do bloco de taxas" 
                : "Crie um novo bloco para agrupar taxas"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="block-name">Nome do Bloco</Label>
              <Input
                id="block-name"
                placeholder="Ex: Bloco Padrão"
                value={newBlock.name}
                onChange={(e) => setNewBlock({ ...newBlock, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="flex flex-wrap gap-2">
                {BLOCK_COLORS.map((color) => (
                  <div
                    key={color.name}
                    className={`w-8 h-8 rounded-full cursor-pointer ${color.class} ${
                      newBlock.color === color.name
                        ? "ring-2 ring-offset-2 ring-primary"
                        : ""
                    }`}
                    onClick={() => setNewBlock({ ...newBlock, color: color.name })}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBlockDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={editingBlock ? handleUpdateBlock : handleCreateBlock}>
              {editingBlock ? "Salvar Alterações" : "Criar Bloco"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Block Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este bloco de taxas? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-destructive font-medium">
              Atenção: Todas as taxas associadas a este bloco também serão excluídas.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteBlock}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add/Edit Fee Dialog */}
      <Dialog open={showAddFeeDialog} onOpenChange={setShowAddFeeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingFee ? "Editar Taxa" : "Adicionar Nova Taxa"}
            </DialogTitle>
            <DialogDescription>
              {editingFee 
                ? "Edite as informações da taxa" 
                : "Configure uma nova taxa para este bloco"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="payment-method">Método de Pagamento</Label>
              <Select
                value={newFee.paymentMethod}
                onValueChange={(value: PaymentType) => {
                  setNewFee({
                    ...newFee,
                    paymentMethod: value,
                    installments: value === "CRÉDITO" ? 1 : null,
                  });
                }}
              >
                <SelectTrigger id="payment-method">
                  <SelectValue placeholder="Selecione o método" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {newFee.paymentMethod === "CRÉDITO" && (
              <div className="space-y-2">
                <Label htmlFor="installments">Parcelas</Label>
                <Input
                  id="installments"
                  type="number"
                  min="1"
                  max="12"
                  placeholder="Número de parcelas"
                  value={newFee.installments || ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setNewFee({
                      ...newFee,
                      installments: isNaN(value) ? null : value,
                    });
                  }}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="base-rate">Taxa Base (%)</Label>
              <Input
                id="base-rate"
                type="number"
                step="0.01"
                min="0"
                placeholder="Ex: 2.5"
                value={newFee.baseRate}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  setNewFee({
                    ...newFee,
                    baseRate: isNaN(value) ? 0 : value,
                    finalRate: isNaN(value) ? newFee.partnerRate : value + newFee.partnerRate,
                  });
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="partner-rate">Taxa Parceiro (%)</Label>
              <Input
                id="partner-rate"
                type="number"
                step="0.01"
                min="0"
                placeholder="Ex: 0.5"
                value={newFee.partnerRate}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  setNewFee({
                    ...newFee,
                    partnerRate: isNaN(value) ? 0 : value,
                    finalRate: isNaN(value) ? newFee.baseRate : newFee.baseRate + value,
                  });
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="final-rate">Taxa Final (%)</Label>
              <Input
                id="final-rate"
                type="number"
                step="0.01"
                min="0"
                placeholder="Ex: 3.0"
                value={newFee.finalRate}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  setNewFee({
                    ...newFee,
                    finalRate: isNaN(value) ? 0 : value,
                  });
                }}
              />
              <p className="text-xs text-muted-foreground">
                A taxa final é calculada automaticamente como a soma da taxa base e da taxa do parceiro,
                mas pode ser ajustada manualmente se necessário.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddFeeDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateFee}>
              {editingFee ? "Salvar Alterações" : "Adicionar Taxa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Assign Clients Dialog */}
      <Dialog open={showAssignClientsDialog} onOpenChange={setShowAssignClientsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Associar Clientes</DialogTitle>
            <DialogDescription>
              Selecione os clientes que deseja associar a este bloco de taxas
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <Input
                placeholder="Buscar clientes..."
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
              />
            </div>
            
            <div className="border rounded-md max-h-[300px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={
                            getFilteredClients().length > 0 &&
                            getFilteredClients().every(client => selectedClients.includes(client.id))
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedClients(getFilteredClients().map(client => client.id));
                            } else {
                              setSelectedClients([]);
                            }
                          }}
                        />
                      </div>
                    </TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Bloco Atual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredClients().length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        Nenhum cliente encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    getFilteredClients().map((client) => (
                      <TableRow key={client.id}>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300"
                              checked={selectedClients.includes(client.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedClients([...selectedClients, client.id]);
                                } else {
                                  setSelectedClients(selectedClients.filter(id => id !== client.id));
                                }
                              }}
                            />
                          </div>
                        </TableCell>
                        <TableCell>{client.name}</TableCell>
                        <TableCell>{client.document}</TableCell>
                        <TableCell>
                          {client.feeBlockId ? (
                            <Badge variant="outline">
                              {feeBlocks.find(b => b.id === client.feeBlockId)?.name || "Desconhecido"}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-100">
                              Nenhum
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground">
              {selectedClients.length} cliente(s) selecionado(s)
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignClientsDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAssignClients}>
              Associar Clientes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Histórico de Alterações</DialogTitle>
            <DialogDescription>
              Veja o histórico de alterações deste bloco de taxas
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 max-h-[400px] overflow-y-auto">
            {blockHistory.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Nenhum histórico encontrado.
              </p>
            ) : (
              <div className="space-y-4">
                {blockHistory.map((history) => (
                  <div key={history.id} className="border rounded-md p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{history.action}</p>
                        <p className="text-sm text-muted-foreground">{history.details}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(history.created_at)}
                      </div>
                    </div>
                    <div className="mt-2 text-xs">
                      <span className="text-muted-foreground">Por: </span>
                      <span>{history.user}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowHistoryDialog(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Fees;
