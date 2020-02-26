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
    customers[1].projects.findIndex(() => true);
    for (const time of times) {
      if (time.task !== undefined && time.task.project === undefined && time.task.project.customer === undefined) {
        let customerIndex = customers.findIndex((customer: ICustomerDTO) => customer.id === time.task.project.customer.id);
        let projectIndex: number = -1;
        if (customerIndex !== -1) {
          projectIndex = customers[customerIndex]
        }
        if (customerIndex === -1) { customerIndex = customers.push(time.task.project.customer); }
        if (customers[customerIndex].projects === undefined) {
          customers[customerIndex].projects = [time.task.project]
        } else {
        }
      }
    }

    return times.reduce((previousValue: ICustomerDTO[], time: ITimeDTO) => {
      // Check that customer is not undefined
      if (time.task === undefined || time.task.project === undefined || time.task.project.customer === undefined) { return previousValue; }
      // If customer doesn't exists in output array
      if (((currentCustomer: ICustomerDTO) =>
        previousValue.findIndex(
          (customer: CustomerDTO) => customer.id === currentCustomer.id
        ) !== -1)(time.task.project.customer) === false) {
        return [
          ...previousValue,
          {
            ...time.task.project.customer,
            projects: [{
              ...time.task.project,
              tasks: [{ ...time.task, times: [time] }]
            }]
          }
        ]
      } else {
        return [
          ((currentProject: IProjectDTO, currentTask: ITaskDTO, currentTime: ITimeDTO): ICustomerDTO[] => previousValue.map((customer: ICustomerDTO) => {
            if (customer.projects === undefined) {
              customer.projects = [currentProject];
            } else {
              const projectIndex = customer.projects.findIndex((project: IProjectDTO) => project.id === currentProject.id);
              if (projectIndex === -1) {
                customer.projects.push({
                  ...currentProject,
                  tasks: [{ ...time.task, times: [time] }]
                })
              } else {
                if
                const taskIndex = customer.projects[projectIndex].tasks
              }
            }

            return customer;
          }))(time.task.project, time.task, time)
        ]
      }
      return [
        ...previousValue,
        ...(time.task !== undefined &&
          time.task.project !== undefined &&
          time.task.project.customer !== undefined &&
          ((findCustomer: ICustomerDTO) =>
            previousValue.findIndex(
              (customer: CustomerDTO) => customer.id === findCustomer.id
            ) !== -1)(time.task.project.customer) === false
          ? [{
            ...time.task.project.customer,
            projects: [{
              ...time.task.project,
              tasks: [{ ...time.task, times: [time] }]
            }]
          }]
          : previousValue.map((customer: ICustomerDTO) => {

          }))
      ];
    }, []).map((customer: ICustomerDTO) => CustomerDTO.parse(customer));
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
