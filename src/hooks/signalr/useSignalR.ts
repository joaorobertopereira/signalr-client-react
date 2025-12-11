// Arquivo: src/hooks/signalr/useSignalR.ts
import { useContext } from 'react';
import { SignalRContext } from '../../contexts/SignalRContext';

export function useSignalR() {
  const context = useContext(SignalRContext);

  if (!context) {
    throw new Error('useSignalR deve ser usado dentro de um SignalRProvider');
  }

  return context;
}

// Criado em 11/12/2025 por IA.
