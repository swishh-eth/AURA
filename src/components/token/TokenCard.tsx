import Link from 'next/link';
import { Clock, TrendingUp } from 'lucide-react';
import { Token } from '@/types';
import {
  formatETH,
  calculatePercentage,
  getTimeRemaining,
  getTimeUntilStart,
  getStatusColor,
  getStatusBgColor,
  cn,
} from '@/lib/utils';

interface TokenCardProps {
  token: Token;
  featured?: boolean;
}

export function TokenCard({ token, featured = false }: TokenCardProps) {
  const percentage = calculatePercentage(token.raisedETH, token.targetETH);
  const timeDisplay =
    token.status === 'upcoming'
      ? getTimeUntilStart(token.startTime)
      : getTimeRemaining(token.endTime);

  return (
    <Link href={`/token/${token.address}`} className="block group">
      <div className={cn(
        "relative border transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-[#00C805]/30",
        featured
          ? "border-black/10 group-hover:border-[#00C805] bg-black overflow-visible"
          : "border-white/10 group-hover:border-[#00C805] overflow-hidden"
      )}>
        {/* Background Image */}
        <div
          className="absolute inset-0 opacity-50 group-hover:opacity-70 group-hover:scale-110 transition-all duration-500 ease-out"
          style={{
            backgroundImage: `url(${token.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40 group-hover:via-black/70 group-hover:to-black/30 transition-all duration-500" />

        {/* Content */}
        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-14 h-14 rounded-full border-2 border-white/20 overflow-hidden"
                style={{
                  backgroundImage: `url(${token.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div>
                <h3 className="font-semibold text-lg text-white group-hover:text-[#00C805] transition-colors">
                  {token.name}
                </h3>
                <p className="text-sm text-white/60">${token.symbol}</p>
              </div>
            </div>

            <span
              className={cn(
                'text-xs font-medium px-3 py-1.5 capitalize',
                getStatusBgColor(token.status),
                getStatusColor(token.status)
              )}
            >
              {token.status}
            </span>
          </div>

          <p className="text-sm text-white/50 line-clamp-2 mb-5">
            {token.description}
          </p>

          <div className="mb-5">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-white/60">Progress</span>
              <span className="font-bold text-[#00C805]">{percentage.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-white/10 overflow-hidden">
              <div
                className="h-full bg-[#00C805] transition-all duration-500"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-white/50 mt-2">
              <span>{formatETH(token.raisedETH)} ETH</span>
              <span>{formatETH(token.targetETH)} ETH</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-white/50 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#00C805]" />
              <span>{timeDisplay}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00C805]" />
              <span>{token.presalePercent}% presale</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
