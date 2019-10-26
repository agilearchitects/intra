export interface ICreateTimeDTO {
  taskId: number;
  from: string;
  to?: string | undefined;
  comment: string;
  userId: number;
  tags?: Array<string | number>;
}

export class CreateTimeDTO implements ICreateTimeDTO {
  public static parse(object: ICreateTimeDTO): CreateTimeDTO {
    return new CreateTimeDTO(
      object.taskId,
      object.from,
      (object.to !== undefined ? object.to : undefined),
      object.comment,
      object.userId,
      object.tags,
    );
  }

  public constructor(
    public readonly taskId: number,
    public readonly from: string,
    public readonly to: string | undefined,
    public readonly comment: string,
    public readonly userId: number,
    public readonly tags?: Array<string | number>,
  ) { }

  public serialize(): ICreateTimeDTO {
    return {
      taskId: this.taskId,
      from: this.from,
      ...(this.to !== undefined ? { to: this.to } : undefined),
      comment: this.comment,
      userId: this.userId,
      ...(this.tags !== undefined ? { tags: this.tags } : undefined),
    };
  }
}
