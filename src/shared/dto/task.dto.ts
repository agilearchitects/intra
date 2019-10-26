import { IProjectDTO, ProjectDTO } from "./project.dto";
import { ITimeDTO, TimeDTO } from "./time.dto";

export interface ITaskDTO {
  id: number;
  name: string;
  project?: IProjectDTO;
  times?: ITimeDTO[];
}

export class TaskDTO {
  public static parse(task: ITaskDTO): TaskDTO {
    return new this(
      task.id,
      task.name,
      (task.project !== undefined ? ProjectDTO.parse(task.project) : undefined),
      (task.times ? task.times.map((time: ITimeDTO) => TimeDTO.parse(time)) : undefined),
    );
  }

  public constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly project?: ProjectDTO,
    public readonly times?: TimeDTO[],
  ) { }

  public serialize(): ITaskDTO {
    return {
      id: this.id,
      name: this.name,
      ...(this.project !== undefined ? { project: this.project.serialize() } : undefined),
      ...(this.times !== undefined ? { times: this.times.map((time: TimeDTO) => time.serialize()) } : undefined),
    };
  }
}
