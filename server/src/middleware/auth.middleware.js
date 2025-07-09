import { auth } from "express-oauth2-jwt-bearer";
import { ENV } from "../config/env.js";

export const jwtCheck = auth({
  audience: ENV.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${ENV.AUTH0_DOMAIN}`,
  tokenSigningAlg: "RS256",
});
