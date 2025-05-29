
import { NotificationType } from "@/types/notification.types";

const soundFiles = {
  [NotificationType.GENERAL]: "/sounds/notification-general.mp3",
  [NotificationType.SUPPORT]: "/sounds/notification-support.mp3",
  [NotificationType.LOGISTICS]: "/sounds/notification-logistics.mp3",
  [NotificationType.PAYMENT]: "/sounds/notification-general.mp3",
  [NotificationType.PAYMENT_APPROVED]: "/sounds/notification-general.mp3",
  [NotificationType.PAYMENT_REJECTED]: "/sounds/notification-general.mp3",
  [NotificationType.PAYMENT_REQUEST]: "/sounds/notification-general.mp3",
  [NotificationType.SYSTEM]: "/sounds/notification-general.mp3",
  [NotificationType.MACHINE]: "/sounds/notification-general.mp3",
  [NotificationType.SALE]: "/sounds/notification-general.mp3",
  [NotificationType.COMMISSION]: "/sounds/notification-general.mp3",
  [NotificationType.BALANCE]: "/sounds/notification-general.mp3",
  [NotificationType.ADMIN_NOTIFICATION]: "/sounds/notification-general.mp3",
};

export const playNotificationSoundIfEnabled = (type: NotificationType, soundEnabled: boolean) => {
  if (!soundEnabled) return;
  
  try {
    const soundFile = soundFiles[type] || soundFiles[NotificationType.GENERAL];
    const audio = new Audio(soundFile);
    
    // Set volume to be less intrusive
    audio.volume = 0.5;
    
    audio.play().catch(error => {
      console.warn("Could not play notification sound:", error);
    });
  } catch (error) {
    console.warn("Error playing notification sound:", error);
  }
};
