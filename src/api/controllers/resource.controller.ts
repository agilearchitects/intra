// Libs
import { RequestHandler } from "express";
import * as path from "path";

import { ServiceModule } from "simplyserveme";
import { controller, Controller } from "./controller";
import { ResourceEntity } from "../entities/resource.entity";
import { LogModule } from "../modules/log.module";
import { configService } from "../services/config.service";
import { controllerError } from "./controller";

const STORAGE_PATH = path.resolve("./storage/uploads");

const LOG = new LogModule("controller.file");

export class ResourceController extends ServiceModule {
  public upload(): RequestHandler {
    return controller((handler: Controller) => {
      if (handler.request.files !== undefined && handler.request.files.file !== undefined && !(handler.request.files.file instanceof Array)) {
        const uploadedFile = handler.request.files.file;
        const newFilename = uploadedFile.md5;
        // Check for file in DB
        ResourceEntity.findOne({ where: { filename: newFilename } }).then((resource: ResourceEntity | undefined) => {
          if (resource !== undefined) {
            responsCall(resource);
          } else {
            ResourceEntity.create({ filename: newFilename, title: uploadedFile.name }).save().then((resource: ResourceEntity) => {
              // Move file
              uploadedFile.mv(path.resolve(STORAGE_PATH, newFilename)).then(() => {
                responsCall(resource);
              }).catch((error: any) => resource.remove().finally(() => controllerError(LOG, handler.response(), "Error moving file uploaded", error)));
            });
          }
        });
        const responsCall = (resource: ResourceEntity) => {
          const protocol = `${handler.request.protocol}://`;
          let port = configService.get("PORT", "80");
          port = port !== "80" ? `:${port}` : "";
          handler.response<{ location: string }>().json({ location: `${protocol}${configService.get("API_HOST", "")}${port}/resource/${resource.id}` });
        };
      } else {
        handler.response().sendStatus(500);
      }
    });
  }
  public show(): RequestHandler {
    return controller((handler: Controller) => {
      // Get file entity using ID param
      ResourceEntity.findOne(parseInt(handler.params<{ id: string }>().id, 10)).then((resource: ResourceEntity | undefined) => {
        if (resource === undefined) {
          handler.response().sendStatus(404);
          return;
        }
        handler.response().sendFile(path.resolve(STORAGE_PATH, resource.filename), {
          headers: {
            "content-disposition": `attachment; filename="${resource.title}"`,
          },
        }, (error: any) => {
          if (error) {
            controllerError(LOG, handler.response(), "Resource could not be found", error);
          }
        });
      }).catch((error: any) => controllerError(LOG, handler.response(), "Error fetching resource from DB", error));
    });
  }
}

const resourceController: ResourceController = ResourceController.getInstance<ResourceController>();
export default resourceController;