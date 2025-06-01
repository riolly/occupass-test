import { useEffect, useState } from "react";

/**
 * Basic debounce hook for debouncing values
 * @param value - The value to debounce
 * @param delay - The debounce delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Comprehensive hook for debounced search with URL updates
 * @param initialValue - Initial value from URL params
 * @param onUpdate - Function to call when debounced value changes
 * @param delay - The debounce delay in milliseconds (default: 500)
 * @returns Object with local value, setter, and debounced value
 */
export function useDebouncedSearch<T>(
  initialValue: T,
  onUpdate: (value: T) => void,
  delay: number = 350
) {
  // Local state for immediate UI updates
  const [localValue, setLocalValue] = useState<T>(initialValue);

  // Debounced value
  const debouncedValue = useDebounce(localValue, delay);

  // Sync local state with URL params when they change
  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  // Update URL when debounced value changes
  useEffect(() => {
    if (debouncedValue !== initialValue) {
      onUpdate(debouncedValue);
    }
  }, [debouncedValue, initialValue, onUpdate]);

  return {
    value: localValue,
    setValue: setLocalValue,
    debouncedValue,
  };
}
