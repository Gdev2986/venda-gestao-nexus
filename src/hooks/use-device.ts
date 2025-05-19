
import { useState, useEffect } from 'react';

type DeviceType = 'mobile' | 'tablet' | 'desktop';
type Orientation = 'portrait' | 'landscape';
type OS = 'iOS' | 'Android' | 'Windows' | 'macOS' | 'Linux' | 'unknown';

interface DeviceInfo {
  type: DeviceType;
  orientation: Orientation;
  os: OS;
  isTouchDevice: boolean;
  isStandalone: boolean; // PWA standalone mode
  screenWidth: number;
  screenHeight: number;
}

export function useDevice() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    type: 'desktop',
    orientation: 'landscape',
    os: 'unknown',
    isTouchDevice: false,
    isStandalone: false,
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
    screenHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    // Function to detect device type
    const getDeviceType = (): DeviceType => {
      const width = window.innerWidth;
      if (width < 768) return 'mobile';
      if (width < 1024) return 'tablet';
      return 'desktop';
    };

    // Function to detect orientation
    const getOrientation = (): Orientation => {
      return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    };

    // Function to detect OS
    const getOS = (): OS => {
      const userAgent = navigator.userAgent;
      if (/iPhone|iPad|iPod/.test(userAgent)) return 'iOS';
      if (/Android/.test(userAgent)) return 'Android';
      if (/Windows/.test(userAgent)) return 'Windows';
      if (/Mac OS/.test(userAgent)) return 'macOS';
      if (/Linux/.test(userAgent)) return 'Linux';
      return 'unknown';
    };

    // Function to check if device supports touch
    const isTouchDevice = (): boolean => {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    };

    // Function to check if app is in standalone mode (PWA)
    const isStandalone = (): boolean => {
      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true
      );
    };

    // Update device info
    const updateDeviceInfo = () => {
      setDeviceInfo({
        type: getDeviceType(),
        orientation: getOrientation(),
        os: getOS(),
        isTouchDevice: isTouchDevice(),
        isStandalone: isStandalone(),
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
      });
    };

    // Initial detection
    updateDeviceInfo();

    // Listen for resize events
    window.addEventListener('resize', updateDeviceInfo);

    // Listen for orientation changes
    window.addEventListener('orientationchange', updateDeviceInfo);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  // Provide device-specific style helpers
  const getDeviceSpecificStyles = () => {
    const { type, os } = deviceInfo;
    
    // Base styles for all devices
    const baseStyles = {
      touchTarget: type === 'mobile' || type === 'tablet' ? 'min-h-12' : 'min-h-9',
      fontSize: type === 'mobile' ? 'text-sm' : 'text-base',
      spacing: type === 'mobile' ? 'p-2' : 'p-4',
    };
    
    // OS-specific styles
    if (os === 'iOS') {
      return {
        ...baseStyles,
        // iOS specific styles (e.g., notch/dynamic island considerations)
        safeAreaTop: 'pt-10',
        safeAreaBottom: 'pb-6',
      };
    }
    
    if (os === 'Android') {
      return {
        ...baseStyles,
        // Android specific styles
        safeAreaTop: 'pt-6',
        safeAreaBottom: 'pb-4',
      };
    }
    
    return baseStyles;
  };

  return {
    ...deviceInfo,
    styles: getDeviceSpecificStyles(),
    // Helper functions for device detection
    isMobile: deviceInfo.type === 'mobile',
    isTablet: deviceInfo.type === 'tablet',
    isDesktop: deviceInfo.type === 'desktop',
    isIOS: deviceInfo.os === 'iOS',
    isAndroid: deviceInfo.os === 'Android',
  };
}
