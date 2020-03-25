// DTO's
import { CreateTimeDTO } from "../../../shared/dto/create-time.dto";
import { StopTimeDTO } from "../../../shared/dto/stop-time.dto";
import { TimeQueryDTO } from "../../../shared/dto/time-query.dto";
import { ITimeDTO, TimeDTO } from "../../../shared/dto/time.dto";
import { UpdateTimeDTO } from "../../../shared/dto/update-time.dto";

// Services
import { APIService } from "../../../shared/services/api.service";
import { DateService } from "../../../shared/services/date.service";
import { CustomerDTO, ICustomerDTO } from "../../../shared/dto/customer.dto";
import { IProjectDTO } from "../../../shared/dto/project.dto";
import { ITaskDTO } from "../../../shared/dto/task.dto";


export class TimeService {
  public constructor(
    private readonly apiService: APIService,
    private readonly dateService?: DateService,
  ) { }
  public async index(timeQuery: TimeQueryDTO): Promise<TimeDTO[]> {
    return (await this.apiService.get<ITimeDTO[]>(
      "/time",
      Object.keys(timeQuery).reduce(
        (previousValue: {}, key: string) => ({
          ...previousValue,
          ...(timeQuery[key] !== undefined ? { [key]: timeQuery[key] } : undefined)
        }),
        {}
      ))).body.map((time: ITimeDTO) => TimeDTO.parse(time, this.dateService));
  }
  public async indexByCustomer(timeQuery: TimeQueryDTO): Promise<CustomerDTO[]> {
    const times = (await this.apiService.get<ITimeDTO[]>(
      "/time",
      Object.keys(timeQuery).reduce(
        (previousValue: {}, key: string) => ({
          ...previousValue,
          ...(timeQuery[key] !== undefined ? { [key]: timeQuery[key] } : undefined)
        }),
        {}
      ))).body;

    const customers: ICustomerDTO[] = [];
    for (const time of times) {
      if (time.task !== undefined && time.task.project !== undefined && time.task.project.customer !== undefined) {
        const currentCustomer = time.task.project.customer;
        const currentProject = time.task.project;
        const currentTask = time.task;

        // Get customer from customers
        let customerIndex = customers.findIndex((customer: ICustomerDTO) => customer.id === currentCustomer.id);
        // Add if not existing (with empty projects list)
        if (customerIndex === -1) { customerIndex = customers.push({ ...currentCustomer, projects: [] }) - 1; }

        // Get project from customer projects
        let projectIndex: number = customers[customerIndex].projects.findIndex((project: IProjectDTO) => project.id === currentProject.id);
        // Add if not existing (with empty tasks list)
        if (projectIndex === -1) { projectIndex = customers[customerIndex].projects.push({ ...currentProject, tasks: [] }) - 1; }

        // Get task from customer project tasks
        let taskIndex: number = customers[customerIndex].projects[projectIndex].tasks.findIndex((task: ITaskDTO) => task.id === currentTask.id);
        // Add if not existing (with empty times list)
        if (taskIndex === -1) { taskIndex = customers[customerIndex].projects[projectIndex].tasks.push({ ...currentTask, times: [] }) - 1; }

        // Add time to customer project task times list
        customers[customerIndex].projects[projectIndex].tasks[taskIndex].times.push({
          id: time.id,
          from: time.from,
          ...(time.to !== undefined ? { to: time.to, } : {}),
          comment: time.comment,
          ...(time.user !== undefined ? { user: time.user, } : {}),
          ...(time.rate !== undefined ? { rate: time.rate, } : {}),
        });
      }
    }

    // Returned parsed list
    return customers.map((customer: ICustomerDTO) => CustomerDTO.parse(customer));
  }
  public async show(timeId: number): Promise<TimeDTO> {
    return TimeDTO.parse((await this.apiService.get<ITimeDTO>(`/time/${timeId}`)).body, this.dateService);
  }
  public async create(createTime: CreateTimeDTO): Promise<void> {
    await this.apiService.post("/time", createTime.serialize());
  }
  public async update(updateTime: UpdateTimeDTO): Promise<void> {
    await this.apiService.put(`/time/${updateTime.id}`, updateTime.serialize());
  }
  public async delete(timeId: number): Promise<void> {
    await this.apiService.delete(`/time/${timeId}`);
  }
  public async stop(stopTime: StopTimeDTO): Promise<void> {
    await this.apiService.put(`/time/stop/${stopTime.id}`, stopTime.serialize());
  }
}
