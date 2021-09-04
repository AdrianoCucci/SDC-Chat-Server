import { Message } from "../../models/messages/message";

export interface IChatController {
  onConnect(): void;

  onDisconnect(reason: string): void;

  onMessage(message: Message): void;
}