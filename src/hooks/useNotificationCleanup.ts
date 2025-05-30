
import { useEffect } from "react";
import { cleanExpiredNotifications } from "@/services/notificationCleanupService";

// Hook para executar limpeza automática periodicamente
export const useNotificationCleanup = (intervalMinutes: number = 60) => {
  useEffect(() => {
    // Executar limpeza imediatamente
    cleanExpiredNotifications().catch(console.error);
    
    // Configurar interval para executar periodicamente
    const interval = setInterval(() => {
      cleanExpiredNotifications().catch(console.error);
    }, intervalMinutes * 60 * 1000); // Converter minutos para milissegundos
    
    return () => clearInterval(interval);
  }, [intervalMinutes]);
};
