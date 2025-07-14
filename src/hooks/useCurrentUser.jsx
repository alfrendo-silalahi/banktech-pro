// Hook to get current user account information
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase/config';

export function useCurrentUser() {
  const { user } = useAuth();
  const [currentUserData, setCurrentUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCurrentUserData(null);
      setLoading(false);
      return;
    }

    const userRef = ref(database, `users/${user.uid}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setCurrentUserData(snapshot.val());
      } else {
        setCurrentUserData(null);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error listening to user data:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return {
    currentUserData,
    loading,
    accountNumber: currentUserData?.accountNumber || null,
    fullName: currentUserData ? `${currentUserData.firstName} ${currentUserData.lastName}` : null
  };
}