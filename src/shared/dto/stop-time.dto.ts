export interface IStopTimeDTO {
  id: number;
  to: string;
}

export class StopTimeDTO implements IStopTimeDTO {
  public static parse(object: IStopTimeDTO): StopTimeDTO {
    return new StopTimeDTO(
      object.id,
      object.to,
    );
  }

  public constructor(
    public readonly id: number,
    public readonly to: string,
  ) { }

  public serialize(): IStopTimeDTO {
    return {
      id: this.id,
      to: this.to,
    };
  }
}
