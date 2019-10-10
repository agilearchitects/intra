export interface ITextDTO {
  id: number;
  name: string;
  content: string;
}

export class TextDTO implements ITextDTO {

  public static parse(object: ITextDTO): TextDTO {
    return new TextDTO(
      object.id,
      object.name,
      object.content,
    );
  }

  public constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly content: string,
  ) { }

  public serialize(): ITextDTO {
    return {
      id: this.id,
      name: this.name,
      content: this.content,
    };
  }
}
