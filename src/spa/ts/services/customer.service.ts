// DTO's
import { CreateCustomerDTO, ICreateCustomerDTO } from "../../../shared/dto/create-customer.dto";
import { CustomerDTO, ICustomerDTO } from "../../../shared/dto/customer.dto";

// Services
import { APIService } from "../../../shared/services/api.service";
import { ErrorService } from "./error.service";

export class CustomerService {
  public constructor(
    private readonly apiService: APIService,
    private readonly errorService: ErrorService,
  ) { }
  public async index(): Promise<CustomerDTO[]> {
    try {
      return (await this.apiService.get<ICustomerDTO[]>("/customer")).body.map((customer: ICustomerDTO) => CustomerDTO.parse(customer));
    } catch (error) {
      this.errorService.submit({ message: "Error while fetching customers", error });
      throw error;
    }
  }
  public async create(payload: CreateCustomerDTO): Promise<CustomerDTO> {
    try {
      return CustomerDTO.parse((await this.apiService.post<ICreateCustomerDTO, ICustomerDTO>("/customer", payload.serialize())).body);
    } catch (error) {
      this.errorService.submit({ message: "Error while creating customer", error });
      throw error;
    }
  }
}
