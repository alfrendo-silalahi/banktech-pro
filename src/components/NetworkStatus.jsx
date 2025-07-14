// Network Status Indicator Component
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export default function NetworkStatus() {
  const isOnline = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 z-50">
      <div className="flex items-center justify-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span className="text-sm font-medium">
          You're offline. Some features may be limited.
        </span>
      </div>
    </div>
  );
}