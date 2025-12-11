import { createContext, type ReactNode, useEffect, useRef, useState } from 'react';

import { useConnectionHistory } from '../../hooks/useConnectionHistory';
import { signalRService } from '../../services/signalr/signalrService';
import type { Message } from '../../types/messaging';

interface SignalRContextData {
    isConnected: boolean;
    messages: Message[];
    connectionError: string;
    connectedUrl: string;
    connectedEvent: string;
    urls: string[];
    events: string[];
    connect: (url: string, eventName: string) => Promise<void>;
    disconnect: () => Promise<void>;
    sendMessage: (eventName: string, message: string) => Promise<void>;
}

// Context não é exportado - use o hook useSignalR para acessá-lo
const SignalRContext = createContext<SignalRContextData>({} as SignalRContextData);

// Exporta o contexto apenas para uso interno no hook
export { SignalRContext };

interface SignalRProviderProps {
    children: ReactNode;
}

export function SignalRProvider({ children }: SignalRProviderProps) {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [connectionError, setConnectionError] = useState<string>('');
    const [connectedUrl, setConnectedUrl] = useState<string>('');
    const [connectedEvent, setConnectedEvent] = useState<string>('');
    const currentEventRef = useRef<string>('');

    const { urls, events, addUrl, addEvent } = useConnectionHistory();

    const handleNewMessage = (message: unknown) => {
        const content = typeof message === 'object' ? JSON.stringify(message) : String(message);
        setMessages((prev) => [...prev, { timestamp: new Date(), content }]);
    };

    const connect = async (url: string, eventName: string) => {
        try {
            setConnectionError('');
            await signalRService.startConnection(url);

            signalRService.on(eventName, handleNewMessage);

            currentEventRef.current = eventName;
            setIsConnected(true);
            setConnectedUrl(url);
            setConnectedEvent(eventName);
            addUrl(url);
            addEvent(eventName);
            console.log('Conexão estabelecida com sucesso!');
        } catch (error) {
            console.error('Erro ao conectar:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao tentar conectar';
            setConnectionError(errorMessage);
            setTimeout(() => setConnectionError(''), 10000);
        }
    };

    const disconnect = async () => {
        try {
            if (currentEventRef.current) {
                signalRService.off(currentEventRef.current);
            }
            await signalRService.stopConnection();
            setIsConnected(false);
            setConnectedUrl('');
            setConnectedEvent('');
            currentEventRef.current = '';
            console.log('Conexão encerrada');
        } catch (error) {
            console.error('Erro ao desconectar:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            setMessages((prev) => [...prev, { timestamp: new Date(), content: `✗ Erro ao desconectar: ${errorMessage}` }]);
        }
    };

    const sendMessage = async (eventName: string, message: string) => {
        try {
            let parsedMessage;
            try {
                parsedMessage = JSON.parse(message);
            } catch {
                parsedMessage = message;
            }

            await signalRService.invoke(eventName, parsedMessage);
            addEvent(eventName);
            setMessages((prev) => [...prev, { timestamp: new Date(), content: `➤ Enviado para "${eventName}": ${message}` }]);
            console.log(`Mensagem enviada para método "${eventName}":`, parsedMessage);
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
            setMessages((prev) => [...prev, { timestamp: new Date(), content: `✗ Erro ao enviar mensagem: ${errorMsg}` }]);
            if (errorMsg.includes('Method does not exist')) {
                alert(`⚠️ Método "${eventName}" não existe no servidor!\n\nVerifique se:\n1. O nome do método está correto\n2. O método existe no Hub do servidor\n3. A assinatura do método está correta`);
            }
        }
    };

    useEffect(() => {
        return () => {
            disconnect();
        };
    }, []);

    return (
        <SignalRContext.Provider
            value={{
                isConnected,
                messages,
                connectionError,
                connectedUrl,
                connectedEvent,
                urls,
                events,
                connect,
                disconnect,
                sendMessage,
            }}
        >
            {children}
        </SignalRContext.Provider>
    );
}