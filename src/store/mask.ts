import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BUILTIN_MASKS } from '@/assets/masks';
import { getLang, Lang } from '@/assets/locales';
// import { DEFAULT_TOPIC, ChatMessage } from "./chat";
import { ModelConfig, ModelType, useAppConfig } from './config';
import { StoreKey } from '../constant';
import { queryPrompts } from '@/apis';
import { DEFAULT_MASK_STATE, DEFAULT_MASK_ID, DEFAULT_MASK_AVATAR, createEmptyMask, DEFAULT_TOPIC } from './utilsFn';
import type { Mask, MaskState, ChatMessage } from './utilsFn';
import { isSameTime } from '@/tools/formatDate';
// debugger
// export type Mask = {
//   id: number;
//   avatar: string;
//   name: string;
//   context: ChatMessage[];
//   modelConfig: ModelConfig;
//   lang: Lang;
//   builtin: boolean;
// };

// export const DEFAULT_MASK_STATE = {
//   masks: {} as Record<number, Mask>,
//   globalMaskId: 0,
// };

// export type MaskState = typeof DEFAULT_MASK_STATE;
export * from './utilsFn';
type MaskStore = MaskState & {
  queryPromptsTime?: Date;
  queryPrompts: () => void;
  create: (mask?: Partial<Mask>) => Mask;
  update: (id: number, updater: (mask: Mask) => void) => void;
  delete: (id: number) => void;
  search: (text: string) => Mask[];
  get: (id?: number) => Mask | null;
  getAll: () => Mask[];
};

// export const DEFAULT_MASK_ID = 1145141919810;
// export const DEFAULT_MASK_AVATAR = "gpt-bot";
// export const createEmptyMask = () => ({
//   id: DEFAULT_MASK_ID,
//   avatar: DEFAULT_MASK_AVATAR,
//   name: DEFAULT_TOPIC,
//   context: [],
//   modelConfig: { ...useAppConfig.getState().modelConfig },
//   lang: getLang(),
//   builtin: false,
// } as Mask);
// debugger
export const useMaskStore = create<MaskStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_MASK_STATE,
      queryPromptsTime: undefined,
      create(mask) {
        const _mask = {
          ...createEmptyMask(),
          ...mask,
          id: 1,
          builtin: false,
        };
        set((state) => ({
          masks: ([] as Mask[]).concat([...state.masks, _mask]),
        }));
        return _mask;
      },
      update(id, updater) {
        const masks = get().masks;
        const mask = masks[id];
        if (!mask) return;
        const updateMask = { ...mask };
        updater(updateMask);
        masks[id] = updateMask;
        set(() => ({ masks }));
      },
      delete(id) {
        const masks = get().masks;
        delete masks[id];
        set(() => ({ masks }));
      },
      queryPrompts() {
        // 如果是同一天的请求，就略过，就是简单的去重一下请求
        // const { queryPromptsTime } = get();
        // if (queryPromptsTime) {
        //   const sameTime = isSameTime(queryPromptsTime.getDate(), new Date().getTime());
        //   return;
        // }
        queryPrompts().then((data) => {
          if (!data) {
            return;
          }
          set((state) => ({
            masks: ([] as Mask[]).concat([...data, ...state.masks]),
            queryPromptsTime: new Date(),
          }));
        });
      },
      get(id) {
        return get().masks[id ?? 1145141919810];
      },
      getAll() {
        const userMasks = Object.values(get().masks).sort((a, b) => b.id - a.id);
        return userMasks.concat(BUILTIN_MASKS);
      },
      search(text) {
        return get().masks;
      },
    }),
    {
      name: StoreKey.Mask,
      version: 2,
    },
  ),
);
