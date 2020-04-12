import { bodyType, jsonType } from "@agilearchitects/server";
import { DTO } from "./dto";

export interface IUpdateTimeDTO {
  id: number;
  taskId: number;
  from: string;
  to?: string;
  comment: string;
  userId: number;
  tags?: (string | number)[];
  rate?: number;
}

export class UpdateTimeDTO implements IUpdateTimeDTO {
  public static parseFromRequest(object: bodyType): UpdateTimeDTO {
    object = DTO.parseFromRequest(object);
    if (typeof object.id !== "number" ||
      typeof object.taskId !== "number" ||
      typeof object.from !== "string" ||
      (typeof object.to !== "string" && object.to !== undefined) ||
      typeof object.comment !== "string" ||
      typeof object.userId !== "number" ||
      (object.tags !== undefined &&
        !(object.tags instanceof Array)) ||
      (object.rate !== undefined &&
        typeof object.rate !== "number")
    ) {
      throw new Error("Unable to parse");
    }

    return new UpdateTimeDTO(
      object.id,
      object.taskId,
      object.from,
      object.to !== undefined ? object.to : undefined,
      object.comment,
      object.userId,
      object.tags !== undefined ? object.tags.map((tag: jsonType) => {
        if (typeof tag !== "string" && typeof tag !== "number") {
          throw new Error("Unable to parse");
        }
        return tag;
      }) : undefined,
      object.rate,
    );
  }
  public static parse(object: IUpdateTimeDTO): UpdateTimeDTO {
    return new UpdateTimeDTO(
      object.id,
      object.taskId,
      object.from,
      object.to !== undefined ? object.to : undefined,
      object.comment,
      object.userId,
      object.tags,
      object.rate,
    );
  }

  public constructor(
    public readonly id: number,
    public readonly taskId: number,
    public readonly from: string,
    public readonly to: string | undefined,
    public readonly comment: string,
    public readonly userId: number,
    public readonly tags?: (string | number)[],
    public readonly rate?: number,
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
      ...(this.rate !== undefined ? { rate: this.rate } : undefined),
    };
  }
}
