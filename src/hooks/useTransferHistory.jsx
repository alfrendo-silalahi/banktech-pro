// Transfer History Hook
import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useTransferHistory() {
  const [transferHistory, setTransferHistory] = useLocalStorage('transfer_history', []);
  const [loading, setLoading] = useState(false);

  // Add transfer to history
  const addTransfer = (transferData) => {
    const transfer = {
      id: `TXN${Date.now()}`,
      ...transferData,
      status: 'completed',
      timestamp: new Date().toISOString(),
      fee: calculateFee(transferData.amount)
    };

    setTransferHistory(prev => [transfer, ...prev.slice(0, 49)]); // Keep last 50 transfers
    return transfer;
  };

  // Calculate transfer fee
  const calculateFee = (amount) => {
    if (amount <= 100000) return 2500;
    if (amount <= 1000000) return 5000;
    if (amount <= 10000000) return 7500;
    return 10000;
  };

  // Get transfers by date range
  const getTransfersByDateRange = (startDate, endDate) => {
    return transferHistory.filter(transfer => {
      const transferDate = new Date(transfer.timestamp);
      return transferDate >= startDate && transferDate <= endDate;
    });
  };

  // Get transfer statistics
  const getTransferStats = () => {
    const totalTransfers = transferHistory.length;
    const totalAmount = transferHistory.reduce((sum, transfer) => sum + transfer.amount, 0);
    const totalFees = transferHistory.reduce((sum, transfer) => sum + transfer.fee, 0);
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const thisMonthTransfers = transferHistory.filter(transfer => 
      new Date(transfer.timestamp) >= thisMonth
    );
    
    return {
      totalTransfers,
      totalAmount,
      totalFees,
      thisMonthCount: thisMonthTransfers.length,
      thisMonthAmount: thisMonthTransfers.reduce((sum, transfer) => sum + transfer.amount, 0)
    };
  };

  return {
    transferHistory,
    loading,
    addTransfer,
    calculateFee,
    getTransfersByDateRange,
    getTransferStats
  };
}