export interface IProjectUserDTO {
  id: number;
  email: string;
  rate: number;
}

export class ProjectUserDTO {
  public static parse(projectUser: IProjectUserDTO):
    ProjectUserDTO {
    return new this(
      projectUser.id,
      projectUser.email,
      projectUser.rate,
    );
  }

  public constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly rate: number,
  ) { }

  public serialize(): IProjectUserDTO {
    return {
      id: this.id,
      email: this.email,
      rate: this.rate,
    };
  }
}
