// Libs
import { LogModule } from "@agilearchitects/logmodule";
import { handlerMethod, HandlerModule } from "@agilearchitects/server";
import * as path from "path";

// Entites
import { ResourceEntity } from "../../shared/entities/resource.entity";

// Base controller
import { Controller } from "./controller";

export class ResourceController extends Controller {
  public constructor(
    private readonly storagePath: string = "./storage/uploads",
    log: LogModule,
  ) { super(log); }

  /*public upload(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        const responsCall = (resource: ResourceEntity) => {
          const protocol = `${handler.request.protocol}://`;
          let port = envService.get("PORT", "1234");
          port = port !== "80" ? `:${port}` : "";
          handler.sendJSON({ location: `${protocol}${envService.get("API_HOST", "")}${port}/resource/${resource.id}` });
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
  }*/
  public show(): handlerMethod {
    return async (handler: HandlerModule) => {
      // Get file entity using ID param
      try {
        const resource = await ResourceEntity.findOne(handler.request.params.id);
        if (resource === undefined) {
          handler.sendStatus(404);
        } else {
          handler.response.sendFile(path.resolve(this.storagePath, resource.filename), {
            "content-disposition": `attachment; filename="${resource.title}"`,
          });
        }
      } catch (error) {
        this.logError(handler, "Error fetching resource from DB", error);
        throw error;
      }
    };
  }
}
