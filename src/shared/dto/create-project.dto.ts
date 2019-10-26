export interface ICreateProjectDTO {
  name: string;
  customerId: number;
  users: number[];
  tasks: string[];
}

export class CreateProjectDTO implements ICreateProjectDTO {
  public static parse(object: ICreateProjectDTO): CreateProjectDTO {
    return new CreateProjectDTO(
      object.name,
      object.customerId,
      object.users,
      object.tasks,
    );
  }

  public constructor(
    public readonly name: string,
    public readonly customerId: number,
    public readonly users: number[],
    public readonly tasks: string[],
  ) { }

  public serialize(): ICreateProjectDTO {
    return {
      name: this.name,
      customerId: this.customerId,
      users: this.users,
      tasks: this.tasks,
    };
  }
}
