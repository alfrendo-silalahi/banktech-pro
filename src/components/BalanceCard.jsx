import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCurrentUser } from "../hooks/useCurrentUser.jsx";
import { useAccount } from "../context/AccountProvider.jsx";
// import useTransferStore from "../store/transferStore.jsx";

export default function BalanceCard() {
  const [currentCard, setCurrentCard] = useState(0);
  const { currentUserData } = useCurrentUser();
  const { switchAccount, activeAccountIndex } = useAccount();

  // Sync currentCard with activeAccountIndex
  useEffect(() => {
    setCurrentCard(activeAccountIndex);
  }, [activeAccountIndex]);

  // Create cards from user's bank accounts
  const cards = currentUserData?.bankAccounts?.map((account) => ({
    balance: new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(account.balance || 0),
    holder: currentUserData.name.toUpperCase(),
    number: account.accountNumber,
    accountType: account.accountType,
    isDefault: account.isDefault,
  })) || [
    {
      balance: "Rp 0",
      holder: "LOADING...",
      number: "0000000000",
      accountType: "Savings",
      isDefault: true,
    },
  ];

  const nextCard = () => {
    const newIndex = (currentCard + 1) % cards.length;
    setCurrentCard(newIndex);
    switchAccount(newIndex);
  };
  const prevCard = () => {
    const newIndex = (currentCard - 1 + cards.length) % cards.length;
    setCurrentCard(newIndex);
    switchAccount(newIndex);
  };

  return (
    <div className="relative w-full h-full rounded-2xl bg-white border border-gray-300 p-8 transition-all duration-300 hover:shadow-lg hover:scale-105">
      {/* Navigation arrows - only show if multiple accounts */}
      {cards.length > 1 && currentCard > 0 && (
        <button
          onClick={prevCard}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2
                     rounded-full bg-white/70 p-2 shadow hover:bg-white transition-all duration-200 hover:scale-110"
        >
          <ChevronLeft className="h-4 w-4 text-gray-700" />
        </button>
      )}

      {cards.length > 1 && currentCard < cards.length - 1 && (
        <button
          onClick={nextCard}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2
                     rounded-full bg-white/70 p-2 shadow hover:bg-white transition-all duration-200 hover:scale-110"
        >
          <ChevronRight className="h-4 w-4 text-gray-700" />
        </button>
      )}

      {/* ACCOUNT TYPE & BALANCE */}
      <div className="mb-6 transition-all duration-500 ease-in-out">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-medium text-gray-600">
            {cards[currentCard].accountType?.toUpperCase()} ACCOUNT
          </p>
          {cards[currentCard].isDefault && (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full font-medium">
              DEFAULT
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold">{cards[currentCard].balance}</h1>
      </div>

      {/* CARD HOLDER */}
      <div className="mb-6 transition-all duration-500 ease-in-out">
        <p className="mb-1 text-sm font-medium text-gray-600">CARD HOLDER</p>
        <p className="text-lg font-semibold">{cards[currentCard].holder}</p>
      </div>

      {/* CARD NUMBER */}
      <p className="text-3xl font-bold tracking-wider transition-all duration-500 ease-in-out">
        {cards[currentCard].number}
      </p>
    </div>
  );
}
