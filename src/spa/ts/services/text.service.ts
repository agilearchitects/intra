// Bootstrap
import { apiService as apiServiceInstance } from "../bootstrap";

// DTO's
import { ITextDTO, TextDTO } from "../../../shared/dto/text.dto";

// Services
import { APIService } from "../../../shared/services/api.service";

export class TextService {
  public constructor(
    private readonly apiService: APIService,
  ) { }
  public async index(): Promise<TextDTO[]> {
    return (await this.apiService.get<ITextDTO[]>("/text")).body.map((text: ITextDTO) => TextDTO.parse(text));
  }
  public async show(name: string): Promise<TextDTO> {
    return TextDTO.parse((await this.apiService.get<ITextDTO>(`/text/${name}`)).body);
  }
  public async update(payload: TextDTO): Promise<void> {
    await this.apiService.put(`/text/${payload.id}`, payload.serialize());
  }
}
