import { useState, useEffect } from "react";
import BalanceCard from "../components/BalanceCard";
import TransactionTable from "../components/TransactionTable";
import ActivityLog from "../components/ActivityLog.jsx";
import TransactionCategorization from "../components/TransactionCategorization";
import TransferWizard from "../components/TransferWizard";
import BaseLayout from "../layout/BaseLayout";
import TestSummary from "./SummaryTransaction";
import { useActivity } from "../context/ActivityProvider";
import { useFirebaseTransactions } from "../hooks/useFirebaseTransactions";
import { AccountProvider } from "../context/AccountProvider.jsx";


export default function Dashboard() {
  const { logActivity } = useActivity();
  const [showTransferWizard, setShowTransferWizard] = useState(false);

  useEffect(() => {
    logActivity('dashboard_visit', 'navigation', { page: 'dashboard' });
  }, [logActivity]);

  return (
    <BaseLayout>
      <AccountProvider>
        <div className="bg-[#F9FAFB]">
          <div className="flex justify-between items-center p-6">
            <BalanceCard />
            <button
              onClick={() => setShowTransferWizard(true)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
            >
              💸 Transfer Money
            </button>
          </div>
          <TransactionTable />
          <div className="mt-10 ml-10 mr-10">
            <TransactionCategorization />
          </div>
          <div className="mt-10 ml-10 mr-10">
          </div>
          <TestSummary />
          
          {showTransferWizard && (
            <TransferWizard onClose={() => setShowTransferWizard(false)} />
          )}
        </div>
      </AccountProvider>
    </BaseLayout>
  );
}
