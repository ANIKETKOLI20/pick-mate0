import { useState } from "react";

export function useLocalStorage(key, defaultValue) {
    
  // Retrieve stored value or use default if none exists
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error("Error reading localStorage", error);
      return defaultValue;
    }
  });

  // Update the localStorage and the state when the value changes
  const setValue = (value) => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  };

  return [storedValue, setValue];
}
