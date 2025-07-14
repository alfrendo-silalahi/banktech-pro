// Activity Log Display Component
import { useState } from 'react';
import { useActivity } from '../context/ActivityProvider';

export default function ActivityLog() {
  const { activities, getActivitiesByCategory, getActivityStats, clearActivities } = useActivity();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [timeRange, setTimeRange] = useState(24);

  const stats = getActivityStats();
  const filteredActivities = selectedCategory === 'all' 
    ? activities 
    : getActivitiesByCategory(selectedCategory);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getCategoryColor = (category) => {
    const colors = {
      auth: 'bg-blue-100 text-blue-800',
      transaction: 'bg-green-100 text-green-800',
      navigation: 'bg-purple-100 text-purple-800',
      preference: 'bg-orange-100 text-orange-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.general;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Activity Log</h3>
        <button
          onClick={clearActivities}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Clear Log
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-600">Total Activities</p>
          <p className="text-xl font-bold text-blue-800">{stats.total}</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-green-600">Transactions</p>
          <p className="text-xl font-bold text-green-800">{stats.categories.transaction || 0}</p>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <p className="text-sm text-purple-600">Navigation</p>
          <p className="text-xl font-bold text-purple-800">{stats.categories.navigation || 0}</p>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg">
          <p className="text-sm text-orange-600">Preferences</p>
          <p className="text-xl font-bold text-orange-800">{stats.categories.preference || 0}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          <option value="auth">Authentication</option>
          <option value="transaction">Transactions</option>
          <option value="navigation">Navigation</option>
          <option value="preference">Preferences</option>
        </select>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(Number(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={1}>Last Hour</option>
          <option value={24}>Last 24 Hours</option>
          <option value={168}>Last Week</option>
        </select>
      </div>

      {/* Activity List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredActivities.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No activities found</p>
        ) : (
          filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(activity.category)}`}
                  >
                    {activity.category}
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {activity.action}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {formatTime(activity.timestamp)}
                </p>
                {activity.details && Object.keys(activity.details).length > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    {JSON.stringify(activity.details, null, 2)}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}