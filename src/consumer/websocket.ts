import { Client } from "@stomp/stompjs";
import SockJS from 'sockjs-client';

export class WebSocketService {
  private client: Client;
  private onMessageCallback: ((message: any) => void) | null = null;

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/t2r-websocket"),
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
    });

    this.client.onConnect = () => {
      console.log("Conectado ao WebSocket via HTTP");
      this.client.subscribe("/topic/messages", (message) => {
        if (this.onMessageCallback) {
          this.onMessageCallback(JSON.parse(message.body));
        }
      });
    };

    this.client.onStompError = (frame) => {
      console.error("Erro no STOMP: ", frame);
    };

    this.client.activate();
  }

  public setOnMessageCallback(callback: (message: any) => void) {
    this.onMessageCallback = callback;
  }

  public sendMessage(chatId: string): void {
    if (this.isConnected()) {
      this.client.publish({
        destination: "/app/send-message",
        body: JSON.stringify({ chatId }),
      });
    } else {
      console.error("WebSocket não conectado");
    }
  }

  public isConnected(): boolean {
    return this.client.connected;
  }

  public disconnect(): void {
    this.client.deactivate();
  }
}
