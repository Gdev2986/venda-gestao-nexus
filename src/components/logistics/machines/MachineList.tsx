
import { useState } from "react";
import { Filter } from "lucide-react";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import MachinesAllTab from "./MachinesAllTab";

const MachineList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modelFilter, setModelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <PageWrapper>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1 mr-4">
            <Input
              placeholder="Buscar por serial, modelo ou cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        {showFilters && (
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <h3 className="text-sm font-medium">Filtros</h3>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                  <Select value={modelFilter} onValueChange={setModelFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Modelos</SelectLabel>
                        <SelectItem value="all">Todos os modelos</SelectItem>
                        <SelectItem value="Terminal Pro">Terminal Pro</SelectItem>
                        <SelectItem value="Terminal Mini">Terminal Mini</SelectItem>
                        <SelectItem value="Terminal Standard">Terminal Standard</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-1/2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        <SelectItem value="all">Todos os status</SelectItem>
                        <SelectItem value="ACTIVE">Ativas</SelectItem>
                        <SelectItem value="INACTIVE">Inativas</SelectItem>
                        <SelectItem value="MAINTENANCE">Manutenção</SelectItem>
                        <SelectItem value="STOCK">Estoque</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <MachinesAllTab 
        searchTerm={searchTerm}
        modelFilter={modelFilter}
        statusFilter={statusFilter}
      />
    </PageWrapper>
  );
};

export default MachineList;
