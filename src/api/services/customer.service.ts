// Libs
import moment from "moment";

// Entities
import { CustomerEntity } from "../../shared/entities/customer.entity";
import { ProjectEntity } from "../../shared/entities/project.entity";
import { TaskEntity } from "../../shared/entities/task.entity";

// DTO's
import { ICreateCustomerDTO } from "../../shared/dto/create-customer.dto";
import { CustomerDTO, ICustomerDTO } from "../../shared/dto/customer.dto";
import { ProjectDTO } from "../../shared/dto/project.dto";
import { TagDTO } from "../../shared/dto/tag.dto";
import { TaskDTO } from "../../shared/dto/task.dto";
import { TimeDTO } from "../../shared/dto/time.dto";
import { TagEntity } from "../../shared/entities/tag.entity";
import { TimeEntity } from "../../shared/entities/time.entity";

export class CustomerService {
  public constructor(
    private readonly customerEntity: typeof CustomerEntity,
    private readonly customerDTO: typeof CustomerDTO,
    private readonly projectDTO: typeof ProjectDTO,
    private readonly taskDTO: typeof TaskDTO,
    private readonly timeDTO: typeof TimeDTO,
    private readonly tagDTO: typeof TagDTO,
  ) { }

  public async getWithUserProjects(userId: number): Promise<ICustomerDTO[]> {
    return (await this.customerEntity.find({
      relations: [
        "projects",
        "projects.tasks",
        "projects.tasks.taskUsers",
        "projects.tasks.taskUsers.user",
        "projects.tasks.times",
        "projects.tasks.times.tags",
      ],
      where: `"CustomerEntity__projects__tasks__taskUsers__user"."id" = ${userId}`,
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
            ...(task.times !== undefined ? {
              times: task.times.map((time: TimeEntity) => this.timeDTO.parse({
                id: time.id,
                from: moment(time.from).format("YYYY-MM-DD hh:mm:ss"),
                ...(time.to !== null ? { to: moment(time.to).format("YYYY-MM-DD hh:mm:ss") } : undefined),
                comment: time.comment !== null ? time.comment : "",
                ...(time.tags !== undefined ? {
                  tags: time.tags.map((tag: TagEntity) => this.tagDTO.parse({
                    id: tag.id,
                    name: tag.name,
                  }).serialize())
                } : undefined)
              }).serialize())
            } : undefined)
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
