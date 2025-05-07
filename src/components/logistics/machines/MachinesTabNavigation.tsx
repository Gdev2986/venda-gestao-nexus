
import { Server, Archive, Building2, BarChart4 } from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { PageWrapper } from "@/components/page/PageWrapper";
import MachinesAllTab from "./MachinesAllTab";
import MachinesStockTab from "./MachinesStockTab";
import MachinesClientsTab from "./MachinesClientsTab";
import MachinesStatsTab from "./MachinesStatsTab";

interface MachinesTabNavigationProps {
  defaultTab?: string;
}

const MachinesTabNavigation = ({ defaultTab = "all" }: MachinesTabNavigationProps) => {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-4">
        <TabsTrigger value="all" className="flex items-center gap-2">
          <Server size={16} />
          <span>Todas</span>
        </TabsTrigger>
        <TabsTrigger value="stock" className="flex items-center gap-2">
          <Archive size={16} />
          <span>Estoque</span>
        </TabsTrigger>
        <TabsTrigger value="clients" className="flex items-center gap-2">
          <Building2 size={16} />
          <span>Por Cliente</span>
        </TabsTrigger>
        <TabsTrigger value="stats" className="flex items-center gap-2">
          <BarChart4 size={16} />
          <span>Estatísticas</span>
        </TabsTrigger>
      </TabsList>
      
      {/* All Machines Tab */}
      <TabsContent value="all">
        <MachinesAllTab />
      </TabsContent>
      
      {/* Stock Tab */}
      <TabsContent value="stock">
        <PageWrapper>
          <MachinesStockTab />
        </PageWrapper>
      </TabsContent>
      
      {/* Client Machines Tab */}
      <TabsContent value="clients">
        <PageWrapper>
          <MachinesClientsTab />
        </PageWrapper>
      </TabsContent>
      
      {/* Statistics Tab */}
      <TabsContent value="stats">
        <MachinesStatsTab />
      </TabsContent>
    </Tabs>
  );
};

export default MachinesTabNavigation;
