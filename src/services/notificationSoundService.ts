
import { NotificationType } from "@/types/notification.types";

// Função para reproduzir som com base no tipo de notificação
export const playNotificationSoundIfEnabled = (
  type: NotificationType,
  soundEnabled: boolean
) => {
  if (!soundEnabled) return;

  try {
    const audio = new Audio();
    
    // Definir sons diferentes para diferentes tipos de notificações
    switch (type) {
      case NotificationType.PAYMENT:
        audio.src = "/sounds/payment-notification.mp3";
        break;
      case NotificationType.SYSTEM:
        audio.src = "/sounds/system-notification.mp3";
        break;
      case NotificationType.MACHINE:
        audio.src = "/sounds/machine-notification.mp3";
        break;
      default:
        audio.src = "/sounds/notification.mp3";
        break;
    }
    
    // Reproduzir o som
    audio.play().catch(error => {
      // Erros de autoplay são comuns devido a políticas dos navegadores
      console.error("Error playing notification sound:", error);
    });
  } catch (error) {
    console.error("Failed to play notification sound:", error);
  }
};
