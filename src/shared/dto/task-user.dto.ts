import { IUserDTO, UserDTO } from "./user.dto";

export interface ITaskUserDTO {
  id: number;
  user: IUserDTO;
  rate?: number;
}

export class TaskUserDTO {
  public static parse(taskUser: ITaskUserDTO):
    TaskUserDTO {
    return new this(
      taskUser.id,
      UserDTO.parse(taskUser.user),
      taskUser.rate,
    );
  }

  public constructor(
    public readonly id: number,
    public readonly user: UserDTO,
    public readonly rate?: number,
  ) { }

  public serialize(): ITaskUserDTO {
    return {
      id: this.id,
      user: this.user.serialize(),
      ...(this.rate !== undefined ? { rate: this.rate } : undefined),
    };
  }
}
