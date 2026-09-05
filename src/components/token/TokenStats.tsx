import { Clock, Target, Users, Wallet } from 'lucide-react';
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

interface TokenStatsProps {
  token: Token;
  userContribution?: bigint;
  participantsCount?: number;
}

export function TokenStats({
  token,
  userContribution,
  participantsCount = 0,
}: TokenStatsProps) {
  const percentage = calculatePercentage(token.raisedETH, token.targetETH);
  const timeDisplay =
    token.status === 'upcoming'
      ? getTimeUntilStart(token.startTime)
      : getTimeRemaining(token.endTime);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Presale Stats</h3>
        <span
          className={cn(
            'text-xs font-medium px-3 py-1 border capitalize',
            getStatusBgColor(token.status),
            getStatusColor(token.status)
          )}
        >
          {token.status}
        </span>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/60">Raised</span>
          <span className="font-semibold text-lg">
            {formatETH(token.raisedETH)} / {formatETH(token.targetETH)} ETH
          </span>
        </div>
        <div className="h-3 bg-white/10 overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-500"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="text-right text-sm text-white/60 mt-1">
          {percentage.toFixed(2)}% funded
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 p-4 border border-white/10">
          <div className="flex items-center gap-2 text-white/60 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Time</span>
          </div>
          <p className="font-semibold">{timeDisplay}</p>
        </div>

        <div className="bg-white/5 p-4 border border-white/10">
          <div className="flex items-center gap-2 text-white/60 mb-1">
            <Target className="w-4 h-4" />
            <span className="text-sm">Target</span>
          </div>
          <p className="font-semibold">{formatETH(token.targetETH)} ETH</p>
        </div>

        <div className="bg-white/5 p-4 border border-white/10">
          <div className="flex items-center gap-2 text-white/60 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-sm">Participants</span>
          </div>
          <p className="font-semibold">{participantsCount}</p>
        </div>

        <div className="bg-white/5 p-4 border border-white/10">
          <div className="flex items-center gap-2 text-white/60 mb-1">
            <Wallet className="w-4 h-4" />
            <span className="text-sm">Your Contribution</span>
          </div>
          <p className="font-semibold">
            {userContribution ? formatETH(userContribution) : '0'} ETH
          </p>
        </div>
      </div>
    </div>
  );
}
