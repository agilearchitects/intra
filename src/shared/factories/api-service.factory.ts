// Libs
import Axios from "axios";
import * as querystring from "querystring";

import { APIService } from "../services/api.service";

export const apiServiceFactory = (): APIService => {
  return new APIService(process.env.BASE_API_URL || "", Axios.create(), querystring);
}