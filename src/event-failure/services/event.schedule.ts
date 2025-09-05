import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Model } from "mongoose";
import { EventFailure } from "../schemas/event-failure.schema";
import { SafeEventEmitter } from "./event-failure.service";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class EventRetryService {
  private readonly logger = new Logger(EventRetryService.name);

  constructor(
    @InjectModel(EventFailure.name)
    private readonly failLogRepo: Model<EventFailure>,
    private readonly safeEmitter: SafeEventEmitter,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async retryFailedEvents() {
    this.logger.debug("Reprocesando eventos fallidos...");

    const fails = await this.failLogRepo.find({
      where: { retried: false },
      order: { createdAt: "ASC" },
      take: 50,
    });

    for (const fail of fails) {
      try {
        this.logger.log(
          `Reprocesando evento ${fail.eventName} (id=${fail.id})`,
        );
        await this.safeEmitter.emitSafe(fail.eventName, fail.payload);

        fail.retried = true;
        await this.failLogRepo.create(fail);

        this.logger.log(`✅ Evento ${fail.id} reprocesado correctamente`);
      } catch (err) {
        this.logger.error(
          `❌ Falló nuevamente el evento ${fail.id}: ${err.message}`,
        );
      }
    }
  }
}
