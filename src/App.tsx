import { useState, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { ConnectionControl } from './components/ConnectionControl';
import { MessageDisplay } from './components/MessageDisplay';
import { MessageSender } from './components/MessageSender';
import { useConnectionHistory } from './hooks/useConnectionHistory';
import './App.css';

interface Message {
  timestamp: Date;
  content: string;
}

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectedUrl, setConnectedUrl] = useState<string>('');
  const [connectedEvent, setConnectedEvent] = useState<string>('');
  const [connectionError, setConnectionError] = useState<string>('');
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const currentEventRef = useRef<string>('');
  const { urls, events, addUrl, addEvent } = useConnectionHistory();

  const handleConnect = async (url: string, eventName: string) => {
    try {
      // Limpa erro anterior
      setConnectionError('');
      
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(url)
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      connection.on(eventName, (message: string) => {
        setMessages((prev) => [
          ...prev,
          {
            timestamp: new Date(),
            content: message,
          },
        ]);
      });

      await connection.start();
      
      connectionRef.current = connection;
      currentEventRef.current = eventName;
      setIsConnected(true);
      setConnectedUrl(url);
      setConnectedEvent(eventName);
      
      // Adiciona ao histórico apenas quando conecta com sucesso
      addUrl(url);
      addEvent(eventName);

      console.log('Conexão estabelecida com sucesso!');
    } catch (error) {
      console.error('Erro ao conectar:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao tentar conectar';
      setConnectionError(errorMessage);
      
      // Remove o erro após 10 segundos
      setTimeout(() => {
        setConnectionError('');
      }, 10000);
    }
  };

  const handleDisconnect = async () => {
    try {
      if (connectionRef.current) {
        await connectionRef.current.stop();
        connectionRef.current = null;
        currentEventRef.current = '';
        setIsConnected(false);
        setConnectedUrl('');
        setConnectedEvent('');

        console.log('Conexão encerrada');
      }
    } catch (error) {
      console.error('Erro ao desconectar:', error);
      setMessages((prev) => [
        ...prev,
        {
          timestamp: new Date(),
          content: `✗ Erro ao desconectar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        },
      ]);
    }
  };

  const handleSendMessage = async (eventName: string, message: string) => {
    try {
      if (connectionRef.current && isConnected) {
        await connectionRef.current.invoke(eventName, message);
        
        setMessages((prev) => [
          ...prev,
          {
            timestamp: new Date(),
            content: `➤ Enviado para "${eventName}": ${message}`,
          },
        ]);

        console.log(`Mensagem enviada: ${message}`);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setMessages((prev) => [
        ...prev,
        {
          timestamp: new Date(),
          content: `✗ Erro ao enviar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        },
      ]);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>SignalR Application</h1>
        <p>Aplicação de teste para conexão SignalR</p>
      </header>

      <main className="app-main">
        <div className="left-panel">
          <ConnectionControl
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            isConnected={isConnected}
            urlHistory={urls}
            eventHistory={events}
          />
          
          <MessageSender
            onSend={handleSendMessage}
            isConnected={isConnected}
            eventHistory={events}
          />
        </div>

        <div className="right-panel">
          <MessageDisplay 
            messages={messages}
            isConnected={isConnected}
            connectedUrl={connectedUrl}
            connectedEvent={connectedEvent}
            connectionError={connectionError}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
