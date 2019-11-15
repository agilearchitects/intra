import { IUserPayloadDTO, UserPayloadDTO } from "@agilearchitects/authenticaton";
import { ITagDTO, TagDTO } from "./tag.dto";
import { ITaskDTO, TaskDTO } from "./task.dto";

export interface ITimeDTO {
  id: number;
  task?: ITaskDTO;
  from: string;
  to?: string;
  comment: string;
  tags?: ITagDTO[];
  user?: IUserPayloadDTO;
  rate?: number;
}

export class TimeDTO implements ITimeDTO {
  public static parse(object: ITimeDTO): TimeDTO {
    return new TimeDTO(
      object.id,
      object.task ? TaskDTO.parse(object.task) : undefined,
      object.from,
      object.to !== undefined ? object.to : undefined,
      object.comment,
      object.tags !== undefined ? object.tags.map((tag: ITagDTO) => TagDTO.parse(tag)) : undefined,
      object.user !== undefined ? UserPayloadDTO.parse(object.user) : undefined,
      object.rate,
    );
  }

  public constructor(
    public readonly id: number,
    public readonly task: TaskDTO | undefined,
    public readonly from: string,
    public readonly to: string | undefined,
    public readonly comment: string,
    public readonly tags?: TagDTO[],
    public readonly user?: UserPayloadDTO | undefined,
    public readonly rate?: number,
  ) { }

  public serialize(): ITimeDTO {
    return {
      id: this.id,
      ...(this.task ? { task: this.task.serialize() } : undefined),
      from: this.from,
      ...(this.to !== undefined ? { to: this.to } : undefined),
      comment: this.comment,
      ...(this.tags !== undefined ? { tags: this.tags.map((tag: TagDTO) => tag.serialize()) } : undefined),
      ...(this.user !== undefined ? { user: this.user.serialize() } : undefined),
      ...(this.rate !== undefined ? { rate: this.rate } : undefined),
    };
  }
}
