
import { Spinner } from "@/components/ui/spinner";

interface AccessCheckingStateProps {
  message?: string;
}

const AccessCheckingState = ({ message = "Verificando permissões..." }: AccessCheckingStateProps) => {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="flex flex-col items-center">
        <Spinner size="lg" />
        <p className="mt-4">{message}</p>
      </div>
    </div>
  );
};

export default AccessCheckingState;
