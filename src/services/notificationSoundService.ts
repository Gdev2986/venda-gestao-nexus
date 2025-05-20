
import { NotificationType } from "@/types/notification.types";

// Map of notification types to sound file paths
const notificationSounds: Record<NotificationType | string, string> = {
  SYSTEM: "/sounds/notification-general.mp3",
  PAYMENT: "/sounds/notification-general.mp3",
  BALANCE: "/sounds/notification-general.mp3",
  MACHINE: "/sounds/notification-general.mp3",
  COMMISSION: "/sounds/notification-general.mp3", 
  GENERAL: "/sounds/notification-general.mp3",
  SALE: "/sounds/notification-general.mp3",
  SUPPORT: "/sounds/notification-support.mp3",
  ADMIN_NOTIFICATION: "/sounds/notification-general.mp3",
  LOGISTICS: "/sounds/notification-logistics.mp3"
};

// Cache audio objects to prevent recreation
const audioCache: Record<string, HTMLAudioElement> = {};

/**
 * Play notification sound based on notification type
 * @param type NotificationType
 * @param soundEnabled boolean flag to control if sound should be played
 */
export const playNotificationSoundIfEnabled = (type: NotificationType, soundEnabled: boolean = true) => {
  if (!soundEnabled) return;
  
  // When running on server, return early
  if (typeof window === 'undefined') return;
  
  try {
    const soundPath = notificationSounds[type] || notificationSounds.GENERAL;
    
    // Create or use cached audio object
    if (!audioCache[soundPath]) {
      audioCache[soundPath] = new Audio(soundPath);
    }
    
    // Play the sound
    const audio = audioCache[soundPath];
    audio.volume = 0.5; // Set volume to 50%
    audio.currentTime = 0; // Reset to start
    
    // Use promise to handle playback
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error('Error playing notification sound:', error);
      });
    }
  } catch (error) {
    console.error('Failed to play notification sound:', error);
  }
};

/**
 * Preload all notification sounds
 */
export const preloadNotificationSounds = () => {
  // When running on server, return early
  if (typeof window === 'undefined') return;
  
  try {
    // Create audio objects for each sound
    Object.values(notificationSounds).forEach(soundPath => {
      if (!audioCache[soundPath]) {
        audioCache[soundPath] = new Audio(soundPath);
      }
    });
  } catch (error) {
    console.error('Failed to preload notification sounds:', error);
  }
};
