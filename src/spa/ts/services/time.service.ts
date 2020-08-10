// DTO's
import { CreateTimeDTO } from "../../../shared/dto/create-time.dto";
import { CustomerDTO, ICustomerDTO } from "../../../shared/dto/customer.dto";
import { StopTimeDTO } from "../../../shared/dto/stop-time.dto";
import { TimeQueryDTO } from "../../../shared/dto/time-query.dto";
import { ITimeDTO, TimeDTO } from "../../../shared/dto/time.dto";
import { UpdateTimeDTO } from "../../../shared/dto/update-time.dto";

// Services
import { IProjectDTO } from "../../../shared/dto/project.dto";
import { ITaskDTO } from "../../../shared/dto/task.dto";
import { APIService } from "../../../shared/services/api.service";
import { DateService } from "../../../shared/services/date.service";
import { MessageService } from "./message.service";

export class TimeService {
  public constructor(
    private readonly apiService: APIService,
    private readonly dateService?: DateService,
  ) { }
  public async index(timeQuery: TimeQueryDTO): Promise<TimeDTO[]> {
    try {
      return (await this.apiService.get<ITimeDTO[]>(
        "/time",
        {
          ...(timeQuery.date !== undefined ? { date: timeQuery.date } : undefined),
          ...(timeQuery.year !== undefined ? { year: timeQuery.year } : undefined),
          ...(timeQuery.month !== undefined ? { month: timeQuery.month } : undefined),
          ...(timeQuery.week !== undefined ? { week: timeQuery.week } : undefined),
          ...(timeQuery.all !== undefined ? { all: "true" } : undefined),
        },
      )).body.map((time: ITimeDTO) => TimeDTO.parse(time, this.dateService));
    } catch (error) {
      throw { code: error.response.status, message: error.response.data }
    }
  }
  public async indexByCustomer(timeQuery: TimeQueryDTO): Promise<CustomerDTO[]> {
    const times = (await this.apiService.get<ITimeDTO[]>(
      "/time",
      {
        ...(timeQuery.date !== undefined ? { date: timeQuery.date } : undefined),
        ...(timeQuery.year !== undefined ? { year: timeQuery.year } : undefined),
        ...(timeQuery.month !== undefined ? { month: timeQuery.month } : undefined),
        ...(timeQuery.week !== undefined ? { week: timeQuery.week } : undefined),
        ...(timeQuery.all !== undefined ? { all: "true" } : undefined),
      },
    )).body;

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
        const customer = customers[customerIndex];

        if (customer.projects === undefined) {
          throw new Error("Customer projects was not provided");
        }

        // Get project from customer projects
        let projectIndex: number = customer.projects.findIndex((project: IProjectDTO) => project.id === currentProject.id);
        // Add if not existing (with empty tasks list)
        if (projectIndex === -1) { projectIndex = customer.projects.push({ ...currentProject, tasks: [] }) - 1; }

        const project = customer.projects[projectIndex];
        if (project.tasks === undefined) {
          throw new Error("Tasks for projects was not provided");
        }
        // Get task from customer project tasks
        let taskIndex: number = project.tasks.findIndex((task: ITaskDTO) => task.id === currentTask.id);
        // Add if not existing (with empty times list)
        if (taskIndex === -1) { taskIndex = project.tasks.push({ ...currentTask, times: [] }) - 1; }

        const task = project.tasks[taskIndex];
        if (task.times === undefined) {
          throw new Error("Times for tasks was not provided");
        }
        // Add time to customer project task times list
        task.times.push({
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
