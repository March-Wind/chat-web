export interface HistoryMessage {
  id: number;
  title: string;
}
export type HistoryMessages = HistoryMessage[];
export interface AChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
export type ChatMessages = AChatMessage[];



export const ROLES = ["system", "user", "assistant"] as const;
export type MessageRole = (typeof ROLES)[number];
export interface RequestMessage {
  role: MessageRole;
  content: string;
}

export type Updater<T> = (updater: (value: T) => void) => void;
