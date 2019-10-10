// Libs
import { RequestHandler } from "express";

// Entites
import { TextEntity } from "../entities/text.entity";

// Modules
import { controller, ControllerHandler } from "../modules/controller-handler.module";

// DTO's
import { ITextDTO, TextDTO } from "../../shared/dto/text.dto";

// Base controller
import { Controller } from "./controller";

export class TextController extends Controller {
  public index(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        const texts = await TextEntity.find();
        handler.response<ITextDTO[]>().json(texts.map((text: TextEntity) => TextDTO.parse({
          id: text.id,
          name: text.name,
          content: text.content,
        }).serialize()));
      } catch (error) {
        this.logError(handler.response(), "Could not get texts");
        throw error;
      }
    });
  }
  public show(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        const textName = (handler.params<{ name: string }>().name as string).toLowerCase();
        let text = await TextEntity.findOne({ where: { name: textName } });
        if (text === undefined) {
          text = await TextEntity.create({ name: textName, content: "" }).save();
        }
        handler.response<ITextDTO>().json(TextDTO.parse({
          id: text.id,
          name: text.name,
          content: text.content,
        }).serialize());
      } catch (error) {
        this.logError(handler.response(), "Could not get text", error);
        throw error;
      }
    });
  }

  public update() {
    return controller(async (handler: ControllerHandler) => {
      try {
        await TextEntity.update(handler.params<{ id: string }>().id, { content: handler.body<{ content: string }>().content });
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler.response(), "Could not update text", error);
        throw error;
      }
    });
  }
}

const textController: TextController = new TextController();
export default textController;
