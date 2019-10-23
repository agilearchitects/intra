export interface ITimeQueryDTO {
  date?: string;
  year?: string;
  month?: string;
  week?: string;
  all?: boolean;
  groupBy?: "customer";
}

export class TimeQueryDTO implements ITimeQueryDTO {
  public static parse(object: ITimeQueryDTO) {
    return new TimeQueryDTO(
      object.date,
      object.year,
      object.month,
      object.week,
      object.all,
      object.groupBy,
    );
  }

  public constructor(
    public readonly date?: string,
    public readonly year?: string,
    public readonly month?: string,
    public readonly week?: string,
    public readonly all?: boolean,
    public readonly groupBy?: "customer",
  ) { }

  public serialize(): ITimeQueryDTO {
    return {
      ...(this.date !== undefined ? { date: this.date } : undefined),
      ...(this.year !== undefined ? { year: this.year } : undefined),
      ...(this.month !== undefined ? { month: this.month } : undefined),
      ...(this.week !== undefined ? { week: this.week } : undefined),
      ...(this.all !== undefined ? { all: this.all } : undefined),
      ...(this.groupBy !== undefined ? { groupBy: this.groupBy } : undefined),
    };
  }
}
