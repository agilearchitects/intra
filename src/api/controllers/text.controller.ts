// Libs
import { bodyType, handlerMethod, HandlerModule, paramType, parse } from "@agilearchitects/server";

// Entites
import { TextEntity } from "../../shared/entities/text.entity";

// DTO's
import { TextDTO } from "../../shared/dto/text.dto";

// Base controller
import { DTO } from "../../shared/dto/dto";
import { Controller } from "./controller";

export class TextController extends Controller {
  public index(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        const texts = await TextEntity.find();
        handler.sendJSON(texts.map((text: TextEntity) => TextDTO.parse({
          id: text.id,
          name: text.name,
          content: text.content,
        }).serialize()));
      } catch (error) {
        this.logError(handler, "Could not get texts");
        throw error;
      }
    };
  }
  public show(): handlerMethod {
    return async (handler: HandlerModule<any, { name: string }>) => {
      try {
        const textName = handler.params.name.toLowerCase();
        let text = await TextEntity.findOne({ where: { name: textName } });
        if (text === undefined) {
          text = await TextEntity.create({ name: textName, content: "" }).save();
        }
        handler.sendJSON(TextDTO.parse({
          id: text.id,
          name: text.name,
          content: text.content,
        }).serialize());
      } catch (error) {
        this.logError(handler, "Could not get text", error);
        throw error;
      }
    };
  }
  @parse((object: bodyType) => {
    object = DTO.parseFromRequest(object);
    if (typeof object.content !== "string") {
      throw new Error("Unable to parse");
    }
    return {
      content: object.content
    };
  }, "body")
  @parse((object: paramType) => {
    if (object.id === undefined) {
      throw new Error("Unable to parse");
    }
    return {
      id: object.id,
    };
  }, "params")
  public update(): handlerMethod {
    return async (handler: HandlerModule<{ content: string }, { id: string }>) => {
      try {
        await TextEntity.update(handler.params.id, { content: handler.parsedBody.content });
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler, "Could not update text", error);
        throw error;
      }
    };
  }
}

const textController: TextController = new TextController();
export default textController;
