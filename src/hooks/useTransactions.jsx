import { useEffect, useState } from "react";
import { database } from "../firebase/config";
import { onValue, ref } from "firebase/database";
import { useNetworkStatus } from "./useNetworkStatus";
import { useIndexedDB } from "./useIndexedDB";

export default function useTransactions(uid, accountNumber) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isOnline = useNetworkStatus();
  const { isReady, saveTransactions, getTransactions, clearTransactions } = useIndexedDB();

  useEffect(() => {
    if (!uid || !accountNumber) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    if (isOnline) {
      // Online: Get from Firebase and save to IndexedDB
      const txRef = ref(database, `transactions/${uid}/${accountNumber}`);
      
      const unsubscribe = onValue(
        txRef,
        (snap) => {
          const out = [];
          snap.forEach((child) => {
            const v = child.val();
            out.push({
              id: child.key,
              ...v,
              tanggal: new Date(v.tanggal),
              accountNumber // Add account number for IndexedDB
            });
          });
          setTransactions(out);
          setLoading(false);
          
          // Clear and save fresh data to IndexedDB
          if (isReady && out.length > 0) {
            clearTransactions(uid).then(() => {
              saveTransactions(uid, out);
              console.log('💾 Fresh sync transactions to IndexedDB:', out.length);
            }).catch(err => {
              console.warn('⚠️ Clear failed, saving anyway:', err);
              saveTransactions(uid, out);
            });
          }
        },
        (err) => {
          setError(err);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } else {
      // Offline: Get from IndexedDB
      if (isReady) {
        getTransactions(uid, accountNumber)
          .then(offlineTransactions => {
            const formattedTransactions = offlineTransactions.map(tx => ({
              ...tx,
              tanggal: new Date(tx.tanggal)
            }));
            setTransactions(formattedTransactions);
            setLoading(false);
            console.log('📱 Loaded transactions from IndexedDB (offline):', formattedTransactions.length);
          })
          .catch(err => {
            setError(err);
            setLoading(false);
          });
      }
    }
  }, [uid, accountNumber, isOnline, isReady]);

  return { transactions, loading, error };
}
