import { useState } from 'react';
import './MessageSender.css';

interface MessageSenderProps {
  onSend: (eventName: string, message: string) => void;
  isConnected: boolean;
  eventHistory: string[];
}

export function MessageSender({ onSend, isConnected, eventHistory }: MessageSenderProps) {
  const [eventName, setEventName] = useState('SendMessage');
  const [message, setMessage] = useState('');
  const [showEventHistory, setShowEventHistory] = useState(false);

  const handleSend = () => {
    if (eventName.trim() && message.trim()) {
      onSend(eventName.trim(), message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="message-sender">
      <h2>Enviar Mensagem</h2>
      <div className="form-group">
        <label htmlFor="sendEventName">Nome do Evento:</label>
        <div className="input-with-dropdown">
          <input
            id="sendEventName"
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            onFocus={() => setShowEventHistory(true)}
            onBlur={() => setTimeout(() => setShowEventHistory(false), 200)}
            disabled={!isConnected}
            placeholder="SendMessage"
          />
          {showEventHistory && eventHistory.length > 0 && (
            <div className="history-dropdown">
              {eventHistory.map((historicEvent, index) => (
                <div
                  key={index}
                  className="history-item"
                  onClick={() => {
                    setEventName(historicEvent);
                    setShowEventHistory(false);
                  }}
                >
                  {historicEvent}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="message">Mensagem:</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!isConnected}
          placeholder="Digite sua mensagem aqui..."
          rows={4}
        />
      </div>
      <button
        onClick={handleSend}
        disabled={!isConnected || !eventName.trim() || !message.trim()}
        className="btn-send"
      >
        Enviar
      </button>
      {!isConnected && (
        <div className="warning">Conecte-se primeiro para enviar mensagens</div>
      )}
    </div>
  );
}
