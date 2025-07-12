// src/TabelTransaksi.js
import { useState, useEffect } from "react";
import usePreferensiStore from "../hooks/usePreferensiStore";
import ModalPreferensi from "./ModalPreferensi";

// --- Data Dummy Baru ---
const dummyData = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  nama: `Pengguna ${i + 1}`,
  nomorRekening: `8219837${String(i + 1).padStart(2, "0")}`,
  tipeTransaksi: i % 2 === 0 ? "Income" : "Transfer", // Mengganti status dengan tipe transaksi
  nominal: Math.floor(Math.random() * 5000000) + 100000,
}));

export function TransactionTable() {
  // Ambil state dan actions dari store Zustand
  const { itemsPerPage, filterTipe, toggleModal } = usePreferensiStore();
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data berdasarkan preferensi dari store
  const filteredData = dummyData.filter((item) => {
    if (filterTipe === "Semua") return true;
    return item.tipeTransaksi === filterTipe;
  });

  // Logika Paginasi
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Kembali ke halaman 1 setiap kali filter atau jumlah item diubah
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, filterTipe]);

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="p-5 font-sans bg-gray-50 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Daftar Transaksi
        </h2>
        <button
          onClick={toggleModal}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none cursor-pointer"
        >
          ⚙️ Pengaturan
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse mb-4">
          <thead>
            <tr>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 text-left">
                ID
              </th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 text-left">
                Nama
              </th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 text-left">
                Nomor Rekening
              </th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 text-left">
                Tipe Transaksi
              </th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 text-left">
                Nominal
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr
                key={item.id}
                className="bg-white hover:bg-gray-100 even:bg-gray-50"
              >
                <td className="p-3 text-gray-800 border-b border-gray-200">
                  {item.id}
                </td>
                <td className="p-3 text-gray-800 border-b border-gray-200">
                  {item.nama}
                </td>
                <td className="p-3 text-gray-800 border-b border-gray-200">
                  {item.nomorRekening}
                </td>
                <td className="p-3 text-gray-800 border-b border-gray-200">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.tipeTransaksi === "Income"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.tipeTransaksi}
                  </span>
                </td>
                <td className="p-3 text-gray-800 border-b border-gray-200">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(item.nominal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Halaman <strong>{currentPage}</strong> dari{" "}
          <strong>{totalPages > 0 ? totalPages : 1}</strong>
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-300 hover:bg-blue-600 transition-colors"
          >
            Sebelumnya
          </button>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-300 hover:bg-blue-600 transition-colors"
          >
            Berikutnya
          </button>
        </div>
      </div>

      {/* Render Modal di sini */}
      <ModalPreferensi />
    </div>
  );
}

export default TransactionTable;
