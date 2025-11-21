# SignalR React App - Docker

## Como executar com Docker

### Usando o script PowerShell (Recomendado)
```powershell
.\docker-run.ps1
```

### Manualmente

1. **Construir a imagem:**
```powershell
docker build -t signalr-react-client .
```

2. **Executar o container:**
```powershell
docker run -d -p 9090:9090 --name signalr-client signalr-react-client
```

3. **Acessar a aplicação:**
```
http://localhost:9090
```

### Comandos úteis

**Ver logs do container:**
```powershell
docker logs -f signalr-client
```

**Parar o container:**
```powershell
docker stop signalr-client
```

**Remover o container:**
```powershell
docker rm signalr-client
```

**Verificar status:**
```powershell
docker ps --filter "name=signalr-client"
```

**Health check:**
```powershell
docker inspect --format='{{json .State.Health}}' signalr-client
```

### Problemas Corrigidos

✅ **Conflito de portas resolvido**: nginx agora escuta na porta 9090 (antes era 8080)
✅ **Health check adicionado**: Container monitora automaticamente a saúde da aplicação
✅ **Build otimizado**: Multi-stage build reduz o tamanho da imagem final

### Estrutura do Docker

- **Stage 1 (build)**: Node.js 18 Alpine - Compila a aplicação React
- **Stage 2 (runtime)**: Nginx Alpine - Serve os arquivos estáticos
- **Porta**: 9090
- **Volume**: `/usr/share/nginx/html` contém os arquivos da aplicação
