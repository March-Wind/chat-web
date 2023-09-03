import Locale, { getLang, Lang } from '@/assets/locales';
// import { DEFAULT_TOPIC, ChatMessage } from "./chat";
import { RequestMessage } from '@/types';
import { ModelConfig, useAppConfig, ModelType } from './config';
export type ChatMessage = RequestMessage & {
  // date: string;
  streaming?: boolean;
  isError?: boolean;
  id?: string;
  model?: ModelType;
  reader?: Promise<ReadableStreamDefaultReader<Uint8Array> | void>;
};
export type Mask = {
  id: string;
  avatar: string;
  name: string;
  type: 'system' | 'user' | 'base';
  context?: Message[];
  modelConfig: {
    temperature: number; // 0-2
  };
};

export const DEFAULT_MASK_STATE = {
  masks: [] as Mask[],
  globalMaskId: 0,
};

export type MaskState = typeof DEFAULT_MASK_STATE;

export const DEFAULT_MASK_ID = 1145141919810;
export const DEFAULT_MASK_AVATAR = 'gpt-bot';

export const DEFAULT_TOPIC = Locale.Store.DefaultTopic;

export const createEmptyMask = (id = '') =>
  ({
    id,
    avatar: DEFAULT_MASK_AVATAR,
    name: '新预设',
    type: 'user',
    modelConfig: {
      temperature: 0,
    },
  } as Mask);
