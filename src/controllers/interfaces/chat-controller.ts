export interface IChatController {
  onConnect(): void;

  onDisconnect(reason: string): void;

  onMessage(message: string): void;
}