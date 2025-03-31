import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useStore = create(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),

        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)

export default useStore;

