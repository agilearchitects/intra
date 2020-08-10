// Libs
import { EnvService } from "@agilearchitects/env"
import Axios from "axios";

// Services
import { GoogleService } from "../services/google.service"

export const googleServiceFactory = (
  envService: EnvService,
): GoogleService => {
  return new GoogleService(
    envService.get("GOOGLE_CLIENT_ID", ""),
    envService.get("GOOGLE_CLIENT_SECRET", ""),
    envService.get("GOOGLE_CLIENT_REDIRECT", ""),
    envService.get("GOOGLE_RECAPTCHA_SECRET", ""),
    Axios.create(),
  );
}