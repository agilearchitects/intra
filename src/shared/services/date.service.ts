import moment from "moment";

export class DateService {
  public constructor(
    private readonly momentModule: typeof moment
  ) { }

  public format(date: string | Date, format?: string): string {
    return this.momentModule(date).format(format);
  }
  public parse(date: string, format?: string, strict?: boolean): Date {
    return this.momentModule(date, format, strict).toDate();
  }
}