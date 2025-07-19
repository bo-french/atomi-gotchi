export type LoginMessage = {
  type: "success" | "error";
  text: string;
};

export enum LoginMode {
  LOG_IN,
  SIGN_UP,
}
