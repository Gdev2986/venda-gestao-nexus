
import { PixKey } from "@/types";

export interface PixKeysManagerProps {
  pixKeys: PixKey[];
  isLoading: boolean;
  onAdd: (newKey: Partial<PixKey>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}
