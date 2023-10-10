import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StoreKey } from '../constant';
import { queryPrompts, queryUserPrePrompt, saveUserPrePrompt, updateUserPrePrompt, deleteUserPrePrompt } from '@/apis';
import { DEFAULT_MASK_STATE, DEFAULT_MASK_ID, DEFAULT_MASK_AVATAR, createEmptyMask, DEFAULT_TOPIC } from './utilsFn';
import type { Mask, MaskState, ChatMessage } from './utilsFn';
import { message } from '@/components/common/antd';
// import { isSameTime } from '@/tools/formatDate';
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
  // queryPromptsTime?: Date;
  queryPrompts: () => void;
  create: (mask?: Partial<Mask>) => Mask;
  update: (id: string, updater: (mask: Mask) => void) => void;
  delete: (id: string) => void;
  save: (id: string) => void;
  search: (text: string) => Mask[];
  get: (id: string) => Mask | undefined;
  getAll: () => Mask[];
};

export const useMaskStore = create<MaskStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_MASK_STATE,
      // queryPromptsTime: undefined,
      create(mask) {
        const index = get().masks.length;
        const _mask = {
          ...createEmptyMask(index + ''),
          ...mask,
        };
        set((state) => ({
          masks: ([] as Mask[]).concat([...state.masks, _mask]),
        }));
        return _mask;
      },
      save(id) {
        const masks = get().masks;
        const index = masks.findIndex((item) => item.id === id);
        const mask = masks[index];
        if (!mask) return;
        if (mask.id.length === 24) {
          updateUserPrePrompt(mask).then((data) => {
            if (!data) {
              return;
            }
            message.success('更新成功~');
          });
        } else {
          saveUserPrePrompt(mask).then((data) => {
            if (!data) {
              return;
            }
            message.success('保存成功~');
            const updateMask = { ...mask };
            masks[index] = updateMask;
            set(() => ({ masks }));
          });
        }
      },
      update(id, updater) {
        const masks = get().masks;
        const index = masks.findIndex((item) => item.id === id);
        const mask = masks[index];
        if (!mask) return;
        const updateMask = { ...mask };
        updater(updateMask);
        masks[index] = updateMask;
        set(() => ({ masks }));
      },
      delete(id) {
        const masks = get().masks;
        const newMasks = masks.filter((item) => item.id !== id);
        if (id.length === 24) {
          deleteUserPrePrompt(id).then((data) => {
            if (!data) {
              return;
            }
            message.success('删除成功~');
            set(() => ({ masks: newMasks }));
          });
        } else {
          set(() => ({ masks: newMasks }));
        }
      },
      queryPrompts() {
        // 如果是同一天的请求，就略过，就是简单的去重一下请求
        // const { queryPromptsTime } = get();
        // if (queryPromptsTime) {
        //   const sameTime = isSameTime(queryPromptsTime.getDate(), new Date().getTime());
        //   return;
        // }
        Promise.all([queryPrompts(), queryUserPrePrompt()]).then((data) => {
          if (!data || (!data[0] && !data[1])) {
            return;
          }
          const [system = [], user = []] = data;
          const part1: Mask[] = system.map((item) => ({ ...item, type: 'system' }));
          const part2: Mask[] = user.map((item) => ({ ...item, type: 'user' }));
          set({
            masks: ([] as Mask[]).concat(...part1, ...part2),
            // queryPromptsTime: new Date(),
          });
        });
      },
      get(id) {
        return get().masks.find((item) => item.id === id);
      },
      getAll() {
        return get().masks;
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
