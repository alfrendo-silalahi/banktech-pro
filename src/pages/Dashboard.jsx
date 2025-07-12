import BalanceCard from "../components/BalanceCard";
import TransactionTable from "../components/TransactionTable";

export default function Dashboard() {
  return (
    <div className="bg-[#F9FAFB]">
      <BalanceCard />
      <TransactionTable />
    </div>
  );
}
