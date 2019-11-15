// Libs
import { RequestHandler } from "express";

// Entites
import { TimeEntity } from "../entities/time.entity";

// Modules
import { controller, ControllerHandler } from "../modules/controller-handler.module";

// Base controller
import { ITagDTO, TagDTO } from "../../shared/dto/tag.dto";
import { TagEntity } from "../entities/tag.entity";
import { Controller } from "./controller";

export class TagController extends Controller {
  public index(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        const tags: TagEntity[] = await TagEntity.find();
        handler.response<ITagDTO[]>().json(tags.map((tag: TagEntity) => TagDTO.parse({
          id: tag.id,
          name: tag.name,
        }).serialize()));
      } catch (error) {
        this.logError(handler.response(), "Error getting tags", error);
      }
    });
  }
}

const tagController: TagController = new TagController();
export default tagController;
