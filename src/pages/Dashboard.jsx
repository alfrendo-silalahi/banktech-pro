import { useEffect } from "react";

import BaseLayout from "../layout/BaseLayout";
import Navbar from "../components/NavigationBar.jsx";

import BalanceCard from "../components/BalanceCard";
import SummaryChart from "../components/SummaryChart.jsx";
import TransactionTable from "../components/TransactionTable";
import TransactionCategorization from "../components/TransactionCategorization";
import IndexedDBDebug from "../components/IndexedDBDebug";

import { useActivity } from "../context/ActivityProvider";
import { AccountProvider } from "../context/AccountProvider.jsx";
import { useSyncService } from "../hooks/useSyncService";

import SummaryTransaction from "./SummaryTransaction";

export default function Dashboard() {
  const { logActivity } = useActivity();
  useSyncService();

  useEffect(() => {
    logActivity("dashboard_visit", "navigation", { page: "dashboard" });
  }, [logActivity]);

  return (
    <BaseLayout>
      <AccountProvider>
        <Navbar />
        <div className="bg-[#F9FAFB]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 items-stretch">
            <div className="md:col-span-3 h-full">
              <SummaryTransaction />
            </div>
            <div className="md:col-span-4 h-full">
              <BalanceCard />
            </div>
            <div className="md:col-span-5 h-full">
              <SummaryChart />
            </div>
          </div>
          <TransactionTable />
          <div className="mt-10 ml-10 mr-10">
            <TransactionCategorization />
          </div>
        </div>
        <IndexedDBDebug />
      </AccountProvider>
    </BaseLayout>
  );
}
