// Firebase Realtime Database Service
import { 
  ref, 
  push, 
  set, 
  get, 
  onValue,
  query,
  orderByChild,
  equalTo 
} from 'firebase/database';
import { database } from './config';

// Add new transaction
export const addTransaction = async (userId, transactionData) => {
  try {
    const transactionsRef = ref(database, `transactions/${userId}`);
    const newTransactionRef = push(transactionsRef);
    
    await set(newTransactionRef, {
      ...transactionData,
      timestamp: Date.now(),
      createdAt: new Date().toISOString()
    });
    
    return { success: true, id: newTransactionRef.key };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all transactions for user
export const getUserTransactions = async (userId) => {
  try {
    const transactionsRef = ref(database, `transactions/${userId}`);
    const snapshot = await get(transactionsRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      const transactions = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
      return { success: true, transactions };
    }
    
    return { success: true, transactions: [] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Real-time listener for transactions
export const listenToTransactions = (userId, callback, accountNumber = null) => {
  if (accountNumber) {
    // Listen to specific account transactions
    const transactionsRef = ref(database, `transactions/${userId}/${accountNumber}`);
    
    const unsubscribe = onValue(transactionsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const transactions = Object.keys(data).map(key => ({
          id: key,
          ownerAccount: accountNumber,
          ...data[key]
        }));
        callback(transactions);
      } else {
        callback([]);
      }
    });
    
    return unsubscribe;
  } else {
    // Listen to all transactions across all accounts
    const transactionsRef = ref(database, `transactions/${userId}`);
    
    const unsubscribe = onValue(transactionsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const allTransactions = [];
        
        // Loop through each account's transactions
        Object.keys(data).forEach(accountNumber => {
          const accountTransactions = data[accountNumber];
          if (accountTransactions && typeof accountTransactions === 'object') {
            Object.keys(accountTransactions).forEach(transactionId => {
              allTransactions.push({
                id: transactionId,
                ownerAccount: accountNumber,
                ...accountTransactions[transactionId]
              });
            });
          }
        });
        
        callback(allTransactions);
      } else {
        callback([]);
      }
    });
    
    return unsubscribe;
  }
};

// Filter transactions by type
export const getTransactionsByType = async (userId, type) => {
  try {
    const transactionsRef = ref(database, `transactions/${userId}`);
    const typeQuery = query(transactionsRef, orderByChild('tipeTransaksi'), equalTo(type));
    const snapshot = await get(typeQuery);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      const transactions = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
      return { success: true, transactions };
    }
    
    return { success: true, transactions: [] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Save user preferences
export const saveUserPreferences = async (userId, preferences) => {
  try {
    const preferencesRef = ref(database, `preferences/${userId}`);
    await set(preferencesRef, preferences);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get user preferences
export const getUserPreferences = async (userId) => {
  try {
    const preferencesRef = ref(database, `preferences/${userId}`);
    const snapshot = await get(preferencesRef);
    
    if (snapshot.exists()) {
      return { success: true, preferences: snapshot.val() };
    }
    
    return { success: true, preferences: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};