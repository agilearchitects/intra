import { Repository } from "typeorm";
import { CustomerDTO } from "../../shared/dto/customer.dto";
import { ProjectDTO } from "../../shared/dto/project.dto";
import { TagDTO } from "../../shared/dto/tag.dto";
import { TaskDTO } from "../../shared/dto/task.dto";
import { TimeDTO } from "../../shared/dto/time.dto";
import { CustomerEntity } from "../entities/customer.entity";
import { CustomerService } from "../services/customer.service";

export const customerServiceFactory = (
  customerEntity: Repository<CustomerEntity>,
): CustomerService => {
  return new CustomerService(
    customerEntity,
    CustomerDTO,
    ProjectDTO,
    TaskDTO,
    TimeDTO,
    TagDTO,
  );
}