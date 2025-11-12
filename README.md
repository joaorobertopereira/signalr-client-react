# SignalR React Client# React + TypeScript + Vite



Aplicação frontend em React para testes de conexão e comunicação com SignalR.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



## 🚀 FuncionalidadesCurrently, two official plugins are available:



- **Conexão Configurável**: Informe a URL do hub SignalR e o nome do evento para escutar- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- **Controle de Conexão**: Botões para conectar e desconectar do servidor SignalR- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- **Visualização de Mensagens**: Componente que exibe todas as mensagens recebidas em tempo real

- **Envio de Mensagens**: Componente para enviar mensagens string para eventos específicos## React Compiler

- **Interface Intuitiva**: Design limpo e responsivo com feedback visual do status da conexão

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## 📋 Pré-requisitos

## Expanding the ESLint configuration

- Node.js (versão 16 ou superior)

- npm ou yarnIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

- Servidor SignalR rodando (backend)

```js

## 🔧 Instalaçãoexport default defineConfig([

  globalIgnores(['dist']),

1. Navegue até a pasta do projeto:  {

```bash    files: ['**/*.{ts,tsx}'],

cd signalr-react-app    extends: [

```      // Other configs...



2. As dependências já foram instaladas, mas caso precise reinstalar:      // Remove tseslint.configs.recommended and replace with this

```bash      tseslint.configs.recommendedTypeChecked,

npm install      // Alternatively, use this for stricter rules

```      tseslint.configs.strictTypeChecked,

      // Optionally, add this for stylistic rules

## ▶️ Executar a Aplicação      tseslint.configs.stylisticTypeChecked,



Para iniciar o servidor de desenvolvimento:      // Other configs...

    ],

```bash    languageOptions: {

npm run dev      parserOptions: {

```        project: ['./tsconfig.node.json', './tsconfig.app.json'],

        tsconfigRootDir: import.meta.dirname,

A aplicação estará disponível em `http://localhost:5173`      },

      // other options...

## 📖 Como Usar    },

  },

### 1. Conectar ao SignalR])

```

1. Na seção **Conexão SignalR**, informe:

   - **URL do Hub**: A URL do seu servidor SignalR (ex: `http://localhost:5000/hub`)You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

   - **Nome do Evento**: O nome do evento que você deseja escutar (ex: `ReceiveMessage`)

```js

2. Clique no botão **Conectar**// eslint.config.js

import reactX from 'eslint-plugin-react-x'

3. O status mudará para "Conectado" e você verá uma mensagem de confirmaçãoimport reactDom from 'eslint-plugin-react-dom'



### 2. Visualizar Mensagensexport default defineConfig([

  globalIgnores(['dist']),

As mensagens recebidas do servidor aparecerão automaticamente no componente **Mensagens Recebidas**:  {

- Cada mensagem exibe o horário de recebimento    files: ['**/*.{ts,tsx}'],

- O scroll é automático para a mensagem mais recente    extends: [

- Mensagens de sistema (conexão, desconexão, erros) também são exibidas      // Other configs...

      // Enable lint rules for React

### 3. Enviar Mensagens      reactX.configs['recommended-typescript'],

      // Enable lint rules for React DOM

1. Na seção **Enviar Mensagem**:      reactDom.configs.recommended,

   - **Nome do Evento**: Informe o método/evento do servidor que receberá a mensagem (ex: `SendMessage`)    ],

   - **Mensagem**: Digite a mensagem em formato string    languageOptions: {

      parserOptions: {

2. Clique em **Enviar** ou pressione Enter        project: ['./tsconfig.node.json', './tsconfig.app.json'],

        tsconfigRootDir: import.meta.dirname,

3. A confirmação de envio aparecerá no painel de mensagens      },

      // other options...

### 4. Desconectar    },

  },

Clique no botão **Desconectar** para encerrar a conexão com o servidor.])

```

## 🏗️ Estrutura do Projeto

```
signalr-react-app/
├── src/
│   ├── components/
│   │   ├── ConnectionControl.tsx      # Controle de conexão
│   │   ├── ConnectionControl.css
│   │   ├── MessageDisplay.tsx         # Exibição de mensagens
│   │   ├── MessageDisplay.css
│   │   ├── MessageSender.tsx          # Envio de mensagens
│   │   └── MessageSender.css
│   ├── App.tsx                        # Componente principal
│   ├── App.css
│   └── main.tsx
├── package.json
└── README.md
```

## 🔌 Exemplo de Servidor SignalR (C#)

```csharp
public class ChatHub : Hub
{
    public async Task SendMessage(string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", message);
    }
}
```

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca para construção de interfaces
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **@microsoft/signalr** - Cliente SignalR para JavaScript/TypeScript

## 📝 Notas

- A aplicação usa reconexão automática (`withAutomaticReconnect()`)
- Logs de conexão aparecem no console do navegador
- Todas as mensagens são tratadas como strings
- A interface é responsiva e se adapta a diferentes tamanhos de tela

## 🐛 Troubleshooting

**Erro de conexão CORS:**
- Certifique-se de que o servidor SignalR está configurado para aceitar requisições do localhost:5173

**Não recebe mensagens:**
- Verifique se o nome do evento está correto
- Confirme que o servidor está enviando mensagens para o evento especificado

**Erro ao enviar mensagens:**
- Certifique-se de que o método existe no servidor
- Verifique se a conexão está ativa

## 📄 Licença

Este projeto é um exemplo de teste e pode ser usado livremente.
