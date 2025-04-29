
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  errorMessage: string;
  onRetry: () => void;
}

const ErrorState = ({ errorMessage, onRetry }: ErrorStateProps) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erro</AlertTitle>
      <AlertDescription>{errorMessage}</AlertDescription>
      <Button onClick={onRetry} variant="outline" className="mt-2">Tentar novamente</Button>
    </Alert>
  );
};

export default ErrorState;
