import { Injectable, Logger } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { ChatMessagesService } from "./chat-messages.service";
import { ChatMessage } from "./entities/chat-message.entity";
import { CronJob } from "cron";
import { LessThan } from "typeorm";

import appConfig from "src/app.config";

@Injectable()
export class ChatMessagesTasksService {
  private readonly _logger: Logger;
  private get _task() {
    return appConfig.chatMessageDeleteTask;
  }

  constructor(
    private _chatMessagesService: ChatMessagesService,
    scheduler: SchedulerRegistry
  ) {
    this._logger = new Logger(ChatMessagesTasksService.name);

    if (this._task.enabled) {
      const job = new CronJob(this._task.schedule, () =>
        this.deleteOldChatMessages()
      );
      scheduler.addCronJob("delete-old-chat-messages-job", job);

      job.start();
    }
  }

  public async deleteOldChatMessages(force: boolean = false): Promise<void> {
    if (!this._task.enabled && !force) {
      return;
    }

    try {
      this._logger.log(
        force ? "(FORCED) - " : "" + "Deleting old chat messages..."
      );

      const maxDate = new Date();
      maxDate.setHours(
        maxDate.getHours() - Math.abs(this._task.maxMessageHours),
        0,
        0,
        0
      );

      const messages: ChatMessage[] = await this._chatMessagesService.getAll({
        where: { datePosted: LessThan(maxDate.toISOString()) },
      });

      this.logMessagesDeleting(messages, maxDate);
      await this._chatMessagesService.deleteMany(messages);
    } catch (error) {
      this._logger.error(`Failed to delete old chat messages:\n${error}`);
    }
  }

  private logMessagesDeleting(
    messages: ChatMessage[],
    olderThanDate: Date
  ): void {
    const data: any[] = messages.map((m: ChatMessage) => {
      return { id: m.id, datePosted: m.datePosted };
    });

    const logInfo: any = {
      olderThan: olderThanDate.toISOString(),
      messagesCount: messages.length,
      messages: data,
    };

    const logJson: string = JSON.stringify(logInfo, undefined, 2);
    this._logger.log(logJson);
  }
}
