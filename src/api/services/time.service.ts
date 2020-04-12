import moment, { Moment } from "moment";
import { Between } from "typeorm";

// DTO's
import { CustomerDTO } from "../../shared/dto/customer.dto";
import { ProjectDTO } from "../../shared/dto/project.dto";
import { TagDTO } from "../../shared/dto/tag.dto";
import { TaskDTO } from "../../shared/dto/task.dto";
import { ITimeDTO, TimeDTO } from "../../shared/dto/time.dto";

// Entities
import { ICreateTimeDTO } from "../../shared/dto/create-time.dto";
import { IStopTimeDTO } from "../../shared/dto/stop-time.dto";
import { IUpdateTimeDTO, UpdateTimeDTO } from "../../shared/dto/update-time.dto";
import { TagEntity } from "../../shared/entities/tag.entity";
import { TaskEntity } from "../../shared/entities/task.entity";
import { TimeEntity } from "../../shared/entities/time.entity";
import { UserEntity } from "../../shared/entities/user.entity";

export class TimeService {
  public constructor(
    private readonly dateTimeFormat: string,
    private readonly timeEntity: typeof TimeEntity,
    private readonly tagEntity: typeof TagEntity,
    private readonly taskEntity: typeof TaskEntity,
    private readonly userEntity: typeof UserEntity,
    private readonly customerDTO: typeof CustomerDTO,
    private readonly projectDTO: typeof ProjectDTO,
    private readonly tagDTO: typeof TagDTO,
    private readonly taskDTO: typeof TaskDTO,
    private readonly timeDTO: typeof TimeDTO,
    private readonly momentModule: typeof moment,
    private readonly typeOrmBetween: typeof Between,
  ) { }

  public async getAll(date?: string, month?: string, year?: string, week?: string, userId?: number): Promise<ITimeDTO[]> {
    return (await this.timeEntity.find({
      relations: [
        "task",
        "task.project",
        "task.project.customer",
        "tags",
      ],
      where: {
        // Only get provided date
        ...(date !== undefined ? {
          from: this.typeOrmBetween(
            this.momentModule(date, "YYYY-MM-DD", true).startOf("day").utc().format(this.dateTimeFormat),
            this.momentModule(date, "YYYY-MM-DD", true).endOf("day").utc().format(this.dateTimeFormat)),
        } : undefined),
        ...(year !== undefined && month !== undefined ? {
          from: this.typeOrmBetween(
            this.momentModule(`${year}-${month}`, "YYYY-MM", true).startOf("month").utc().format(this.dateTimeFormat),
            this.momentModule(`${year}-${month}`, "YYYY-MM", true).endOf("month").utc().format(this.dateTimeFormat)),
        } : undefined),
        ...(year !== undefined && week !== undefined ? {
          from: this.typeOrmBetween(
            this.momentModule(`${year} ${week}`, "YYYY W", true).startOf("isoWeek").utc().format(this.dateTimeFormat),
            this.momentModule(`${year} ${week}`, "YYYY W", true).endOf("isoWeek").utc().format(this.dateTimeFormat)),
        } : undefined),
        ...(year !== undefined && month === undefined && week === undefined ? {
          from: this.typeOrmBetween(
            this.momentModule(year, "YYYY", true).startOf("year").utc().format(this.dateTimeFormat),
            this.momentModule(year, "YYYY", true).endOf("year").utc().format(this.dateTimeFormat)),
        } : undefined),
        // If query "all" is not provided only fetch entities belonging to current user
        ...(userId !== undefined ? {
          user: {
            id: userId,
          },
        } : undefined),
      },
      order: { from: "DESC", to: "ASC" },
    })).map((time: TimeEntity) => this.parseTimeEntityToDTO(time));
  }

  public async get(timeId: number): Promise<ITimeDTO> {
    const time = await TimeEntity.findOneOrFail({
      where: { id: timeId },
      relations: ["task", "task.project", "task.project.customer", "tags"],
    });
    return this.parseTimeEntityToDTO(time);
  }

