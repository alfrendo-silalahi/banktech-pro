// src/ModalPreferensi.js
import React, { useState, useEffect } from 'react';
import usePreferensiStore from '../hooks/usePreferensiStore';

function ModalPreferensi() {
    const { isModalOpen, itemsPerPage, filterTipe, setPreferences, toggleModal } = usePreferensiStore();

    // State lokal untuk menampung perubahan sebelum disimpan
    const [localItemsPerPage, setLocalItemsPerPage] = useState(itemsPerPage);
    const [localFilterTipe, setLocalFilterTipe] = useState(filterTipe);

    // Sinkronkan state lokal dengan global saat modal dibuka
    useEffect(() => {
        if (isModalOpen) {
        setLocalItemsPerPage(itemsPerPage);
        setLocalFilterTipe(filterTipe);
        }
    }, [isModalOpen, itemsPerPage, filterTipe]);

    useEffect(() => {
    // Fungsi yang akan dipanggil saat tombol ditekan
        const handleEscKey = (event) => {
        if (event.key === 'Escape') {
            toggleModal(); // Panggil action untuk menutup modal
        }
        };

        // Tambahkan event listener saat modal terbuka
        if (isModalOpen) {
        document.addEventListener('keydown', handleEscKey);
        }

        // Fungsi cleanup: hapus event listener saat komponen unmount atau modal tertutup
        return () => {
        document.removeEventListener('keydown', handleEscKey);
        };
    }, [isModalOpen, toggleModal]);

    if (!isModalOpen) {
        return null;
    }

    const handleSave = () => {
        setPreferences({ itemsPerPage: localItemsPerPage, filterTipe: localFilterTipe });
        toggleModal(); // Tutup modal setelah menyimpan
    };

    return (
        // Backdrop modal
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
        {/* Panel Modal */}
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Pengaturan Tampilan</h3>
            
            {/* Opsi Tipe Transaksi */}
            <div className="mb-4">
            <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
                Tampilkan Tipe Transaksi
            </label>
            <select
                id="filter"
                value={localFilterTipe}
                onChange={(e) => setLocalFilterTipe(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 cursor-pointer focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
                <option>Semua</option>
                <option>Transfer</option>
                <option>Income</option>
            </select>
            </div>
            
            {/* Opsi Item per Halaman */}
            <div className="mb-6">
            <label htmlFor="itemsPerPage" className="block text-sm font-medium text-gray-700 mb-1">
                Data per Halaman
            </label>
            <select
                id="itemsPerPage"
                value={localItemsPerPage}
                onChange={(e) => setLocalItemsPerPage(Number(e.target.value))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none cursor-pointer focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
            </select>
            </div>

            {/* Tombol Aksi */}
            <div className="flex justify-end space-x-3">
            <button
                onClick={toggleModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 cursor-pointer border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none"
            >
                Batal
            </button>
            <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 cursor-pointer border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none"
            >
                Simpan Preferensi
            </button>
            </div>
        </div>
        </div>
    );
}

export default ModalPreferensi;