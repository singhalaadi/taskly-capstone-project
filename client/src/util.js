import { useState, useEffect } from "react";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

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
    }, [key, value]); // Added 'key' to dependencies
    
    return [value, setValue];
};