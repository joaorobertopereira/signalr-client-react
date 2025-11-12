import { useState, useEffect } from 'react';

interface ConnectionHistory {
  urls: string[];
  events: string[];
}

const STORAGE_KEY = 'signalr-connection-history';
const MAX_HISTORY_ITEMS = 10;

export function useConnectionHistory() {
  const [history, setHistory] = useState<ConnectionHistory>({
    urls: [],
    events: [],
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
      }
    }
  }, []);

  const addUrl = (url: string) => {
    if (!url.trim()) return;

    setHistory((prev) => {
      const filtered = prev.urls.filter((u) => u !== url);
      const newUrls = [url, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      
      const newHistory = {
        ...prev,
        urls: newUrls,
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const addEvent = (event: string) => {
    if (!event.trim()) return;

    setHistory((prev) => {
      const filtered = prev.events.filter((e) => e !== event);
      const newEvents = [event, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      
      const newHistory = {
        ...prev,
        events: newEvents,
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory({
      urls: [],
      events: [],
    });
  };

  return {
    urls: history.urls,
    events: history.events,
    addUrl,
    addEvent,
    clearHistory,
  };
}
