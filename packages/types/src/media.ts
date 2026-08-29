/** Client-side upload credentials issued by the backend for ImageKit. */
export type ImageKitAuthParams = {
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
  urlEndpoint: string;
};

/** Subset of the ImageKit upload response the app cares about. */
export type UploadedImage = {
  fileId: string;
  name: string;
  filePath: string;
  url: string;
  thumbnailUrl: string;
  height?: number;
  width?: number;
  size?: number;
};
