import { create } from 'zustand';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  initialize: () => {
    if (!auth) {
      console.warn('Firebase auth is not initialized. Check your environment variables.');
      set({ loading: false });
      return;
    }
    onAuthStateChanged(auth, (user) => {
      set({ user, loading: false });
    });
  }
}));
