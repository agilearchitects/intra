import moment from "moment";

export interface ICreateTimeDTO {
  projectId: number;
  from: string;
  to?: string | undefined;
  comment: string;
  userId: number;
}

export class CreateTimeDTO implements ICreateTimeDTO {
  public static parse(object: ICreateTimeDTO): CreateTimeDTO {
    return new CreateTimeDTO(
      object.projectId,
      object.from,
      (object.to !== undefined ? object.to : undefined),
      object.comment,
      object.userId,
    );
  }

  public constructor(
    public readonly projectId: number,
    public readonly from: string,
    public readonly to: string | undefined,
    public readonly comment: string,
    public readonly userId: number,
  ) { }

  public serialize(): ICreateTimeDTO {
    return {
      projectId: this.projectId,
      from: this.from,
      ...(this.to !== undefined ? { to: this.to } : undefined),
      comment: this.comment,
      userId: this.userId,
    };
  }
}
