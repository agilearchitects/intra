// Bootstrap
import { apiService as apiServiceInstance, errorService as errorServiceInstance } from "../bootstrap";

// DTO's
import { CreateCustomerDTO } from "../../../shared/dto/create-customer.dto";
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
  public async create(payload: CreateCustomerDTO): Promise<void> {
    try {
      await this.apiService.post("/customer", payload.serialize());
    } catch (error) {
      this.errorService.submit({ message: "Error while creating customer", error });
      throw error;
    }
  }
}
