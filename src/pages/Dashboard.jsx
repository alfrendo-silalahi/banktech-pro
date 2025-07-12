import BalanceCard from "../components/BalanceCard";
import TransactionTable from "../components/TransactionTable";
import TestSummary from "./SummaryTransaction";

export default function Dashboard() {
  return (
    <div className="bg-[#F9FAFB]">
      <BalanceCard />
      <TransactionTable />
      <TestSummary />
    </div>
  );
}
