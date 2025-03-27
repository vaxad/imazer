export type TImage = {
  file: File;
  url: string;
  id: string;
};

export enum ERole {
  User = "user",
  AI = "ai",
}
export type TUserMessage = {
  role: ERole.User;
  text: string;
  images: Array<TImage>;
};

export type TAiResponse = {
  id: string;
  chunks: string[];
};

export type TAiMessage = {
  role: ERole.AI;
  answers: TAiResponse[];
};

export type TMessage = TAiMessage | TUserMessage;
