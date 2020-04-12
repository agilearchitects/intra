import { UserPayloadDTO } from "@agilearchitects/authenticaton";
import { RequestModule as BaseRequestModule } from "@agilearchitects/server";

export class RequestModule extends BaseRequestModule {
  public user?: UserPayloadDTO;
}