// src/store.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const usePreferensiStore = create(
  // Gunakan middleware 'persist' dari Zustand
  persist(
    (set) => ({
      // State awal
      itemsPerPage: 10,
      filterTipe: 'All', // Opsi: 'All', 'Expanses', 'Income'
      isModalOpen: false,

      // Actions untuk mengubah state
      setPreferences: (prefs) => set((state) => ({ ...state, ...prefs })),
      toggleModal: () => set((state) => ({ isModalOpen: !state.isModalOpen })),
    }),
    {
      name: 'preferensi-tabel-pengguna', // Nama key di LocalStorage
      storage: createJSONStorage(() => localStorage), // Spesifikasikan localStorage
      partialize: (state) => ({
        // Hanya simpan state 'itemsPerPage' dan 'filterTipe'
        itemsPerPage: state.itemsPerPage,
        filterTipe: state.filterTipe,
      }),
    }
  )
);

export default usePreferensiStore;