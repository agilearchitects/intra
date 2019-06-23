import DTO from "./dto";

export interface ICreateProject<A, B> {
  id: number;
  foo?: A;
  bar?: B[];
}

export interface ICreateProjectDTO extends ICreateProject<ICreateProjectDTO, ICreateProjectDTO> { }
export interface ICreateProjectJSON extends ICreateProject<ICreateProjectJSON, ICreateProjectJSON> { }

export class CreateProjectDTO extends DTO<ICreateProjectDTO> implements ICreateProjectDTO {
  public static parse(object: ICreateProjectJSON): CreateProjectDTO {
    return new CreateProjectDTO({
      id: object.id,
      ...(object.foo ? { foo: CreateProjectDTO.parse(object.foo) } : null),
      ...(object.bar ? { projects: object.bar.map((bar: ICreateProjectJSON) => CreateProjectDTO.parse(bar)) } : null),
    });
  }
  public id!: number;
  public foo?: CreateProjectDTO;
  public bar?: CreateProjectDTO[];

  public serialize(): ICreateProjectJSON {
    return {
      id: this.id,
      ...(this.foo ? { foo: this.foo.serialize() } : null),
      ...(this.bar ? { bar: this.bar.map((foo: CreateProjectDTO) => foo.serialize()) } : null),
    };
  }
}
