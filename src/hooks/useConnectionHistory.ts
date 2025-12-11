// Arquivo: src/hooks/useConnectionHistory.ts
import { useState, useCallback } from 'react';

const MAX_HISTORY_LENGTH = 10;

export function useConnectionHistory() {
    const [urls, setUrls] = useState<string[]>([]);
    const [events, setEvents] = useState<string[]>([]);

    const addHistoryItem = useCallback((item: string, setHistory: React.Dispatch<React.SetStateAction<string[]>>) => {
        setHistory((prev) => {
            const lowercasedItem = item.toLowerCase();
            const filteredHistory = prev.filter((i) => i.toLowerCase() !== lowercasedItem);
            const newHistory = [item, ...filteredHistory];
            return newHistory.slice(0, MAX_HISTORY_LENGTH);
        });
    }, []);

    const addUrl = useCallback((url: string) => {
        addHistoryItem(url, setUrls);
    }, [addHistoryItem]);

    const addEvent = useCallback((eventName: string) => {
        addHistoryItem(eventName, setEvents);
    }, [addHistoryItem]);

    return { urls, events, addUrl, addEvent };
}

