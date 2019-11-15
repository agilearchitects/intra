export interface ICreateTaskUserDTO {
  userId: number;
  rate: number;
}

export class CreateTaskUserDTO {
  public static parse(createTaskUser: ICreateTaskUserDTO):
    CreateTaskUserDTO {
    return new this(
      createTaskUser.userId,
      createTaskUser.rate,
    );
  }

  public constructor(
    public readonly userId: number,
    public readonly rate: number,
  ) { }

  public serialize(): ICreateTaskUserDTO {
    return {
      userId: this.userId,
      rate: this.rate,
    };
  }
}
