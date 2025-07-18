import { useMemo } from "react";
import SummaryTransactionCard from "../components/SummaryTransactionCard";
import { useAccount } from "../context/AccountProvider";
import { useAuth } from "../context/AuthProvider";
import useTransactions from "../hooks/useTransactions";

function SummaryTransaction() {
  // get uid & selected account
  const { user } = useAuth();
  const { activeAccount } = useAccount();

  const {
    transactions: data,
    loading,
    error,
  } = useTransactions(user.uid, activeAccount?.accountNumber);

  console.log({ data });

  // Gunakan useMemo untuk kalkulasi total. Logika ini dipindahkan dari file tabel.
  const ringkasanData = useMemo(() => {
    if (!data || !Array.isArray(data))
      return {
        totalIncomeBulanIni: 0,
        totalExpenseBulanIni: 0,
        perbedaanIncome: 0,
        perbedaanExpense: 0,
      };
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let totalIncomeBulanIni = 0;
    let totalExpenseBulanIni = 0;
    let totalIncomeBulanLalu = 0;
    let totalExpenseBulanLalu = 0;

    // Lakukan iterasi pada 'data' yang diterima dari props
    data.forEach((item) => {
      // Convert string tanggal ke Date object jika diperlukan
      const itemDate =
        item.tanggal instanceof Date ? item.tanggal : new Date(item.tanggal);
      const itemMonth = itemDate.getMonth();
      const itemYear = itemDate.getFullYear();

      if (itemMonth === currentMonth && itemYear === currentYear) {
        if (item.tipeTransaksi === "Income")
          totalIncomeBulanIni += item.nominal;
        else if (item.tipeTransaksi === "Expenses")
          totalExpenseBulanIni += item.nominal;
      } else if (itemMonth === prevMonth && itemYear === prevMonthYear) {
        if (item.tipeTransaksi === "Income")
          totalIncomeBulanLalu += item.nominal;
        else if (item.tipeTransaksi === "Expenses")
          totalExpenseBulanLalu += item.nominal;
      }
    });

    return {
      totalIncomeBulanIni,
      totalExpenseBulanIni,
      perbedaanIncome: totalIncomeBulanIni - totalIncomeBulanLalu,
      perbedaanExpense: totalExpenseBulanIni - totalExpenseBulanLalu,
    };
  }, [data]); // Dependensi 'data' agar kalkulasi diulang jika data berubah

  return (
    <div className="grid grid-cols-1 gap-4">
      <SummaryTransactionCard
        title="Total Income (This Month)"
        total={ringkasanData.totalIncomeBulanIni}
        perbedaan={ringkasanData.perbedaanIncome}
        tipe="Income"
      />
      <SummaryTransactionCard
        title="Total Expense (This Month)"
        total={ringkasanData.totalExpenseBulanIni}
        perbedaan={ringkasanData.perbedaanExpense}
        tipe="Expenses"
      />
    </div>
  );
}

export default SummaryTransaction;
