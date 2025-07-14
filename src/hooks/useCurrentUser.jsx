// Hook to get current user account information
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { ref, get } from 'firebase/database';
import { database } from '../firebase/config';

export function useCurrentUser() {
  const { user } = useAuth();
  const [currentUserData, setCurrentUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setCurrentUserData(null);
        setLoading(false);
        return;
      }

      try {
        const userRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          setCurrentUserData(snapshot.val());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  return {
    currentUserData,
    loading,
    accountNumber: currentUserData?.accountNumber || null,
    fullName: currentUserData ? `${currentUserData.firstName} ${currentUserData.lastName}` : null
  };
}