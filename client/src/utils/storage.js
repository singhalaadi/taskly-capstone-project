import { useState, useEffect } from "react";

export const useLocalStorage = (key, defaultValue) => {
    const [value, setValue] = useState(() => {
        try {
            const currentValue = localStorage.getItem(key);
            return currentValue ? JSON.parse(currentValue) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    }, [key, value]);

    return [value, setValue];
};