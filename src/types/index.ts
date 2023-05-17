export interface HistoryMessage {
  id: number;
  title: string;
}
export interface AChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
export type ChatMessages = AChatMessage[];
