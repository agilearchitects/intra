// Libs
import { RequestHandler } from "express";
import * as path from "path";

// Entites
import { ResourceEntity } from "../entities/resource.entity";

// Modules
import { controller, ControllerHandler } from "../modules/controller-handler.module";

// Bootstrap
import { envService } from "../bootstrap";

// Base controller
import { Controller } from "./controller";

export class ResourceController extends Controller {
  public constructor(
    private readonly storagePath: string = "./storage/uploads",
  ) { super(); }

  public upload(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        const responsCall = (resource: ResourceEntity) => {
          const protocol = `${handler.request.protocol}://`;
          let port = envService.get("PORT", "1234");
          port = port !== "80" ? `:${port}` : "";
          handler.response<{ location: string }>().json({ location: `${protocol}${envService.get("API_HOST", "")}${port}/resource/${resource.id}` });
        };
        if (handler.request.files !== undefined && handler.request.files.file !== undefined && !(handler.request.files.file instanceof Array)) {
          const uploadedFile = handler.request.files.file;
          const newFilename = uploadedFile.md5;
          // Check for file in DB
          let resource = await ResourceEntity.findOne({ where: { filename: newFilename } });
          if (resource === undefined) {
            resource = await ResourceEntity.create({ filename: newFilename, title: uploadedFile.name });
          }
          responsCall(resource);
          if (resource !== undefined) {
            responsCall(resource);
          }
        }
        handler.sendStatus(500, "Error while parsing file input");
      } catch (error) {
        this.logError(handler.response(), "Error moving file uploaded", error);
        throw error;
      }

    });
  }
  public show(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      // Get file entity using ID param
      try {
        const resource = await ResourceEntity.findOne(parseInt(handler.params<{ id: string }>().id, 10));
        if (resource === undefined) {
          handler.response().sendStatus(404);
        } else {
          handler.response().sendFile(path.resolve(this.storagePath, resource.filename), {
            headers: {
              "content-disposition": `attachment; filename="${resource.title}"`,
            },
          }, (error: any) => {
            if (error) {
              this.logError(handler.response(), "Resource could not be found", error);
            }
          });
        }
      } catch (error) {
        this.logError(handler.response(), "Error fetching resource from DB", error);
        throw error;
      }
    });
  }
}

const resourceController: ResourceController = new ResourceController();
export default resourceController;
