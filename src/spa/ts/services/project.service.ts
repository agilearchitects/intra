// Bootstrap
import { apiService as apiServiceInstance } from "../bootstrap";

// DTO's
import { CreateProjectDTO } from "../../../shared/dto/create-project.dto";
import { IProjectDTO, ProjectDTO } from "../../../shared/dto/project.dto";

// Services
import { APIService } from "../../../shared/services/api.service";

export class ProjectService {
  public constructor(
    private readonly apiService: APIService,
  ) { }
  public async index(): Promise<ProjectDTO[]> {
    return (await this.apiService.get<IProjectDTO[]>("/project")).body.map((project: IProjectDTO) => ProjectDTO.parse(project));
  }
  public async get(id: number): Promise<ProjectDTO> {
    return ProjectDTO.parse((await this.apiService.get<IProjectDTO>(`/project/${id}`)).body);
  }
  public async create(payload: CreateProjectDTO): Promise<void> {
    await this.apiService.post("/project", payload.serialize());
  }
  public async update(payload: ProjectDTO): Promise<void> {
    await this.apiService.put(`/project/${payload.id}`, payload.serialize());
  }
}
