import { Request, RequestHandler, Response } from "express";
import { ITextJSON, TextDTO } from "../../shared/dto/text.dto";
import { TextEntity } from "../entities/text.entity";
import { LogModule } from "../modules/log.module";
import { controllerError, IRequest } from "./controller";

const LOG = new LogModule("controller.text");

export class TextController {
  public index(): RequestHandler {
    return (request: Request, response: Response): void => {
      TextEntity.find().then((texts: TextEntity[]) => {
        response.json(texts.map((text: TextEntity) => TextDTO.parse({
          id: text.id,
          name: text.name,
          content: text.content,
        }).serialize()));
      }).catch((error: any) => {
        LOG.error({ title: "Could not get texts", data: { error } });
        response.sendStatus(500);
      });
    };
  }
  public show(): RequestHandler {
    return (request: Request, response: Response): void => {
      const textName = (request.params.name as string).toLowerCase();

      const next = (text: TextEntity) => {
        response.json(TextDTO.parse({
          id: text.id,
          name: text.name,
          content: text.content,
        }).serialize());
      };

      TextEntity.findOne({ where: { name: textName } }).then((text: TextEntity | undefined) => {
        if (text === undefined) {
          TextEntity.create({ name: textName, content: "" }).save().then((text: TextEntity) => {
            next(text);
          });
        } else {
          next(text);
        }
      }).catch((error: any) => controllerError(LOG, response, "Could not get text", error));
    };
  }

  public update() {
    return (request: IRequest<ITextJSON>, response: Response): void => {
      TextEntity.update(request.params.id, { content: request.body.content }).then(() => response.sendStatus(200)).catch((error: any) => controllerError(LOG, response, "Could not save text", error));
    };
  }
}

const textController: TextController = new TextController();
export default textController;
