export interface ICreateProjectUserDTO {
  userId: number;
  rate: number;
}

export class CreateProjectUserDTO {
  public static parse(createProjectUser: ICreateProjectUserDTO):
    CreateProjectUserDTO {
    return new this(
      createProjectUser.userId,
      createProjectUser.rate,
    );
  }

  public constructor(
    public readonly userId: number,
    public readonly rate: number,
  ) { }

  public serialize(): ICreateProjectUserDTO {
    return {
      userId: this.userId,
      rate: this.rate,
    };
  }
}
