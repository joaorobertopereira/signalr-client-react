import { useState } from 'react';
import './ConnectionControl.css';

interface ConnectionControlProps {
  onConnect: (url: string, eventName: string) => void;
  onDisconnect: () => void;
  isConnected: boolean;
  urlHistory: string[];
  eventHistory: string[];
}

export function ConnectionControl({ onConnect, onDisconnect, isConnected, urlHistory, eventHistory }: ConnectionControlProps) {
  const [url, setUrl] = useState('http://localhost:5000/hub');
  const [eventName, setEventName] = useState('ReceiveMessage');
  const [showUrlHistory, setShowUrlHistory] = useState(false);
  const [showEventHistory, setShowEventHistory] = useState(false);

  const handleConnect = () => {
    if (url.trim() && eventName.trim()) {
      onConnect(url.trim(), eventName.trim());
    }
  };

  return (
    <div className="connection-control">
      <h2>Conexão SignalR</h2>
      <div className="form-group">
        <label htmlFor="url">URL do Hub:</label>
        <div className="input-with-dropdown">
          <input
            id="url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setShowUrlHistory(true)}
            onBlur={() => setTimeout(() => setShowUrlHistory(false), 200)}
            disabled={isConnected}
            placeholder="http://localhost:5000/hub"
          />
          {showUrlHistory && urlHistory.length > 0 && (
            <div className="history-dropdown">
              {urlHistory.map((historicUrl, index) => (
                <div
                  key={index}
                  className="history-item"
                  onClick={() => {
                    setUrl(historicUrl);
                    setShowUrlHistory(false);
                  }}
                >
                  {historicUrl}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="eventName">Nome do Evento:</label>
        <div className="input-with-dropdown">
          <input
            id="eventName"
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            onFocus={() => setShowEventHistory(true)}
            onBlur={() => setTimeout(() => setShowEventHistory(false), 200)}
            disabled={isConnected}
            placeholder="ReceiveMessage"
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
      <div className="button-group">
        <button 
          onClick={handleConnect} 
          disabled={isConnected || !url.trim() || !eventName.trim()}
          className="btn-connect"
        >
          Conectar
        </button>
        <button 
          onClick={onDisconnect} 
          disabled={!isConnected}
          className="btn-disconnect"
        >
          Desconectar
        </button>
      </div>
      <div className="status">
        Status: <span className={isConnected ? 'connected' : 'disconnected'}>
          {isConnected ? 'Conectado' : 'Desconectado'}
        </span>
      </div>
    </div>
  );
}
