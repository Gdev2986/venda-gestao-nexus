
import { NotificationType } from "@/types/notification.types";

const NOTIFICATION_SOUNDS = {
  [NotificationType.GENERAL]: "/sounds/notification-general.mp3",
  [NotificationType.SYSTEM]: "/sounds/notification-general.mp3",
  [NotificationType.PAYMENT]: "/sounds/notification-general.mp3",
  [NotificationType.BALANCE]: "/sounds/notification-general.mp3",
  [NotificationType.MACHINE]: "/sounds/notification-general.mp3",
  [NotificationType.COMMISSION]: "/sounds/notification-general.mp3",
  [NotificationType.SALE]: "/sounds/notification-general.mp3",
  [NotificationType.SUPPORT]: "/sounds/notification-support.mp3",
  [NotificationType.LOGISTICS]: "/sounds/notification-logistics.mp3",
};

/**
 * Plays a notification sound based on the notification type if sounds are enabled
 */
export function playNotificationSoundIfEnabled(type: NotificationType, soundEnabled: boolean): void {
  if (!soundEnabled) return;
  
  try {
    const soundUrl = NOTIFICATION_SOUNDS[type] || NOTIFICATION_SOUNDS[NotificationType.GENERAL];
    const audio = new Audio(soundUrl);
    audio.volume = 0.5;
    audio.play().catch(error => {
      // Most browsers require a user interaction before playing audio
      console.log("Could not play notification sound:", error);
    });
  } catch (error) {
    console.error("Error playing notification sound:", error);
  }
}
