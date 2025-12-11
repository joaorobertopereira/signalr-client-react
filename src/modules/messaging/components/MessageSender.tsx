import { useState } from 'react';
import { useSignalR } from '../../../hooks/signalr/useSignalR';
import './MessageSender.css';

export function MessageSender() {
  const { isConnected, events, sendMessage } = useSignalR();
  const [eventName, setEventName] = useState('SendMessage');
  const [message, setMessage] = useState('');
  const [showEventHistory, setShowEventHistory] = useState(false);
  const [jsonError, setJsonError] = useState<string>('');

  const handleSend = () => {
    if (eventName.trim() && message.trim()) {
      // Validar se é JSON válido
      try {
        JSON.parse(message.trim());
        setJsonError('');
        sendMessage(eventName.trim(), message.trim());
        setMessage('');
      } catch (error) {
        setJsonError('JSON inválido! Verifique a sintaxe.' + (error instanceof Error ? error.message : ''));
      }
    }
  };

  const handleMessageChange = (value: string) => {
    setMessage(value);
    // Limpar erro quando o usuário começar a digitar
    if (jsonError) {
      setJsonError('');
    }
  };

  const insertExample = () => {
    const example = `{
  "customerId": "01K75AJ9ES6RMAYDPM9RZDZ5D8",
  "status": "Aprovado",
  "message": "Processamento concluído."
}`;
    setMessage(example);
    setJsonError('');
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
        <label htmlFor="sendEventName">Nome do Evento/Método:</label>
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
          {showEventHistory && events.length > 0 && (
            <div className="history-dropdown">
              {events.map((historicEvent, index) => (
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
        <div className="label-with-button">
          <label htmlFor="message">Mensagem (JSON):</label>
          <button
            type="button"
            onClick={insertExample}
            disabled={!isConnected}
            className="btn-example"
          >
            Inserir Exemplo
          </button>
        </div>
        <textarea
          id="message"
          value={message}
          onChange={(e) => handleMessageChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!isConnected}
          placeholder='{"ulid": "01K75AJ9ES6RMAYDPM9RZDZ5D8", "status": "Aprovado", "message": "Processamento concluído."}'
          rows={6}
          className={jsonError ? 'error' : ''}
        />
        {jsonError && <div className="json-error">{jsonError}</div>}
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

// Criado em 11/12/2025 por IA.

