export type RequestMessage = {
  type: "success" | "error";
  text: string;
};

export enum LoginMode {
  LOG_IN,
  SIGN_UP,
}
