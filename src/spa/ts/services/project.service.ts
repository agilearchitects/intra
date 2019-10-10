// Bootstrap
import { apiService as apiServiceInstance } from "../bootstrap";

// DTO's
import { CreateProjectDTO } from "../../../shared/dto/create-project.dto";

// Services
import { APIService } from "../../../shared/services/api.service";

export class ProjectService {
  public constructor(
    private readonly apiService: APIService,
  ) { }

  public async create(payload: CreateProjectDTO): Promise<void> {
    await this.apiService.post("/project", payload.serialize());
  }
}
