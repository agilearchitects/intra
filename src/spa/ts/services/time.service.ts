// Bootstrap
import { apiService as apiServiceInstance } from "../bootstrap";

// DTO's
import { CreateTimeDTO } from "../../../shared/dto/create-time.dto";
import { StopTimeDTO } from "../../../shared/dto/stop-time.dto";
import { TimeQueryDTO } from "../../../shared/dto/time-query.dto";
import { ITimeDTO, TimeDTO } from "../../../shared/dto/time.dto";
import { UpdateTimeDTO } from "../../../shared/dto/update-time.dto";

// Dictionary
import { IDictionary } from "../../../shared/index";

// Services
import { CustomerDTO, ICustomerDTO } from "../../../shared/dto/customer.dto";
import { APIService } from "../../../shared/services/api.service";


export class TimeService {
  public constructor(
    private readonly apiService: APIService,
  ) { }
  public async index(timeQuery: TimeQueryDTO): Promise<TimeDTO[] | CustomerDTO[]> {
    // Parse any empty
    const query: IDictionary<string> = Object.keys(timeQuery).reduce((previousValue: {}, key: string) => {
      return { ...previousValue, ...(timeQuery[key] !== undefined ? { [key]: timeQuery[key] } : undefined) };
    }, {});
    if (timeQuery.groupBy === "customer") {
      return (await this.apiService.get<ICustomerDTO[]>("/time", query)).body.map((customer: ICustomerDTO) => CustomerDTO.parse(customer));
    } else {
      return (await this.apiService.get<ITimeDTO[]>("/time", query)).body.map((time: ITimeDTO) => TimeDTO.parse(time));
    }
  }
  public async show(timeId: number): Promise<TimeDTO> {
    return TimeDTO.parse((await this.apiService.get<ITimeDTO>(`/time/${timeId}`)).body);
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
