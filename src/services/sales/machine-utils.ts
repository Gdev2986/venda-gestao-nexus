
import { supabase } from "@/integrations/supabase/client";
import { MachineStatus } from "@/types/machine.types";

// Optimized function to batch check and create machines with better error handling
export const ensureMachinesExist = async (terminals: string[]): Promise<Map<string, string>> => {
  try {
    console.log(`Checking/creating machines for ${terminals.length} unique terminals`);
    
    // Verificar se há terminais para processar
    if (terminals.length === 0) {
      console.log('Nenhum terminal para processar');
      return new Map();
    }
    
    // First, get all existing machines for the terminals in one query
    const { data: existingMachines, error: findError } = await supabase
      .from('machines')
      .select('id, serial_number')
      .in('serial_number', terminals);

    if (findError) {
      console.error('Error finding existing machines:', findError);
      throw findError;
    }

    // Create a map of existing machines
    const existingMachinesMap = new Map<string, string>();
    existingMachines?.forEach(machine => {
      existingMachinesMap.set(machine.serial_number, machine.id);
    });

    // Find terminals that don't have machines yet
    const missingTerminals = terminals.filter(terminal => 
      !existingMachinesMap.has(terminal)
    );

    console.log(`Found ${existingMachines?.length || 0} existing machines, need to create ${missingTerminals.length} new ones`);

    // Create missing machines in batch if any are missing
    if (missingTerminals.length > 0) {
      const newMachinesData = missingTerminals.map(terminal => ({
        serial_number: terminal,
        model: 'PagBank',
        status: MachineStatus.STOCK,
        notes: `Criado automaticamente durante importação de vendas em ${new Date().toLocaleDateString('pt-BR')}`
      }));

      console.log('Creating new machines:', newMachinesData);

      const { data: newMachines, error: createError } = await supabase
        .from('machines')
        .insert(newMachinesData)
        .select('id, serial_number');

      if (createError) {
        console.error('Error creating new machines:', createError);
        throw createError;
      }

      // Add new machines to the map
      newMachines?.forEach(machine => {
        existingMachinesMap.set(machine.serial_number, machine.id);
      });

      console.log(`Successfully created ${newMachines?.length || 0} new machines`);
    }

    // Verificar se todos os terminais têm máquinas associadas
    const missingAfterCreation = terminals.filter(terminal => 
      !existingMachinesMap.has(terminal)
    );

    if (missingAfterCreation.length > 0) {
      throw new Error(`Failed to create machines for terminals: ${missingAfterCreation.join(', ')}`);
    }

    console.log(`All machines verified. Total: ${existingMachinesMap.size} machines`);
    return existingMachinesMap;

  } catch (error) {
    console.error(`Error ensuring machines exist:`, error);
    throw new Error(`Falha ao verificar/criar máquinas: ${error instanceof Error ? error.message : String(error)}`);
  }
};
