import { RefreshCw } from 'lucide-react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  isEnabled?: boolean;
}

export const PullToRefresh = ({ onRefresh, children, isEnabled = true }: PullToRefreshProps) => {
  const { isRefreshing, pullDistance, isPulling } = usePullToRefresh({
    onRefresh,
    isEnabled,
  });

  const refreshOpacity = Math.min(pullDistance / 100, 1);
  const refreshRotation = (pullDistance / 100) * 360;

  return (
    <div className="relative">
      {/* Pull to refresh indicator */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-gradient-to-b from-purple-900/80 to-transparent backdrop-blur-sm transition-all duration-300"
        style={{
          height: Math.min(pullDistance, 80),
          opacity: isPulling || isRefreshing ? 1 : 0,
        }}
      >
        <div className="flex items-center gap-2 text-white">
          <RefreshCw
            size={20}
            className={`transition-transform ${isRefreshing ? 'animate-spin' : ''}`}
            style={{
              opacity: refreshOpacity,
              transform: `rotate(${isRefreshing ? 0 : refreshRotation}deg)`,
            }}
          />
          <span className="text-sm font-medium" style={{ opacity: refreshOpacity }}>
            {isRefreshing ? 'Обновление...' : pullDistance > 80 ? 'Отпустите для обновления' : 'Потяните для обновления'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        className="transition-transform duration-300 ease-out"
        style={{
          transform: `translateY(${isPulling ? Math.min(pullDistance * 0.5, 40) : 0}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};