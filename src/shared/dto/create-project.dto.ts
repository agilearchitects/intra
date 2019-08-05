import DTO from "./dto";

export interface ICreateProject {
  name: string;
  customerId: number;
}

export interface ICreateProjectDTO extends ICreateProject { }
export interface ICreateProjectJSON extends ICreateProject { }

export class CreateProjectDTO extends DTO<ICreateProjectDTO> implements ICreateProjectDTO {
  public static parse(object: ICreateProjectJSON): CreateProjectDTO {
    return new CreateProjectDTO({
      name: object.name,
      customerId: object.customerId,
    });
  }
  public name!: string;
  public customerId!: number;

  public serialize(): ICreateProjectJSON {
    return {
      name: this.name,
      customerId: this.customerId,
    };
  }
}
