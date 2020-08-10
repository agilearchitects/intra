// Libs
import moment from "moment";
import { Repository } from "typeorm";

// DTO's
import { CustomerDTO } from "../../shared/dto/customer.dto";
import { ProjectDTO } from "../../shared/dto/project.dto";
import { TaskUserDTO } from "../../shared/dto/task-user.dto";
import { TaskDTO } from "../../shared/dto/task.dto";
import { TimeDTO } from "../../shared/dto/time.dto";
import { UserDTO } from "../../shared/dto/user.dto";

// Entities
import { CustomerEntity } from "../entities/customer.entity";
import { ProjectEntity } from "../entities/project.entity";
import { TaskUserEntity } from "../entities/task-user.entity";
import { TaskEntity } from "../entities/task.entity";
import { TimeEntity } from "../entities/time.entity";
import { UserEntity } from "../entities/user.entity";

// Services
import { ProjectService } from "../services/project.service";

export const projectServiceFactory = (
  dateFormat: string,
  customerEntity: Repository<CustomerEntity>,
  projectEntity: Repository<ProjectEntity>,
  taskEntity: Repository<TaskEntity>,
  taskUserEntity: Repository<TaskUserEntity>,
  timeEntity: Repository<TimeEntity>,
  userEntity: Repository<UserEntity>,
): ProjectService => {
  return new ProjectService(
    "YYYY-MM-DD",
    customerEntity,
    projectEntity,
    taskEntity,
    taskUserEntity,
    timeEntity,
    userEntity,
    CustomerDTO,
    ProjectDTO,
    TaskDTO,
    TaskUserDTO,
    TimeDTO,
    UserDTO,
    moment,
  );
}