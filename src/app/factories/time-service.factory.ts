// Libs
import moment from "moment";
import { Between, Repository } from "typeorm";

// DTO's
import { CustomerDTO } from "../../shared/dto/customer.dto"
import { ProjectDTO } from "../../shared/dto/project.dto"
import { TagDTO } from "../../shared/dto/tag.dto"
import { TaskDTO } from "../../shared/dto/task.dto"
import { TimeDTO } from "../../shared/dto/time.dto"

// Entites
import { TagEntity } from "../entities/tag.entity"
import { TaskEntity } from "../entities/task.entity"
import { TimeEntity } from "../entities/time.entity"
import { UserEntity } from "../entities/user.entity"

// Services
import { TimeService } from "../services/time.service"

export const timeServiceFactory = (
  dateTimeFormat: string,
  timeEntity: Repository<TimeEntity>,
  tagEntity: Repository<TagEntity>,
  taskEntity: Repository<TaskEntity>,
  userEntity: Repository<UserEntity>,
): TimeService => {
  return new TimeService(
    dateTimeFormat,
    timeEntity,
    tagEntity,
    taskEntity,
    userEntity,
    CustomerDTO,
    ProjectDTO,
    TagDTO,
    TaskDTO,
    TimeDTO,
    moment,
    Between,
  )
}