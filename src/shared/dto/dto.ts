export default class DTO<T extends { [key: string]: any }> {
  protected constructor(properties: T) {
    Object.keys(properties).forEach((key: string) => {
      (this as any)[key] = properties[key];
    });
  }
}
