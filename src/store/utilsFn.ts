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
};
export type Mask = {
  id: number;
  avatar: string;
  name: string;
  context: ChatMessage[];
  modelConfig: ModelConfig;
  lang: Lang;
  builtin: boolean;
};

export const DEFAULT_MASK_STATE = {
  masks: [] as Mask[],
  globalMaskId: 0,
};

export type MaskState = typeof DEFAULT_MASK_STATE;

export const DEFAULT_MASK_ID = 1145141919810;
export const DEFAULT_MASK_AVATAR = 'gpt-bot';

export const DEFAULT_TOPIC = Locale.Store.DefaultTopic;

export const createEmptyMask = () =>
  ({
    id: DEFAULT_MASK_ID,
    avatar: DEFAULT_MASK_AVATAR,
    name: DEFAULT_TOPIC,
    // context: [],
    // modelConfig: { ...useAppConfig.getState().modelConfig },
    // lang: getLang(),
    // builtin: false,
  } as Mask);
