// Activity Logger Context Provider
import { createContext, useContext } from 'react';
import { useActivityTracker } from '../hooks/useActivityTracker';

const ActivityContext = createContext();

export function ActivityProvider({ children }) {
  const activityTracker = useActivityTracker();

  return (
    <ActivityContext.Provider value={activityTracker}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
}