  public async create(time: ICreateTimeDTO): Promise<ITimeDTO> {
    // Check for any timer ongoing on the same day as provided time
    if (time.to === undefined) {
      const currentTimers = await TimeEntity.find({
        where: {
          user: { id: time.userId },
          to: null,
          from: Between(
            moment(time.from).format("YYYY-MM-DD 00:00:00"),
            moment(time.from).format("YYYY-MM-DD 23:59:59"),
          ),
        },
      });

      // Set ongoing timer to date
      if (currentTimers.length > 0) {
        // Stop all ongoing timers
        TimeEntity.update(currentTimers.map((time: TimeEntity) => time.id), { to: moment(time.from).toDate() });
      }
    }

    // Look up provided user
    const foundUser = await this.userEntity.findOneOrFail(time.userId);

    // Create timer
    const newTimer = await this.timeEntity.create({
      from: this.momentModule(time.from, this.dateTimeFormat, true).toDate(),
      ...(time.to !== undefined ? { to: this.setToDate(this.momentModule(time.from), this.momentModule(time.to)).toDate() } : undefined),
      comment: time.comment,
      user: foundUser,
      task: await this.taskEntity.findOneOrFail(time.taskId),
      ...(time.tags !== undefined ? {
        tags: await Promise.all(time.tags.map((tag: string | number) => {
          if (typeof tag === "string") {
            // Create tag if id is not present
            return this.tagEntity.create({ name: tag });
          }
          // Return tag with id if present
          return this.tagEntity.findOneOrFail(tag);
        })),
      } : undefined),
      ...(time.rate !== undefined ? { rate: time.rate } : undefined),
    }).save();

    return this.parseTimeEntityToDTO(newTimer);
  }

  public async update(time: IUpdateTimeDTO): Promise<ITimeDTO> {
    const foundTime = await this.timeEntity.findOneOrFail(time.id);

    foundTime.from = this.momentModule(time.from, this.dateTimeFormat).toDate();
    if (time.to !== undefined) {
      foundTime.to = this.setToDate(this.momentModule(time.from), this.momentModule(time.to)).toDate();
    }
    foundTime.comment = time.comment;
    foundTime.task = await this.taskEntity.findOneOrFail(time.taskId);
    if (time.tags !== undefined) {
      foundTime.tags = await Promise.all(time.tags.map((tag: string | number) => {
        if (typeof tag === "string") {
          // Create tag if id is not present
          return this.tagEntity.create({ name: tag });
        }
        // Return tag with id if present
        return this.tagEntity.findOneOrFail(tag);
      }));
    }
    foundTime.rate = time.rate !== undefined ? time.rate : null;
    await foundTime.save();

    return this.parseTimeEntityToDTO(foundTime);
  }

  public async delete(timeId: number): Promise<void> {
    await this.timeEntity.delete(timeId);
  }

  public async stop(timer: IStopTimeDTO): Promise<void> {
    await this.timeEntity.update({ id: timer.id, to: null }, { to: this.momentModule(timer.to).toDate() });
  }

  private parseTimeEntityToDTO(time: TimeEntity): ITimeDTO {
    return this.timeDTO.parse({
      id: time.id,
      ...(time.task !== null ? {
        task: this.taskDTO.parse({
          id: time.task.id,
          name: time.task.name,
          ...(time.task.project !== undefined ? {
            project: this.projectDTO.parse({
              id: time.task.project.id,
              name: time.task.project.name,
              ...(time.task.project.rate !== null ? { rate: time.task.project.rate } : undefined),
              ...(time.task.project.priceBudget !== null ? { priceBudget: time.task.project.priceBudget } : undefined),
              ...(time.task.project.hoursBudget !== null ? { hoursBudget: time.task.project.hoursBudget } : undefined),
              customer: this.customerDTO.parse({
                id: time.task.project.customer.id,
                name: time.task.project.customer.name,
              }).serialize(),
            }).serialize(),
          } : undefined),
        }).serialize(),
      } : undefined),
      from: moment(time.from).format(this.dateTimeFormat),
      ...(time.rate !== null ? { rate: time.rate } : undefined),
      ...(time.to !== null ? { to: moment(time.to).format(this.dateTimeFormat) } : undefined),
      tags: time.tags.map((tag: TagEntity) => this.tagDTO.parse({ id: tag.id, name: tag.name }).serialize()),
      comment: time.comment !== null ? time.comment : "",
    }).serialize();
  }

  private setToDate(from: Moment, to: Moment): Moment {
    const duration = this.momentModule.duration(to.diff(from));
    if (duration.asSeconds() < 0) {
      return this.momentModule(to).add(1, "days");
    } else {
      return to;
    }
  }
}
