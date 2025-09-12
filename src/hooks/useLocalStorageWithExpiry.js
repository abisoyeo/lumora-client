import { useState, useEffect } from "react";

function setItemWithExpiry(key, value, ttl) {
  const now = new Date();
  const item = {
    value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

function getItemWithExpiry(key) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  try {
    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  } catch {
    return null;
  }
}

export function useLocalStorageWithExpiry(key, initialValue, ttl) {
  const [storedValue, setStoredValue] = useState(() => {
    const item = getItemWithExpiry(key);
    if (item !== null) return item;
    setItemWithExpiry(key, initialValue, ttl);
    return initialValue;
  });

  useEffect(() => {
    setItemWithExpiry(key, storedValue, ttl);

    const timer = setTimeout(() => {
      localStorage.removeItem(key);
      setStoredValue(initialValue);
    }, ttl);

    return () => clearTimeout(timer);
  }, [storedValue, key, ttl, initialValue]);

  return [storedValue, setStoredValue];
}
