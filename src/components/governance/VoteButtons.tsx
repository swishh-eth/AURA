'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoteButtonsProps {
  proposalId: bigint;
  forVotes: bigint;
  againstVotes: bigint;
  hasVoted?: boolean;
  userVote?: 'for' | 'against';
  onVote?: (support: boolean) => Promise<void>;
  disabled?: boolean;
}

export function VoteButtons({
  proposalId,
  forVotes,
  againstVotes,
  hasVoted,
  userVote,
  onVote,
  disabled,
}: VoteButtonsProps) {
  const { isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState<'for' | 'against' | null>(null);

  const totalVotes = forVotes + againstVotes;
  const forPercentage =
    totalVotes > 0 ? Number((forVotes * BigInt(100)) / totalVotes) : 50;
  const againstPercentage = 100 - forPercentage;

  const handleVote = async (support: boolean) => {
    if (!onVote || hasVoted || disabled || !isConnected) return;

    setIsLoading(support ? 'for' : 'against');
    try {
      await onVote(support);
    } catch (error) {
      console.error('Vote failed:', error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="h-2 bg-white/10 flex overflow-hidden">
        <div
          className="bg-green-400 transition-all duration-300"
          style={{ width: `${forPercentage}%` }}
        />
        <div
          className="bg-red-400 transition-all duration-300"
          style={{ width: `${againstPercentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <ThumbsUp className="w-4 h-4 text-green-400" />
          <span className="text-green-400">{forPercentage}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-red-400">{againstPercentage}%</span>
          <ThumbsDown className="w-4 h-4 text-red-400" />
        </div>
      </div>

      {!hasVoted && isConnected && (
        <div className="flex gap-2">
          <button
            onClick={() => handleVote(true)}
            disabled={disabled || isLoading !== null}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2 border transition-colors',
              'border-green-400/30 text-green-400 hover:bg-green-400/10',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isLoading === 'for' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ThumbsUp className="w-4 h-4" />
                <span>For</span>
              </>
            )}
          </button>
          <button
            onClick={() => handleVote(false)}
            disabled={disabled || isLoading !== null}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2 border transition-colors',
              'border-red-400/30 text-red-400 hover:bg-red-400/10',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isLoading === 'against' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ThumbsDown className="w-4 h-4" />
                <span>Against</span>
              </>
            )}
          </button>
        </div>
      )}

      {hasVoted && (
        <div className="text-center text-sm text-white/60">
          You voted{' '}
          <span className={userVote === 'for' ? 'text-green-400' : 'text-red-400'}>
            {userVote === 'for' ? 'for' : 'against'}
          </span>{' '}
          this proposal
        </div>
      )}

      {!isConnected && (
        <p className="text-center text-sm text-white/40">
          Connect wallet to vote
        </p>
      )}
    </div>
  );
}
