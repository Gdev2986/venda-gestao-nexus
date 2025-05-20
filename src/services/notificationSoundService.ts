
import { NotificationType } from "@/types/notification.types";

// Map notification types to sound files
const notificationSounds: Record<NotificationType, string> = {
  SYSTEM: "/sounds/notification-general.mp3",
  PAYMENT: "/sounds/notification-general.mp3",
  BALANCE: "/sounds/notification-general.mp3",
  MACHINE: "/sounds/notification-logistics.mp3",
  COMMISSION: "/sounds/notification-general.mp3",
  GENERAL: "/sounds/notification-general.mp3",
  SALE: "/sounds/notification-general.mp3",
  SUPPORT: "/sounds/notification-support.mp3",
  ADMIN_NOTIFICATION: "/sounds/notification-general.mp3",
  LOGISTICS: "/sounds/notification-logistics.mp3"
};

// Play notification sound based on type if sound is enabled
export const playNotificationSoundIfEnabled = (type: NotificationType, soundEnabled: boolean) => {
  if (!soundEnabled) return;
  
  try {
    const soundFile = notificationSounds[type] || notificationSounds.GENERAL;
    const audio = new Audio(soundFile);
    audio.volume = 0.5; // Set volume to 50%
    audio.play().catch(error => {
      // Browsers may block autoplay without user interaction
      console.log("Sound playback blocked:", error);
    });
  } catch (error) {
    console.error("Error playing notification sound:", error);
  }
};
