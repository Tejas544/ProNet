import { create } from 'zustand';

interface UserState {
  user: { uid: string; name: string; email: string } | null;
  setUser: (user: { uid: string; name: string; email: string } | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
