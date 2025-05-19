
import { NotificationType } from "@/types/notification.types";

// Map notification types to their respective sound files
export const notificationSounds = {
  [NotificationType.SYSTEM]: "/sounds/notification-system.mp3",
  [NotificationType.PAYMENT]: "/sounds/notification-payment.mp3",
  [NotificationType.BALANCE]: "/sounds/notification-balance.mp3",
  [NotificationType.MACHINE]: "/sounds/notification-machine.mp3",
  [NotificationType.COMMISSION]: "/sounds/notification-commission.mp3",
  [NotificationType.GENERAL]: "/sounds/notification-general.mp3",
  [NotificationType.SALE]: "/sounds/notification-sale.mp3",
  [NotificationType.SUPPORT]: "/sounds/notification-support.mp3",
  [NotificationType.ADMIN_NOTIFICATION]: "/sounds/notification-admin.mp3",
  [NotificationType.LOGISTICS]: "/sounds/notification-logistics.mp3",
};

// Default sound fallback if type doesn't match
const defaultSound = "/sounds/notification-general.mp3";

// Play notification sound based on notification type
export const playNotificationSound = (type: NotificationType): void => {
  try {
    const soundPath = notificationSounds[type] || defaultSound;
    const audio = new Audio(soundPath);
    audio.volume = 0.5; // Set volume to 50%
    audio.play().catch((error) => {
      console.log("Error playing notification sound:", error);
    });
  } catch (error) {
    console.error("Failed to play notification sound:", error);
  }
};

// Check user preferences before playing sound
export const playNotificationSoundIfEnabled = (
  type: NotificationType,
  soundEnabled = true
): void => {
  if (soundEnabled) {
    playNotificationSound(type);
  }
};
