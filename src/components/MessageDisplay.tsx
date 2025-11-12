import { useEffect, useRef } from 'react';
import './MessageDisplay.css';

interface Message {
  timestamp: Date;
  content: string;
}

interface MessageDisplayProps {
  messages: Message[];
  isConnected: boolean;
  connectedUrl: string;
  connectedEvent: string;
  connectionError: string;
}

interface ParsedMessage {
  customerId?: string;
  status?: string;
  message?: string;
}

export function MessageDisplay({ messages, isConnected, connectedUrl, connectedEvent, connectionError }: MessageDisplayProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const parseMessage = (content: string): ParsedMessage | null => {
    try {
      let parsed = JSON.parse(content);
      
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
      
      if (parsed.customerId && parsed.status && parsed.message) {
        return parsed;
      }
      return null;
    } catch (error) {
      console.log('Erro ao fazer parse da mensagem:', error);
      console.log('Conteúdo recebido:', content);
      return null;
    }
  };

  const getStatusClass = (status: string): string => {
    const statusLower = status.toLowerCase().trim();
    console.log('Status recebido:', status, '| Lowercase:', statusLower);
    
    if (statusLower === 'aprovado') return 'status-aprovado';
    if (statusLower === 'reprovado' || statusLower === 'rejeitado') return 'status-reprovado';
    if (statusLower === 'pendente') return 'status-pendente';
    
    // Default para vermelho se não reconhecer
    console.warn('Status não reconhecido, usando vermelho como padrão:', status);
    return 'status-reprovado';
  };

  return (
    <div className="message-display">
      <h2>Mensagens Recebidas</h2>
      
      {isConnected && (
        <div className="connection-status-card success">
          <div className="status-icon">✓</div>
          <div className="status-info">
            <div className="status-label">Host Conectado:</div>
            <div className="status-value">{connectedUrl}</div>
            <div className="status-label">Evento:</div>
            <div className="status-value">{connectedEvent}</div>
          </div>
        </div>
      )}

      {connectionError && (
        <div className="connection-status-card error">
          <div className="status-icon">✗</div>
          <div className="status-info">
            <div className="status-label">Erro ao Conectar:</div>
            <div className="status-value error-message">{connectionError}</div>
          </div>
        </div>
      )}
      
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">Nenhuma mensagem recebida ainda</div>
        ) : (
          messages.map((message, index) => {
            const parsedMessage = parseMessage(message.content);
            
            if (parsedMessage) {
              return (
                <div key={index} className={`message-card ${getStatusClass(parsedMessage.status!)}`}>
                  <div className="message-timestamp">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                  <div className="card-content">
                    <div className="card-field">
                      <span className="field-label">CustomerId:</span>
                      <span className="field-value">{parsedMessage.customerId}</span>
                    </div>
                    <div className="card-field">
                      <span className="field-label">Status:</span>
                      <span className="field-value status-badge">{parsedMessage.status}</span>
                    </div>
                    <div className="card-field">
                      <span className="field-label">Message:</span>
                      <span className="field-value">{parsedMessage.message}</span>
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={index} className="message">
                  <div className="message-timestamp">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                  <div className="message-content">{message.content}</div>
                </div>
              );
            }
          })
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
