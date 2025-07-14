// Custom hook for Firebase transactions
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { 
  addTransaction, 
  listenToTransactions,
  getUserPreferences,
  saveUserPreferences 
} from '../firebase/database';

export function useFirebaseTransactions(accountNumber = null) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    itemsPerPage: 10,
    filterTipe: 'All'
  });

  // Listen to real-time transactions for specific account
  useEffect(() => {
    if (!user || !accountNumber) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = listenToTransactions(user.uid, (newTransactions) => {
      // Filter transactions for specific account
      const accountTransactions = newTransactions.filter(t => 
        t.ownerAccount === accountNumber || t.nomorRekening === accountNumber
      );
      setTransactions(accountTransactions);
      setLoading(false);
    }, accountNumber);

    return () => unsubscribe();
  }, [user, accountNumber]);

  // Load user preferences
  useEffect(() => {
    if (!user) return;

    const loadPreferences = async () => {
      const result = await getUserPreferences(user.uid);
      if (result.success && result.preferences) {
        setPreferences(result.preferences);
      }
    };

    loadPreferences();
  }, [user]);

  // Add new transaction
  const createTransaction = async (transactionData) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    const result = await addTransaction(user.uid, transactionData);
    return result;
  };

  // Update preferences
  const updatePreferences = async (newPreferences) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    const result = await saveUserPreferences(user.uid, newPreferences);
    if (result.success) {
      setPreferences(newPreferences);
    }
    return result;
  };

  // Filter transactions
  const getFilteredTransactions = (searchTerm = '', filterType = 'All') => {
    return transactions.filter(transaction => {
      const matchesSearch = transaction.nama?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const matchesType = filterType === 'All' || transaction.tipeTransaksi === filterType;
      return matchesSearch && matchesType;
    });
  };

  return {
    transactions,
    loading,
    preferences,
    createTransaction,
    updatePreferences,
    getFilteredTransactions,
    user
  };
}

// Hook untuk semua transaksi dari semua accounts
export function useAllFirebaseTransactions() {
  const { user } = useAuth();
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setAllTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = listenToTransactions(user.uid, (newTransactions) => {
      setAllTransactions(newTransactions);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return {
    allTransactions,
    loading
  };
}