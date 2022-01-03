import { Injectable, Logger } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { ChatMessagesService } from "./chat-messages.service";
import { ChatMessage } from "./entities/chat-message.entity";
import { CronJob } from "cron";

import appConfig from "src/app.config";

@Injectable()
export class ChatMessagesTasksService {
  private readonly _logger?: Logger;

  constructor(private _chatMessagesService: ChatMessagesService, scheduler: SchedulerRegistry) {
    const task = appConfig.chatMessageDeleteTask;

    if(task.enabled) {
      this._logger = new Logger(ChatMessagesTasksService.name);

      const job = new CronJob(task.schedule, () => this.deleteOldChatMessages(task.maxMessageHours));
      scheduler.addCronJob("delete-old-chat-messages-job", job);

      job.start();
    }
  }

  private async deleteOldChatMessages(maxMessageHours: number): Promise<void> {
    const maxDate = new Date();
    maxDate.setUTCHours(maxDate.getUTCHours() * -Math.abs(maxMessageHours), 0, 0, 0);

    try {
      this._logger.log("Executing scheduled chat messages deletion...");

      const messages: ChatMessage[] = await this._chatMessagesService.getAllByModel({ maxDate });
      this.logMessagesDeleting(messages, maxDate);

      await this._chatMessagesService.deleteMany(messages);

      this._logger.log("...Success!");
    }
    catch(error) {
      this._logger.error(`...FAILED!\n${error}`);
    }
  }

  private logMessagesDeleting(messages: ChatMessage[], maxDate: Date): void {
    const data: any[] = messages.map((m: ChatMessage) => {
      return { id: m.id, datePosted: m.datePosted };
    });

    const logInfo: any = {
      maxMessagesDate: maxDate.toISOString(),
      messagesCount: messages.length,
      messages: data
    };

    const logJson: string = JSON.stringify(logInfo, undefined, 2);
    this._logger.log(logJson);
  }
}