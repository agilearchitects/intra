// DTO's
import { ITagDTO, TagDTO } from "../../../shared/dto/tag.dto";

// Services
import { APIService } from "../../../shared/services/api.service";
import { ErrorService } from "./error.service";

export class TagService {
  public constructor(
    private readonly apiService: APIService,
    private readonly errorService: ErrorService,
  ) { }
  public async index(): Promise<TagDTO[]> {
    try {
      return (await this.apiService.get<ITagDTO[]>("/tag")).body.map((tag: ITagDTO) => TagDTO.parse(tag));
    } catch (error) {
      this.errorService.submit({ message: "Error while fetching tags", error });
      throw error;
    }
  }
}
