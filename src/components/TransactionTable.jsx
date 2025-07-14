// src/TabelTransaksi.js
import { useState, useEffect } from "react";
import usePreferensiStore from "../store/preferensiStore";
import ModalPreferensi from "./ModalPreferensi";
import formatRupiah from "../hooks/formatRupiah";
import SummaryTransaction from "../pages/SummaryTransaction";
import SummaryChart from "./SummaryChart";
import { useFirebaseTransactions } from "../hooks/useFirebaseTransactions.jsx";
import { useAccount } from "../context/AccountProvider.jsx";

// Data dummy tetap di sini sebagai sumber data utama
const generateDummyData = () => {
  const data = [];
  const today = new Date();
  
  // Buat 100 transaksi acak dalam 5 bulan terakhir
  for (let i = 0; i < 100; i++) { 
    const transactionDate = new Date();
    // Tanggal acak dalam 150 hari terakhir (sekitar 5 bulan)
    const randomDay = Math.floor(Math.random() * 150);
    transactionDate.setDate(today.getDate() - randomDay);
    
    data.push({
      id: i + 1,
      nama: `Transaksi ${i + 1}`,
      tipeTransaksi: Math.random() > 0.5 ? 'Income' : 'Expenses',
      nominal: Math.floor(Math.random() * 2000000) + 50000,
      tanggal: transactionDate,
    });
  }
  return data;
};

const dummyData = generateDummyData();

export function TransactionTable() {
  // Ambil state dan actions dari store Zustand
  const { itemsPerPage, filterTipe, toggleModal } = usePreferensiStore();
  const { activeAccount } = useAccount();
  const { transactions, loading: firebaseLoading } = useFirebaseTransactions(activeAccount?.accountNumber);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Filter data berdasarkan preferensi dari store dan search
  const filteredData = transactions.filter((item) => {
    const matchesType = filterTipe === "All" || item.tipeTransaksi === filterTipe;
    const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Logika Paginasi
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Kembali ke halaman 1 setiap kali filter atau search diubah
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, filterTipe, searchTerm]);

  // Simulate loading when filtering
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [filterTipe, searchTerm]);

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="mt-10 ml-10 mr-10 p-5 font-sans bg-gray-50 border border-gray-300 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Transaction History
          </h2>
          {activeAccount && (
            <p className="text-sm text-gray-500 mt-1">
              {activeAccount.accountType} Account - {activeAccount.accountNumber}
            </p>
          )}
        </div>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
          />
          <button
            onClick={toggleModal}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none cursor-pointer transition-colors duration-200"
          >
            ⚙️ Preferences
          </button>
        </div>
      </div>
{/* 
      <SummaryTransaction data={transactions} /> */}

      {/* <div className="mt-8">
        <SummaryChart data={transactions}/>
      </div> */}

      <div className="overflow-x-auto transition-all duration-300">
        <table className="w-full border-collapse mb-4">
          <thead>
            <tr>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 text-left">
                No.
              </th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 text-left">
                Name
              </th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 text-left">
                Account Number
              </th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 text-left">
                Date
              </th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 text-left">
                Transaction Type
              </th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 text-left">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {loading || firebaseLoading ? (
              // Loading Skeleton
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="bg-white animate-pulse">
                  <td className="p-3 border-b border-gray-200">
                    <div className="h-4 bg-gray-300 rounded w-8"></div>
                  </td>
                  <td className="p-3 border-b border-gray-200">
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                  </td>
                  <td className="p-3 border-b border-gray-200">
                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                  </td>
                  <td className="p-3 border-b border-gray-200">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                  </td>
                  <td className="p-3 border-b border-gray-200">
                    <div className="h-6 bg-gray-300 rounded-full w-16"></div>
                  </td>
                  <td className="p-3 border-b border-gray-200">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                  </td>
                </tr>
              ))
            ) : (
              currentItems.map((item, index) => (
                <tr
                  key={item.id}
                  className="bg-white hover:bg-gray-100 even:bg-gray-50 transition-all duration-200 hover:scale-[1.01] hover:shadow-sm"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="p-3 text-gray-800 border-b border-gray-200">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="p-3 text-gray-800 border-b border-gray-200">
                    {item.nama}
                  </td>
                  <td className="p-3 text-gray-800 border-b border-gray-200">
                    {item.nomorRekening}
                  </td>
                  <td className="p-3 text-gray-800 border-b border-gray-200">
                    {new Date(item.tanggal).toLocaleDateString('id-ID')}
                  </td>
                  <td className="p-3 text-gray-800 border-b border-gray-200">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                        item.tipeTransaksi === "Income"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                    >
                      {item.tipeTransaksi}
                    </span>
                  </td>
                  <td className="p-3 text-gray-800 border-b border-gray-200">
                    {formatRupiah(item.nominal)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Page <strong>{currentPage}</strong> from{" "}
          <strong>{totalPages > 0 ? totalPages : 1}</strong>
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-300 hover:bg-blue-600 transition-colors"
          >
            Prev
          </button>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-300 hover:bg-blue-600 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Render Modal di sini */}
      <ModalPreferensi />
    </div>
  );
}

export default TransactionTable;
