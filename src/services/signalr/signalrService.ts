// Arquivo: src/services/signalr/signalrService.ts
import * as signalR from '@microsoft/signalr';

class SignalRService {
    private connection: signalR.HubConnection | null = null;
    private static instance: SignalRService;

    private constructor() { }

    public static getInstance(): SignalRService {
        if (!SignalRService.instance) {
            SignalRService.instance = new SignalRService();
        }
        return SignalRService.instance;
    }

    public async startConnection(url: string): Promise<void> {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(url)
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        try {
            await this.connection.start();
            console.log('Conexão SignalR estabelecida com sucesso!');
        } catch (error) {
            console.error('Erro ao conectar com SignalR:', error);
            throw error;
        }
    }

    public async stopConnection(): Promise<void> {
        if (this.connection) {
            try {
                await this.connection.stop();
                this.connection = null;
                console.log('Conexão SignalR encerrada.');
            } catch (error) {
                console.error('Erro ao desconectar do SignalR:', error);
                throw error;
            }
        }
    }

    public on(eventName: string, callback: (message: any) => void): void {
        if (this.connection) {
            this.connection.on(eventName, callback);
        }
    }

    public off(eventName: string): void {
        if (this.connection) {
            this.connection.off(eventName);
        }
    }

    public async invoke(eventName: string, ...args: any[]): Promise<any> {
        if (this.connection) {
            try {
                return await this.connection.invoke(eventName, ...args);
            } catch (error) {
                console.error(`Erro ao invocar o método '${eventName}':`, error);
                throw error;
            }
        }
        throw new Error('A conexão SignalR não está ativa.');
    }

    public getConnectionState(): signalR.HubConnectionState {
        return this.connection ? this.connection.state : signalR.HubConnectionState.Disconnected;
    }
}

export const signalRService = SignalRService.getInstance();

