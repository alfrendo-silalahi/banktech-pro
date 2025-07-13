import BalanceCard from "../components/BalanceCard";
import TransactionTable from "../components/TransactionTable";
import BaseLayout from "../layout/BaseLayout";
import TestSummary from "./SummaryTransaction";

export default function Dashboard() {
  return (
    <BaseLayout>
      <div className="bg-[#F9FAFB]">
        <BalanceCard />
        <TransactionTable />
        <TestSummary />
      </div>
    </BaseLayout>
  );
}
