// Services
import { APIService } from "../../../shared/services/api.service";

export interface IDTO {
  serialize: () => any;
}

export abstract class BaseService<T extends IDTO> {
  protected abstract basePath: string;

  public constructor(
    protected readonly apiService: APIService,
    private readonly parser: (entity: any) => T,
  ) { }

  public async index(): Promise<T[]> {
    return (await this.apiService.get<any[]>(this.basePath))
      .body.map((entity: any) => this.parser(entity));
  }
  public async show(id: number | string): Promise<T> {
    return this.parser((await this.apiService.get<any>(`${this.basePath}/${id}`)).body);
  }
  public async create(entity: T): Promise<void> {
    await this.apiService.post(this.basePath, entity.serialize());
  }
  public async update(id: number | string, entity: T): Promise<void> {
    await this.apiService.put(`${this.basePath}/${id}`, entity.serialize());
  }
  public async remove(id: number | string) {
    await this.apiService.delete(`${this.basePath}/${id}`);
  }
}