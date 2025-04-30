
// Use sessionStorage instead of localStorage for better session isolation

export const setAuthData = (key: string, value: any): void => {
  try {
    sessionStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving auth data for key ${key}:`, error);
  }
};

export const getAuthData = (key: string): any => {
  try {
    const item = sessionStorage.getItem(key);
    if (!item) return null;
    
    try {
      // Try to parse as JSON
      return JSON.parse(item);
    } catch {
      // If parsing fails, return as is (likely a string)
      return item;
    }
  } catch (error) {
    console.error(`Error retrieving auth data for key ${key}:`, error);
    return null;
  }
};

export const clearAuthData = (): void => {
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error("Error clearing auth data:", error);
  }
};
