import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BalanceCard() {
  const [currentCard, setCurrentCard] = useState(0);

  const cards = [
    {
      balance: "RP50.000",
      holder: "AMANDA WIJAYANTI",
      number: "1234598798265",
    },
    { balance: "RP125.500", holder: "BUDI SANTOSO", number: "9876543210123" },
    { balance: "RP75.250", holder: "SARI DEWI", number: "5555666677778" },
  ];

  const nextCard = () => setCurrentCard((p) => (p + 1) % cards.length);
  const prevCard = () =>
    setCurrentCard((p) => (p - 1 + cards.length) % cards.length);

  return (
    <div className="ml-10 mt-10 relative w-80 rounded-2xl bg-white border border-gray-300 p-6 px-8">
      {/* panah kiri */}
      {currentCard > 0 && (
        <button
          onClick={prevCard}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2
                     rounded-full bg-white/70 p-2 shadow hover:bg-white"
        >
          <ChevronLeft className="h-4 w-4 text-gray-700" />
        </button>
      )}

      {/* panah kanan */}
      {currentCard < cards.length - 1 && (
        <button
          onClick={nextCard}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2
                     rounded-full bg-white/70 p-2 shadow hover:bg-white"
        >
          <ChevronRight className="h-4 w-4 text-gray-700" />
        </button>
      )}

      {/* TOTAL BALANCE */}
      <div className="mb-6">
        <p className="mb-1 text-sm font-medium text-gray-600">TOTAL BALANCE</p>
        <h1 className="text-2xl font-bold">{cards[currentCard].balance}</h1>
      </div>

      {/* CARD HOLDER */}
      <div className="mb-6">
        <p className="mb-1 text-sm font-medium text-gray-600">CARD HOLDER</p>
        <p className="text-lg font-semibold">{cards[currentCard].holder}</p>
      </div>

      {/* CARD NUMBER */}
      <p className="text-3xl font-bold tracking-wider">
        {cards[currentCard].number}
      </p>
    </div>
  );
}
