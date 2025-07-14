import { useEffect } from "react";
import BalanceCard from "../components/BalanceCard";
import TransactionTable from "../components/TransactionTable";
// import ActivityLog from "../components/ActivityLog.jsx";
import TransactionCategorization from "../components/TransactionCategorization";
import BaseLayout from "../layout/BaseLayout";
import { useActivity } from "../context/ActivityProvider";
// import { useFirebaseTransactions } from "../hooks/useFirebaseTransactions";
import { AccountProvider } from "../context/AccountProvider.jsx";
import SummaryChart from "../components/SummaryChart.jsx";
import Navbar from "../components/NavigationBar.jsx";
import SummaryTransaction from "./SummaryTransaction";

export default function Dashboard() {
  const { logActivity } = useActivity();
  // const [showTransferWizard, setShowTransferWizard] = useState(false);

  useEffect(() => {
    logActivity("dashboard_visit", "navigation", { page: "dashboard" });
  }, [logActivity]);

  return (
    <BaseLayout>
      <AccountProvider>
        <Navbar />
        <div className="bg-[#F9FAFB]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 items-stretch">
            {/* <TestSummary />
            <BalanceCard />
            <div className="flex-1 min-w-[100px] ml-5 -mb-10 rounded-2xl border border-gray-300 overflow-hidden">
              <SummaryChart data={[]}/>
            </div> */}
            <div className="md:col-span-3 h-full">
              <SummaryTransaction />
            </div>

            {/* BalanceCard */}
            <div className="md:col-span-4 h-full">
              <BalanceCard />
            </div>

            {/* Chart */}
            <div className="md:col-span-5 h-full">
              <SummaryChart />
            </div>
            {/* <button
              onClick={() => setShowTransferWizard(true)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
            >
              💸 Transfer Money
            </button> */}
          </div>
          <TransactionTable />
          <div className="mt-10 ml-10 mr-10">
            <TransactionCategorization />
          </div>
          <div className="mt-10 ml-10 mr-10"></div>
          {/* <TestSummary /> */}
        </div>
      </AccountProvider>
    </BaseLayout>
  );
}
