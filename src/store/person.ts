import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StoreKey } from '../constant';
import { showToast } from '@/components/common/ui-lib/ui-lib';

export interface PersonInfo {
  email: string;
  name: {
    firstName: string;
    lastName: string;
  };
  token: string;
}
export interface PersonStore extends PersonInfo {
  updateInfo: (info?: Partial<PersonInfo>) => void;
  clear: () => void;
}

const initialPersonInfo: PersonInfo = {
  email: '',
  name: {
    firstName: '',
    lastName: '',
  },
  token: '',
};

export const usePersonStore = create<PersonStore>()(
  persist(
    (set, get) => ({
      ...initialPersonInfo,
      updateInfo(info) {
        set(() => (info ? info : initialPersonInfo));
      },
      clear() {
        set(initialPersonInfo);
      },
    }),
    {
      name: StoreKey.Person,
      version: 1,
    },
  ),
);
