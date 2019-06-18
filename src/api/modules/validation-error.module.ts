export default class ValidationErrorModule {
  public validationName: string | null;
  public propertyName: string | null;
  public value: string | number | boolean | null;
  constructor({ validationName = null, propertyName = null, value = null }: {
    validationName?: string | null,
    propertyName?: string | null,
    value?: string | number | boolean | null,
  }) {
    this.validationName = validationName;
    this.propertyName = propertyName;
    this.value = value;
  }
}
