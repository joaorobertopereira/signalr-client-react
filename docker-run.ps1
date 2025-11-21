# Script para reconstruir e executar o container SignalR React App

Write-Host "Parando e removendo container existente..." -ForegroundColor Yellow
docker stop signalr-client 2>$null
docker rm signalr-client 2>$null

Write-Host "Removendo imagem antiga..." -ForegroundColor Yellow
docker rmi signalr-react-client 2>$null

Write-Host "Construindo nova imagem..." -ForegroundColor Cyan
docker build -t signalr-react-client .

if ($LASTEXITCODE -eq 0) {
    Write-Host "Imagem construida com sucesso!" -ForegroundColor Green
    
    Write-Host "Iniciando container..." -ForegroundColor Cyan
    docker run -d -p 9090:9090 --name signalr-client signalr-react-client
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Container iniciado com sucesso!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Status do container:" -ForegroundColor Cyan
        docker ps --filter "name=signalr-client"
        Write-Host ""
        Write-Host "Aplicacao disponivel em: http://localhost:9090" -ForegroundColor Green
        Write-Host ""
        Write-Host "Para ver os logs: docker logs -f signalr-client" -ForegroundColor Yellow
        Write-Host "Para parar: docker stop signalr-client" -ForegroundColor Yellow
    } else {
        Write-Host "Erro ao iniciar container!" -ForegroundColor Red
    }
} else {
    Write-Host "Erro ao construir imagem!" -ForegroundColor Red
}
