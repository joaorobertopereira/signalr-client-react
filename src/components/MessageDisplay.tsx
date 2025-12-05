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
  ulid?: string;
  status?: string;
  message?: string;
  isBiometricValid?: boolean;
  [key: string]: any;
}

type MessageType = 'status' | 'biometric' | 'generic';

export function MessageDisplay({ messages, isConnected, connectedUrl, connectedEvent, connectionError }: MessageDisplayProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const parseMessage = (content: string): ParsedMessage | null => {
    try {
      console.log('Tentando fazer parse da mensagem:', content);
      let parsed = JSON.parse(content);

      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }

      // Validar se tem ulid (obrigatório)
      if (parsed.ulid && parsed.message) {
        return parsed;
      }
      return null;
    } catch (error) {
      console.log('Erro ao fazer parse da mensagem:', error);
      console.log('Conteúdo recebido:', content);
      return null;
    }
  };

  const getMessageType = (message: ParsedMessage): MessageType => {
    if (message.status) return 'status';
    if (message.isBiometricValid !== undefined) return 'biometric';
    return 'generic';
  };

  const getStatusClass = (message: ParsedMessage): string => {
    const messageType = getMessageType(message);

    if (messageType === 'status') {
      const statusLower = message.status!.toLowerCase().trim();
      console.log('Status recebido:', message.status, '| Lowercase:', statusLower);

      if (statusLower === 'aprovado') return 'status-aprovado';
      if (statusLower === 'reprovado' || statusLower === 'rejeitado') return 'status-reprovado';
      if (statusLower === 'pendente') return 'status-pendente';

      console.warn('Status não reconhecido, usando vermelho como padrão:', message.status);
      return 'status-reprovado';
    }

    if (messageType === 'biometric') {
      return message.isBiometricValid ? 'status-aprovado' : 'status-reprovado';
    }

    return 'status-reprovado';
  };

  const renderMessageContent = (message: ParsedMessage, messageType: MessageType) => {
    const commonFields = (
      <>
        <div className="card-field">
          <span className="field-label">ulid:</span>
          <span className="field-value">{message.ulid}</span>
        </div>
      </>
    );

    if (messageType === 'status') {
      return (
        <>
          {commonFields}
          <div className="card-field">
            <span className="field-label">Status:</span>
            <span className="field-value status-badge">{message.status}</span>
          </div>
          <div className="card-field">
            <span className="field-label">Message:</span>
            <span className="field-value">{message.message}</span>
          </div>
        </>
      );
    }

    if (messageType === 'biometric') {
      return (
        <>
          {commonFields}
          <div className="card-field">
            <span className="field-label">Biometria Válida:</span>
            <span className={`field-value status-badge ${message.isBiometricValid ? 'biometric-valid' : 'biometric-invalid'}`}>
              {message.isBiometricValid ? '✓ Sim' : '✗ Não'}
            </span>
          </div>
          <div className="card-field">
            <span className="field-label">Message:</span>
            <span className="field-value">{message.message}</span>
          </div>
        </>
      );
    }

    // Exibir todos os campos para tipo genérico
    return (
      <>
        {commonFields}
        {Object.entries(message).map(([key, value]) => {
          if (key === 'ulid' || key === 'message') return null;
          return (
            <div key={key} className="card-field">
              <span className="field-label">{key}:</span>
              <span className="field-value">{String(value)}</span>
            </div>
          );
        })}
        <div className="card-field">
          <span className="field-label">Message:</span>
          <span className="field-value">{message.message}</span>
        </div>
      </>
    );
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
              const messageType = getMessageType(parsedMessage);
              return (
                <div key={index} className={`message-card ${getStatusClass(parsedMessage)}`}>
                  <div className="message-timestamp">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                  <div className="card-content">
                    {renderMessageContent(parsedMessage, messageType)}
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
