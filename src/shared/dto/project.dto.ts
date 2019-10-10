import { CustomerDTO, ICustomerDTO } from "./customer.dto";
import { ITimeDTO, TimeDTO } from "./time.dto";

export interface IProjectDTO {
  id: number;
  name: string;
  customer?: ICustomerDTO;
  times?: ITimeDTO[];
}

export class ProjectDTO implements IProjectDTO {
  public static parse(object: IProjectDTO): ProjectDTO {
    return new ProjectDTO(
      object.id,
      object.name,
      (object.customer ? CustomerDTO.parse(object.customer) : undefined),
      (object.times ? object.times.map((time: ITimeDTO) => TimeDTO.parse(time)) : undefined),
    );
  }

  public constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly customer?: CustomerDTO,
    public readonly times?: TimeDTO[],
  ) { }

  public serialize(): IProjectDTO {
    return {
      id: this.id,
      name: this.name,
      ...(this.customer ? { customer: this.customer.serialize() } : null),
      ...(this.times ? { times: this.times.map((time: TimeDTO) => time.serialize()) } : null),
    };
  }
}
