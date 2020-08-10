// Libs
import { handlerMethod, HandlerModule, jsonType, parse } from "@agilearchitects/server";

// Entites
import { TextEntity } from "../entities/text.entity";

// DTO's
import { TextDTO } from "../../shared/dto/text.dto";

// Base controller
import { IDictionaryDTO } from "../../shared/dto/dictionary.dto";
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
    return async (handler: HandlerModule) => {
      try {
        const textName = handler.request.params.name.toLowerCase();
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
  @parse((object: IDictionaryDTO<jsonType>) => {
    if (typeof object.content !== "string") {
      throw new Error("Unable to parse");
    }
    return {
      content: object.content
    };
  }, "json")
  @parse((object: IDictionaryDTO<string>) => {
    if (object.id === undefined) {
      throw new Error("Unable to parse");
    }
    return {
      id: object.id,
    };
  }, "params")
  public update(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        await TextEntity.update(handler.request.params.id, { content: handler.request.body.content });
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler, "Could not update text", error);
        throw error;
      }
    };
  }
}
