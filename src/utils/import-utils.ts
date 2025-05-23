
/**
 * Utility functions for helping with imports
 * This file can be used to centralize import-related helpers
 */

/**
 * Helper function to ensure UI components are imported correctly
 * Use this to debug problematic imports if needed
 */
export const getUIComponentPath = (componentName: string) => {
  return `@/components/ui/${componentName}`;
};

/**
 * Helper to track which components are being used
 * Can be used for debugging import issues
 */
export const trackComponentUsage = (componentName: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Component used: ${componentName}`);
  }
};
