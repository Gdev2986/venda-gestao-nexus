
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ErrorStateProps {
  errorMessage: string;
  onRetry: () => void;
}

const ErrorState = ({ errorMessage, onRetry }: ErrorStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <Alert variant="destructive" className="mb-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <div className="ml-3 flex-1">
            <AlertTitle className="text-lg font-semibold mb-1">Erro</AlertTitle>
            <AlertDescription className="text-sm">{errorMessage}</AlertDescription>
            <Button 
              onClick={onRetry} 
              variant="outline" 
              size="sm"
              className="mt-2 bg-background hover:bg-background/80"
            >
              Tentar novamente
            </Button>
          </div>
        </div>
      </Alert>
    </motion.div>
  );
};

export default ErrorState;
