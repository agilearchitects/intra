// Libs
import { handlerMethod, HandlerModule } from "@agilearchitects/server";

// Services
import { TagEntity } from "../entities/tag.entity";

// DTO's
import { TagDTO } from "../../shared/dto/tag.dto";

// Base controller
import { Controller } from "./controller";

export class TagController extends Controller {
  public index(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        const tags: TagEntity[] = await TagEntity.find();
        handler.sendJSON(tags.map((tag: TagEntity) => TagDTO.parse({
          id: tag.id,
          name: tag.name,
        }).serialize()));
      } catch (error) {
        this.logError(handler, "Error getting tags", error);
      }
    }
  }
}
