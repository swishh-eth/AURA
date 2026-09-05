'use client';

import { formatETH, calculatePercentage } from '@/lib/utils';

interface PresaleProgressProps {
  raisedETH: bigint;
  targetETH: bigint;
  variant?: 'linear' | 'circular';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export function PresaleProgress({
  raisedETH,
  targetETH,
  variant = 'linear',
  size = 'md',
  showLabels = true,
}: PresaleProgressProps) {
  const percentage = calculatePercentage(raisedETH, targetETH);
  const clampedPercentage = Math.min(percentage, 100);

  if (variant === 'circular') {
    const sizeClasses = {
      sm: 'w-20 h-20',
      md: 'w-32 h-32',
      lg: 'w-48 h-48',
    };

    const strokeWidth = size === 'sm' ? 6 : size === 'md' ? 8 : 10;
    const radius = size === 'sm' ? 32 : size === 'md' ? 56 : 88;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (clampedPercentage / 100) * circumference;

    return (
      <div className={`relative ${sizeClasses[size]}`}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="white"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{clampedPercentage.toFixed(0)}%</span>
          {showLabels && (
            <span className="text-xs text-white/60">funded</span>
          )}
        </div>
      </div>
    );
  }

  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="w-full">
      {showLabels && (
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-white/60">Progress</span>
          <span className="font-medium">{percentage.toFixed(1)}%</span>
        </div>
      )}
      <div className={`w-full bg-white/10 overflow-hidden ${heightClasses[size]}`}>
        <div
          className="h-full bg-white transition-all duration-500"
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
      {showLabels && (
        <div className="flex items-center justify-between text-xs text-white/60 mt-1">
          <span>{formatETH(raisedETH)} ETH raised</span>
          <span>{formatETH(targetETH)} ETH target</span>
        </div>
      )}
    </div>
  );
}
