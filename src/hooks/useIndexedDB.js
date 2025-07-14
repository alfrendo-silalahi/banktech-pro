// IndexedDB Hook for Offline Storage
import { useState, useEffect } from 'react';

export function useIndexedDB() {
  const [db, setDb] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initDB = async () => {
      const request = indexedDB.open('BankTechProDB', 1);

      request.onupgradeneeded = (event) => {
        const database = event.target.result;
        
        if (!database.objectStoreNames.contains('transactions')) {
          const store = database.createObjectStore('transactions', { keyPath: 'id' });
          store.createIndex('userId', 'userId', { unique: false });
          store.createIndex('accountNumber', 'accountNumber', { unique: false });
        }

        if (!database.objectStoreNames.contains('offlineQueue')) {
          database.createObjectStore('offlineQueue', { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = () => {
        setDb(request.result);
        setIsReady(true);
      };
    };

    initDB();
  }, []);

  const saveTransactions = async (userId, transactions) => {
    if (!db) return;
    const tx = db.transaction(['transactions'], 'readwrite');
    const store = tx.objectStore('transactions');

    for (const transaction of transactions) {
      await new Promise((resolve, reject) => {
        const request = store.put({ ...transaction, userId });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  };

  const getTransactions = async (userId, accountNumber = null) => {
    if (!db) return [];
    const tx = db.transaction(['transactions'], 'readonly');
    const store = tx.objectStore('transactions');
    const index = store.index('userId');
    
    const transactions = await new Promise((resolve, reject) => {
      const request = index.getAll(userId);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
    
    if (accountNumber) {
      return transactions.filter(t => 
        t.accountNumber === accountNumber || 
        t.ownerAccount === accountNumber ||
        t.nomorRekening === accountNumber
      );
    }
    
    return transactions;
  };

  const addToOfflineQueue = async (operation) => {
    if (!db) return;
    const tx = db.transaction(['offlineQueue'], 'readwrite');
    const store = tx.objectStore('offlineQueue');
    
    return new Promise((resolve, reject) => {
      const request = store.add({
        ...operation,
        timestamp: Date.now(),
        status: 'pending'
      });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  return {
    isReady,
    saveTransactions,
    getTransactions,
    addToOfflineQueue
  };
}