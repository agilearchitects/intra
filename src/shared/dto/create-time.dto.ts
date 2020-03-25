export interface ICreateTimeDTO {
  taskId: number;
  from: string;
  to?: string | undefined;
  comment: string;
  userId: number;
  rate?: number;
  tags?: (string | number)[];
}

export class CreateTimeDTO implements ICreateTimeDTO {
  public static parse(object: ICreateTimeDTO): CreateTimeDTO {
    return new CreateTimeDTO(
      object.taskId,
      object.from,
      (object.to !== undefined ? object.to : undefined),
      object.comment,
      object.userId,
      object.rate,
      object.tags,
    );
  }

  public constructor(
    public readonly taskId: number,
    public readonly from: string,
    public readonly to: string | undefined,
    public readonly comment: string,
    public readonly userId: number,
    public readonly rate?: number,
    public readonly tags?: (string | number)[],
  ) { }

  public serialize(): ICreateTimeDTO {
    return {
      taskId: this.taskId,
      from: this.from,
      ...(this.to !== undefined ? { to: this.to } : undefined),
      comment: this.comment,
      userId: this.userId,
      ...(this.rate !== undefined ? { rate: this.rate } : undefined),
      ...(this.tags !== undefined ? { tags: this.tags } : undefined),
    };
  }
}
