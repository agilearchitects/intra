import { CreateProjectDTO, ICreateProjectDTO } from "./create-project.dto";
import { CreateTaskDTO, ICreateTaskDTO } from "./create-task.dto";
import { IUpdateTaskDTO, UpdateTaskDTO } from "./update-task.dto";

export interface IUpdateProjectDTO extends ICreateProjectDTO {
  id: number;
  tasks?: Array<ICreateTaskDTO | IUpdateTaskDTO>;
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
      updateProject.tasks !== undefined ? updateProject.tasks.map((task: ICreateTaskDTO | IUpdateTaskDTO) => "id" in task ? UpdateTaskDTO.parse(task) : CreateTaskDTO.parse(task)) : undefined,
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
    public readonly tasks?: Array<CreateTaskDTO | UpdateTaskDTO>,
  ) {
    super(
      name,
      customerId,
      rate,
      priceBudget,
      hoursBudget,
      start,
      end,
    );
  }

  public serialize(): IUpdateProjectDTO {
    return {
      id: this.id,
      ...super.serialize(),
      ...(this.tasks !== undefined ? {
        tasks: this.tasks.map((task: CreateTaskDTO | UpdateTaskDTO) => task.serialize()),
      } : undefined),
    };
  }
}
