// Custom hook for Firebase transactions with offline support
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useNetworkStatus } from './useNetworkStatus';
import { useIndexedDB } from './useIndexedDB';
import { 
  addTransaction, 
  listenToTransactions,
  getUserPreferences,
  saveUserPreferences 
} from '../firebase/database';

export function useFirebaseTransactions(accountNumber = null) {
  const { user } = useAuth();
  const isOnline = useNetworkStatus();
  const { isReady, saveTransactions, getTransactions, addToOfflineQueue } = useIndexedDB();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    itemsPerPage: 10,
    filterTipe: 'All'
  });

  // Listen to real-time transactions with offline fallback
  useEffect(() => {
    if (!user || !accountNumber) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    if (isOnline) {
      const unsubscribe = listenToTransactions(user.uid, (newTransactions) => {
        const accountTransactions = newTransactions.filter(t => 
          t.ownerAccount === accountNumber || t.nomorRekening === accountNumber
        );
        
        // Add accountNumber field for consistent IndexedDB storage
        const transactionsWithAccount = accountTransactions.map(t => ({
          ...t,
          accountNumber: t.ownerAccount || t.nomorRekening || accountNumber
        }));
        
        setTransactions(transactionsWithAccount);
        // Save to IndexedDB for offline use
        if (isReady) {
          saveTransactions(user.uid, transactionsWithAccount);
          console.log('💾 Saved to IndexedDB:', transactionsWithAccount.length, 'transactions');
        }
        setLoading(false);
      }, accountNumber);

      return () => unsubscribe();
    } else {
      // Load from IndexedDB when offline
      if (isReady) {
        getTransactions(user.uid, accountNumber).then(offlineTransactions => {
          setTransactions(offlineTransactions);
          setLoading(false);
          console.log('📱 Loaded from IndexedDB (offline):', offlineTransactions.length, 'transactions');
        });
      }
    }
  }, [user, accountNumber, isOnline, isReady]);

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

  // Add new transaction with offline support
  const createTransaction = async (transactionData) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    if (isOnline) {
      const result = await addTransaction(user.uid, transactionData);
      return result;
    } else {
      // Add to offline queue
      if (isReady) {
        await addToOfflineQueue({
          type: 'addTransaction',
          userId: user.uid,
          data: transactionData
        });
        
        // Optimistic update
        const optimisticTransaction = {
          ...transactionData,
          id: `temp_${Date.now()}`,
          timestamp: Date.now(),
          status: 'pending'
        };
        setTransactions(prev => [optimisticTransaction, ...prev]);
        console.log('⚡ Optimistic update (offline):', optimisticTransaction);
        
        return { success: true, offline: true };
      }
      return { success: false, error: 'Offline storage not ready' };
    }
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