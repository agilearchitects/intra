// DTO's
import { UserDTO } from "../../../shared/dto/user.dto";

// Services
import { APIService } from "../../../shared/services/api.service";

// Base service
import { BaseService } from "./base.service";

export class UserService extends BaseService<UserDTO> {
  protected basePath: string = "user";

  public constructor(
    apiService: APIService,
  ) { super(apiService, UserDTO.parse); }
}