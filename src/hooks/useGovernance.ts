'use client';

import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { getTokenProposals } from '@/mocks/data';
import { Proposal } from '@/types';

export function useGovernance(tokenAddress: string) {
  const { address: userAddress } = useAccount();
  const [proposals, setProposals] = useState<Proposal[]>(() =>
    getTokenProposals(tokenAddress)
  );
  const [isCreating, setIsCreating] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  const createProposal = useCallback(
    async (title: string, description: string): Promise<bigint> => {
      if (!userAddress) throw new Error('Not connected');

      setIsCreating(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const newId = BigInt(proposals.length + 1);
        const newProposal: Proposal = {
          id: newId,
          tokenAddress,
          proposer: userAddress,
          title,
          description,
          forVotes: BigInt(0),
          againstVotes: BigInt(0),
          startTime: Date.now(),
          endTime: Date.now() + 7 * 24 * 60 * 60 * 1000,
          executed: false,
        };

        setProposals((prev) => [...prev, newProposal]);
        console.log('Proposal created:', title);
        return newId;
      } finally {
        setIsCreating(false);
      }
    },
    [tokenAddress, userAddress, proposals.length]
  );

  const vote = useCallback(
    async (proposalId: bigint, support: boolean): Promise<void> => {
      if (!userAddress) throw new Error('Not connected');

      setIsVoting(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setProposals((prev) =>
          prev.map((p) => {
            if (p.id === proposalId) {
              const voteAmount = BigInt('1000000000000000000000');
              return {
                ...p,
                forVotes: support ? p.forVotes + voteAmount : p.forVotes,
                againstVotes: support ? p.againstVotes : p.againstVotes + voteAmount,
              };
            }
            return p;
          })
        );

        console.log('Voted', support ? 'for' : 'against', 'proposal', proposalId.toString());
      } finally {
        setIsVoting(false);
      }
    },
    [userAddress]
  );

  const executeProposal = useCallback(
    async (proposalId: bigint): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setProposals((prev) =>
        prev.map((p) => (p.id === proposalId ? { ...p, executed: true } : p))
      );

      console.log('Executed proposal', proposalId.toString());
    },
    []
  );

  const refreshProposals = useCallback(() => {
    setProposals(getTokenProposals(tokenAddress));
  }, [tokenAddress]);

  return {
    proposals,
    createProposal,
    vote,
    executeProposal,
    refreshProposals,
    isCreating,
    isVoting,
  };
}
