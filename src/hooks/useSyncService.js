// Sync Service Hook for Data Synchronization
import { useEffect } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { useIndexedDB } from './useIndexedDB';
import { useAuth } from '../context/AuthProvider';
import { addTransaction } from '../firebase/database';

export function useSyncService() {
  const isOnline = useNetworkStatus();
  const { isReady, addToOfflineQueue } = useIndexedDB();
  const { user } = useAuth();

  useEffect(() => {
    if (!isOnline || !isReady || !user) return;

    const syncOfflineData = async () => {
      try {
        const db = await new Promise((resolve) => {
          const request = indexedDB.open('BankTechProDB', 1);
          request.onsuccess = () => resolve(request.result);
        });

        // Get all queue items first
        const queueItems = await new Promise((resolve, reject) => {
          const tx = db.transaction(['offlineQueue'], 'readonly');
          const store = tx.objectStore('offlineQueue');
          const request = store.getAll();
          request.onsuccess = () => resolve(request.result || []);
          request.onerror = () => reject(request.error);
        });

        // Process each item individually with separate transactions
        for (const item of queueItems) {
          try {
            // Execute the sync operation
            if (item.type === 'addTransaction') {
              await addTransaction(item.userId, item.data);
            } else if (item.type === 'transfer') {
              const { transferMoney } = await import('../firebase/auth');
              await transferMoney(item.fromAccount, item.toAccount, item.amount);
              console.log('✅ Synced offline transfer:', item.amount);
            }
            
            // Delete successfully synced item with new transaction
            await new Promise((resolve, reject) => {
              const deleteTx = db.transaction(['offlineQueue'], 'readwrite');
              const deleteStore = deleteTx.objectStore('offlineQueue');
              const deleteRequest = deleteStore.delete(item.id);
              deleteRequest.onsuccess = () => resolve();
              deleteRequest.onerror = () => reject(deleteRequest.error);
            });
          } catch (error) {
            console.error('Sync failed for item:', item.id, error);
          }
        }
      } catch (error) {
        console.error('Sync process failed:', error);
      }
    };

    // Sync when coming back online
    syncOfflineData();
  }, [isOnline, isReady, user]);

  return { isOnline };
}