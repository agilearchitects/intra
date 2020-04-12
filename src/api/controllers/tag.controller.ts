// Libs
import { handlerMethod, HandlerModule } from "@agilearchitects/server";

// Base controller
import { TagDTO } from "../../shared/dto/tag.dto";
import { TagEntity } from "../../shared/entities/tag.entity";
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

const tagController: TagController = new TagController();
export default tagController;
