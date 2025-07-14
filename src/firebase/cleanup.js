// Firebase Data Cleanup
import { ref, remove } from 'firebase/database';
import { database } from './config';

export const cleanupFirebaseData = async () => {
  console.log('🧹 Starting Firebase data cleanup...');
  
  try {
    // Remove all users data
    await remove(ref(database, 'users'));
    console.log('✅ Removed users data');
    
    // Remove all transactions
    await remove(ref(database, 'transactions'));
    console.log('✅ Removed transactions data');
    
    // Remove all preferences
    await remove(ref(database, 'preferences'));
    console.log('✅ Removed preferences data');
    
    console.log('🎉 Firebase cleanup completed!');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    return { success: false, error: error.message };
  }
};

// Note: Firebase Auth users need to be deleted manually from console
// or using Firebase Admin SDK