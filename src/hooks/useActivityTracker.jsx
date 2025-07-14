// Activity Tracker Hook with sessionStorage
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthProvider';

const ACTIVITY_KEY = 'banktech_activity_log';
const MAX_ACTIVITIES = 100; // Limit untuk performance

export function useActivityTracker() {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);

  // Load activities from sessionStorage
  useEffect(() => {
    const savedActivities = sessionStorage.getItem(ACTIVITY_KEY);
    if (savedActivities) {
      try {
        setActivities(JSON.parse(savedActivities));
      } catch (error) {
        console.error('Failed to parse activities:', error);
        sessionStorage.removeItem(ACTIVITY_KEY);
      }
    }
  }, []);

  // Save activities to sessionStorage
  const saveActivities = useCallback((newActivities) => {
    try {
      sessionStorage.setItem(ACTIVITY_KEY, JSON.stringify(newActivities));
      setActivities(newActivities);
    } catch (error) {
      console.error('Failed to save activities:', error);
    }
  }, []);

  // Log new activity
  const logActivity = useCallback((action, category = 'general', details = {}) => {
    if (!user) return;

    const newActivity = {
      id: Date.now().toString(),
      userId: user.uid,
      userEmail: user.email,
      action,
      category,
      details,
      timestamp: new Date().toISOString(),
      sessionId: getSessionId()
    };

    setActivities(prev => {
      const updated = [newActivity, ...prev];
      // Keep only latest activities for performance
      const trimmed = updated.slice(0, MAX_ACTIVITIES);
      saveActivities(trimmed);
      return trimmed;
    });
  }, [user, saveActivities]);

  // Get session ID (create if not exists)
  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  };

  // Filter activities by category
  const getActivitiesByCategory = useCallback((category) => {
    return activities.filter(activity => activity.category === category);
  }, [activities]);

  // Get activities by time range
  const getActivitiesByTimeRange = useCallback((hours = 24) => {
    const cutoff = new Date(Date.now() - (hours * 60 * 60 * 1000));
    return activities.filter(activity => new Date(activity.timestamp) > cutoff);
  }, [activities]);

  // Clear activities (session cleanup)
  const clearActivities = useCallback(() => {
    sessionStorage.removeItem(ACTIVITY_KEY);
    sessionStorage.removeItem('session_id');
    setActivities([]);
  }, []);

  // Get activity stats
  const getActivityStats = useCallback(() => {
    const stats = {
      total: activities.length,
      categories: {},
      lastActivity: activities[0]?.timestamp || null,
      sessionStart: sessionStorage.getItem('session_start') || new Date().toISOString()
    };

    activities.forEach(activity => {
      stats.categories[activity.category] = (stats.categories[activity.category] || 0) + 1;
    });

    return stats;
  }, [activities]);

  // Initialize session
  useEffect(() => {
    if (user && !sessionStorage.getItem('session_start')) {
      sessionStorage.setItem('session_start', new Date().toISOString());
      logActivity('session_start', 'auth', { loginTime: new Date().toISOString() });
    }
  }, [user, logActivity]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (!user) {
        // Clear activities when user logs out
        clearActivities();
      }
    };
  }, [user, clearActivities]);

  return {
    activities,
    logActivity,
    getActivitiesByCategory,
    getActivitiesByTimeRange,
    clearActivities,
    getActivityStats
  };
}