// Entities
import { CustomerEntity } from "../entities/customer.entity";
import { ProjectEntity } from "../entities/project.entity";
import { TaskEntity } from "../entities/task.entity";

// DTO's
import { ICreateCustomerDTO } from "../../shared/dto/create-customer.dto";
import { CustomerDTO, ICustomerDTO } from "../../shared/dto/customer.dto";
import { ProjectDTO } from "../../shared/dto/project.dto";
import { TaskDTO } from "../../shared/dto/task.dto";

export class CustomerService {
  public constructor(
    private readonly customerEntity: typeof CustomerEntity,
    private readonly customerDTO: typeof CustomerDTO,
    private readonly projectDTO: typeof ProjectDTO,
    private readonly taskDTO: typeof TaskDTO,
  ) { }

  public async getWithUserProjects(userId: number): Promise<ICustomerDTO[]> {
    return (await this.customerEntity.find({
      relations: [
        "projects",
        "projects.tasks",
        "projects.tasks.times",
        "projects.tasks.times.tags",
        "projects.projectUsers",
        "projects.projectUsers.user",
      ],
      where: `"CustomerEntity__projects__projectUsers__user"."id" = ${userId}`,
    })).map((customer: CustomerEntity) => this.customerDTO.parse({
      id: customer.id,
      name: customer.name,
      ...(customer.projects.length > 0 ? {
        projects: customer.projects.map((project: ProjectEntity) => this.projectDTO.parse({
          id: project.id,
          name: project.name,
          ...(project.rate !== null ? { rate: project.rate } : undefined),
          ...(project.priceBudget !== null ? { priceBudget: project.priceBudget } : undefined),
          ...(project.hoursBudget !== null ? { hoursBudget: project.hoursBudget } : undefined),
          tasks: project.tasks.map((task: TaskEntity) => this.taskDTO.parse({
            id: task.id,
            name: task.name,
            ...(task.rate !== null ? { rate: task.rate } : undefined),
            ...(task.priceBudget !== null ? { priceBudget: task.priceBudget } : undefined),
            ...(task.hoursBudget !== null ? { hoursBudget: task.hoursBudget } : undefined),
          }).serialize()),
        }).serialize()),
      } : undefined),
    }).serialize());
  }
  public async getEvery(): Promise<ICustomerDTO[]> {
    return (await this.customerEntity.find()).map((customer: CustomerEntity) => this.parseCustomerEntityToDTO(customer));
  }
  public async create(customer: ICreateCustomerDTO): Promise<ICustomerDTO> {
    const newCustomer = await this.customerEntity.create({
      name: customer.name,
    }).save();
    return this.parseCustomerEntityToDTO(newCustomer);

  }
  public async update(customer: ICustomerDTO): Promise<ICustomerDTO> {
    const foundCustomer = await this.customerEntity.findOneOrFail(customer.id);
    foundCustomer.name = customer.name;
    await foundCustomer.save();

    return this.parseCustomerEntityToDTO(foundCustomer);
  }
  public async delete(customerId: number): Promise<void> {
    await this.customerEntity.delete(customerId);
  }

  private parseCustomerEntityToDTO(customer: CustomerEntity): ICustomerDTO {
    return this.customerDTO.parse({
      id: customer.id,
      name: customer.name,
    }).serialize();
  }
}
