
import { useAvailableMachines } from "@/hooks/use-available-machines";
import { Loader2 } from "lucide-react";

interface MachineSelectionFieldProps {
  selectedMachines: string[];
  setSelectedMachines: (machines: string[]) => void;
}

const MachineSelectionField = ({ 
  selectedMachines, 
  setSelectedMachines 
}: MachineSelectionFieldProps) => {
  const { machines, isLoading: isLoadingMachines } = useAvailableMachines();

  const handleMachineSelection = (machineId: string) => {
    setSelectedMachines((prev: string[]) => {
      if (prev.includes(machineId)) {
        return prev.filter((id) => id !== machineId);
      } else {
        return [...prev, machineId];
      }
    });
  };

  return (
    <div className="border rounded p-3 space-y-2">
      <p className="text-sm text-gray-500">Selecione as máquinas para este cliente:</p>
      {isLoadingMachines ? (
        <div className="flex justify-center p-4">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : machines.length === 0 ? (
        <p className="text-sm text-center py-4 text-muted-foreground">
          Não há máquinas disponíveis para associação.
        </p>
      ) : (
        <div className="h-[200px] overflow-y-auto space-y-2">
          {machines.map((machine) => (
            <div key={machine.id} className="flex items-center gap-2 p-2 hover:bg-muted rounded">
              <input
                type="checkbox"
                id={`machine-${machine.id}`}
                checked={selectedMachines.includes(machine.id)}
                onChange={() => handleMachineSelection(machine.id)}
                className="h-4 w-4 rounded"
              />
              <label htmlFor={`machine-${machine.id}`} className="flex-1 text-sm cursor-pointer">
                {machine.serial_number} ({machine.model})
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MachineSelectionField;
