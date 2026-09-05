import { Proposal } from '@/types';
import { VoteButtons } from './VoteButtons';
import { truncateAddress, getTimeRemaining, cn } from '@/lib/utils';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ProposalCardProps {
  proposal: Proposal;
  onVote?: (proposalId: bigint, support: boolean) => Promise<void>;
}

export function ProposalCard({ proposal, onVote }: ProposalCardProps) {
  const now = Date.now();
  const isActive = proposal.startTime <= now && proposal.endTime > now && !proposal.executed;
  const hasEnded = proposal.endTime <= now;
  const isPassed =
    hasEnded && proposal.forVotes > proposal.againstVotes && !proposal.executed;
  const isFailed = hasEnded && proposal.forVotes <= proposal.againstVotes;

  const getStatusInfo = () => {
    if (proposal.executed) {
      return {
        label: 'Executed',
        color: 'text-green-400 bg-green-400/10 border-green-400/30',
        icon: CheckCircle,
      };
    }
    if (isActive) {
      return {
        label: 'Active',
        color: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
        icon: Clock,
      };
    }
    if (isPassed) {
      return {
        label: 'Passed',
        color: 'text-green-400 bg-green-400/10 border-green-400/30',
        icon: CheckCircle,
      };
    }
    if (isFailed) {
      return {
        label: 'Failed',
        color: 'text-red-400 bg-red-400/10 border-red-400/30',
        icon: XCircle,
      };
    }
    return {
      label: 'Pending',
      color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
      icon: AlertCircle,
    };
  };

  const status = getStatusInfo();
  const StatusIcon = status.icon;

  const handleVote = async (support: boolean) => {
    if (onVote) {
      await onVote(proposal.id, support);
    }
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold mb-1">{proposal.title}</h3>
          <p className="text-sm text-white/60">
            Proposed by {truncateAddress(proposal.proposer)}
          </p>
        </div>
        <span
          className={cn(
            'flex items-center gap-1 text-xs font-medium px-2 py-1 border',
            status.color
          )}
        >
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </span>
      </div>

      <p className="text-sm text-white/80 mb-4">{proposal.description}</p>

      {isActive && (
        <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
          <Clock className="w-4 h-4" />
          <span>{getTimeRemaining(proposal.endTime)} remaining</span>
        </div>
      )}

      <VoteButtons
        proposalId={proposal.id}
        forVotes={proposal.forVotes}
        againstVotes={proposal.againstVotes}
        onVote={handleVote}
        disabled={!isActive}
      />
    </div>
  );
}
