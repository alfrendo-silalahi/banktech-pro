// IndexedDB Debug Component
import { useState } from 'react';
import { useIndexedDB } from '../hooks/useIndexedDB';
import { useAuth } from '../context/AuthProvider';
import { addTransactionRecord } from '../firebase/transactions';

export default function IndexedDBDebug() {
  const { user } = useAuth();
  const { isReady, saveTransactions, getTransactions, addToOfflineQueue, clearAllData } = useIndexedDB();
  const [debugInfo, setDebugInfo] = useState('');

  const testIndexedDB = async () => {
    if (!user || !isReady) {
      setDebugInfo('❌ User not logged in or IndexedDB not ready');
      return;
    }

    try {
      // Test save transactions
      const testTransactions = [
        { id: 'test1', amount: 100000, type: 'Income', timestamp: Date.now() },
        { id: 'test2', amount: 50000, type: 'Expense', timestamp: Date.now() }
      ];
      
      await saveTransactions(user.uid, testTransactions);
      setDebugInfo(prev => prev + '\n✅ Saved test transactions');

      // Test get transactions
      const retrieved = await getTransactions(user.uid);
      setDebugInfo(prev => prev + `\n✅ Retrieved ${retrieved.length} transactions`);

      // Test offline queue
      await addToOfflineQueue({
        type: 'addTransaction',
        userId: user.uid,
        data: { amount: 25000, type: 'Test' }
      });
      setDebugInfo(prev => prev + '\n✅ Added to offline queue');

      setDebugInfo(prev => prev + '\n\n🎉 IndexedDB is working!');
    } catch (error) {
      setDebugInfo(prev => prev + `\n❌ Error: ${error.message}`);
    }
  };

  const testFirebaseTransaction = async () => {
    if (!user) {
      setDebugInfo('❌ User not logged in');
      return;
    }

    try {
      const testTransaction = {
        nama: 'Test Transaction',
        nominal: 50000,
        tipeTransaksi: 'Income',
        tanggal: new Date().toISOString(),
        type: 'test'
      };

      const result = await addTransactionRecord(user.uid, '8219837001', testTransaction);
      
      if (result.success) {
        setDebugInfo(prev => prev + `\n✅ Firebase transaction added: ${result.id}`);
      } else {
        setDebugInfo(prev => prev + `\n❌ Firebase transaction failed: ${result.error}`);
      }
    } catch (error) {
      setDebugInfo(prev => prev + `\n❌ Error: ${error.message}`);
    }
  };

  const checkDatabase = async () => {
    try {
      const db = await new Promise((resolve, reject) => {
        const request = indexedDB.open('BankTechProDB', 1);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      const stores = Array.from(db.objectStoreNames);
      setDebugInfo(`✅ Database exists with stores: ${stores.join(', ')}`);
      db.close();
    } catch (error) {
      setDebugInfo(`❌ Database error: ${error.message}`);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border rounded-lg p-4 shadow-lg max-w-md">
      <h3 className="font-bold mb-2">IndexedDB Debug</h3>
      <div className="space-y-2">
        <button
          onClick={checkDatabase}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
        >
          Check Database
        </button>
        <button
          onClick={testIndexedDB}
          className="px-3 py-1 bg-green-500 text-white rounded text-sm ml-2"
        >
          Test IndexedDB
        </button>
        <button
          onClick={testFirebaseTransaction}
          className="px-3 py-1 bg-purple-500 text-white rounded text-sm ml-2"
        >
          Test Firebase TX
        </button>
        <button
          onClick={() => {
            clearAllData();
            setDebugInfo('\n🧹 All IndexedDB data cleared');
          }}
          className="px-3 py-1 bg-red-500 text-white rounded text-sm ml-2"
        >
          Clear All Data
        </button>
        <button
          onClick={() => setDebugInfo('')}
          className="px-3 py-1 bg-gray-500 text-white rounded text-sm ml-2"
        >
          Clear
        </button>
      </div>
      <pre className="text-xs mt-2 bg-gray-100 p-2 rounded max-h-40 overflow-y-auto">
        {debugInfo || 'Click buttons to test IndexedDB'}
      </pre>
      <div className="text-xs mt-2">
        Status: {isReady ? '✅ Ready' : '⏳ Loading'}
      </div>
    </div>
  );
}