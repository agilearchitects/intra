import { ITimeDTO, TimeDTO } from "./time.dto";

export interface ITagDTO {
  id: number;
  name: string;
  times?: ITimeDTO[];
}

export class TagDTO implements ITagDTO {
  public static parse(object: ITagDTO) {
    return new TagDTO(
      object.id,
      object.name,
      object.times !== undefined ? object.times.map((time: ITimeDTO) => TimeDTO.parse(time)) : undefined,
    );
  }

  public constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly times?: TimeDTO[],
  ) { }

  public serialize(): ITagDTO {
    return {
      id: this.id,
      name: this.name,
      ...(this.times !== undefined ? { times: this.times.map((time: TimeDTO) => time.serialize()) } : {}),
    };
  }
}
