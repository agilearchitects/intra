import { IUserDTO, UserDTO } from "../../../shared/dto/user.dto";
import { APIService } from "../../../shared/services/api.service";

export class UserService {
  public constructor(
    private readonly apiService: APIService,
  ) {
  }
  public async index(): Promise<UserDTO[]> {
    return (await this.apiService.get<IUserDTO[]>("/user")).body.map((user: IUserDTO) => UserDTO.parse({
      id: user.id,
      email: user.email,
    }));
  }
}
