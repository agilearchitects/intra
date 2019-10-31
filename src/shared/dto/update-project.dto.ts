import { CreateProjectUserDTO, ICreateProjectUserDTO } from "./create-project-user.dto";
import { CreateProjectDTO, ICreateProjectDTO } from "./create-project.dto";
import { CreateTaskDTO, ICreateTaskDTO } from "./create-task.dto";

export interface IUpdateProjectDTO extends ICreateProjectDTO {
  id: number;
}

export class UpdateProjectDTO extends CreateProjectDTO {
  public static parse(updateProject: IUpdateProjectDTO):
    UpdateProjectDTO {
    return new this(
      updateProject.id,
      updateProject.name,
      updateProject.customerId,
      updateProject.rate,
      updateProject.priceBudget,
      updateProject.hoursBudget,
      updateProject.start,
      updateProject.end,
      updateProject.users !== undefined ? updateProject.users.map((user: ICreateProjectUserDTO) => CreateProjectUserDTO.parse(user)) : undefined,
      updateProject.tasks !== undefined ? updateProject.tasks.map((task: ICreateTaskDTO) => CreateTaskDTO.parse(task)) : undefined,
    );
  }

  public constructor(
    public readonly id: number,
    name: string,
    customerId: number,
    rate?: number | undefined,
    priceBudget?: number | undefined,
    hoursBudget?: number | undefined,
    start?: string,
    end?: string,
    users?: CreateProjectUserDTO[],
    tasks?: CreateTaskDTO[],
  ) {
    super(
      name,
      customerId,
      rate,
      priceBudget,
      hoursBudget,
      start,
      end,
      users,
      tasks,
    );
  }

  public serialize(): IUpdateProjectDTO {
    return {
      id: this.id,
      ...super.serialize(),
    };
  }
}
