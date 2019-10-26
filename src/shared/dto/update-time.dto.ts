import { ITagDTO, TagDTO } from "./tag.dto";

export interface IUpdateTimeDTO {
  id: number;
  taskId: number;
  from: string;
  to?: string;
  comment: string;
  userId: number;
  tags?: Array<string | number>;
}

export class UpdateTimeDTO implements IUpdateTimeDTO {
  public static parse(object: IUpdateTimeDTO): UpdateTimeDTO {
    return new UpdateTimeDTO(
      object.id,
      object.taskId,
      object.from,
      object.to !== undefined ? object.to : undefined,
      object.comment,
      object.userId,
      object.tags,
    );
  }

  public constructor(
    public readonly id: number,
    public readonly taskId: number,
    public readonly from: string,
    public readonly to: string | undefined,
    public readonly comment: string,
    public readonly userId: number,
    public readonly tags?: Array<string | number>,
  ) { }

  public serialize(): IUpdateTimeDTO {
    return {
      id: this.id,
      taskId: this.taskId,
      from: this.from,
      ...(this.to !== undefined ? { to: this.to } : undefined),
      comment: this.comment,
      userId: this.userId,
      ...(this.tags !== undefined ? { tags: this.tags } : undefined),
    };
  }
}
