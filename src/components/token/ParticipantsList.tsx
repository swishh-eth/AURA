import { truncateAddress, formatETH } from '@/lib/utils';

interface Participant {
  address: string;
  contribution: bigint;
  percentage: number;
}

interface ParticipantsListProps {
  participants: Participant[];
  totalRaised: bigint;
}

export function ParticipantsList({ participants, totalRaised }: ParticipantsListProps) {
  const sortedParticipants = [...participants].sort(
    (a, b) => Number(b.contribution - a.contribution)
  );

  if (participants.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Participants</h3>
        <p className="text-white/60 text-center py-8">
          No participants yet. Be the first to contribute!
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Participants</h3>
        <span className="text-sm text-white/60">{participants.length} total</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-xs text-white/60 font-medium pb-3">
                Rank
              </th>
              <th className="text-left text-xs text-white/60 font-medium pb-3">
                Address
              </th>
              <th className="text-right text-xs text-white/60 font-medium pb-3">
                Contribution
              </th>
              <th className="text-right text-xs text-white/60 font-medium pb-3">
                Share
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedParticipants.map((participant, index) => (
              <tr
                key={participant.address}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="py-3 text-sm">
                  <span className="text-white/40">#{index + 1}</span>
                </td>
                <td className="py-3 text-sm font-mono">
                  {truncateAddress(participant.address, 6)}
                </td>
                <td className="py-3 text-sm text-right">
                  {formatETH(participant.contribution)} ETH
                </td>
                <td className="py-3 text-sm text-right text-white/60">
                  {participant.percentage.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
