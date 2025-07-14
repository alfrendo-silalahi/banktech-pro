import { useEffect, useState } from "react";
import { database } from "../firebase/config";
import { onValue, ref } from "firebase/database";

export default function useTransactions(uid, accountNumber) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid || !accountNumber) return;
    console.log(accountNumber);
    const path = `transactions/${uid}/${accountNumber}`;
    console.log({ path });
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
          });
        });
        setTransactions(out);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [uid, accountNumber]);

  return { transactions, loading, error };
}
