// Arquivo: src/App.tsx
import { ConnectionControl } from './modules/connection/components/ConnectionControl';
import { MessageDisplay } from './modules/messaging/components/MessageDisplay';
import { MessageSender } from './modules/messaging/components/MessageSender';

import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>SignalR Application</h1>
        <p>Aplicação de teste para conexão SignalR</p>
      </header>

      <main className="app-main">
        <div className="left-panel">
          <ConnectionControl />
          <MessageSender />
        </div>
        <div className="right-panel">
          <MessageDisplay />
        </div>
      </main>
    </div>
  );
}

export default App;

// Criado em 11/12/2025 por IA.

