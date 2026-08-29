import { createHmac, randomUUID } from "node:crypto";
import type { ImageKitAuthParams } from "@repo/types";
import { InternalServerError } from "./errors";

const PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
const PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY;
const URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT;

const MAX_EXPIRE_SECONDS = 60 * 60;
const DEFAULT_EXPIRE_SECONDS = 30 * 60;

export function getImageKitAuthParams(
  token: string = randomUUID(),
  expireSeconds: number = DEFAULT_EXPIRE_SECONDS
): ImageKitAuthParams {
  if (!PRIVATE_KEY || !PUBLIC_KEY || !URL_ENDPOINT) {
    throw new InternalServerError("ImageKit is not configured");
  }

  const ttl = Math.min(Math.max(Math.trunc(expireSeconds), 1), MAX_EXPIRE_SECONDS);
  const expire = Math.floor(Date.now() / 1000) + ttl;

  const signature = createHmac("sha1", PRIVATE_KEY)
    .update(token + expire)
    .digest("hex");

  return {
    token,
    expire,
    signature,
    publicKey: PUBLIC_KEY,
    urlEndpoint: URL_ENDPOINT,
  };
}
