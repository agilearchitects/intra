import { stringify } from "querystring";
import DTO from "./dto";

export interface IText {
  id: number;
  name: string;
  content: string;
}

export interface ITextDTO extends IText { } // tslint:disable-line:no-empty-interface
export interface ITextJSON extends IText { } // tslint:disable-line:no-empty-interface

export class TextDTO extends DTO<ITextDTO> implements ITextDTO {

  public static parse(object: ITextJSON): TextDTO {
    return new TextDTO({
      id: object.id,
      name: object.name,
      content: object.content,
    });
  }
  public id!: number;
  public name!: string;
  public content!: string;

  public serialize(): ITextJSON {
    return {
      id: this.id,
      name: this.name,
      content: this.content,
    };
  }
}
