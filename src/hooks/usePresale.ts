'use client';

import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { getTokenByAddress } from '@/mocks/data';
import { Token } from '@/types';

interface Participant {
  address: string;
  contribution: bigint;
  percentage: number;
}

const mockParticipants: Record<string, Participant[]> = {
  '0x1234567890abcdef1234567890abcdef12345678': [
    {
      address: '0xabcdef1234567890abcdef1234567890abcdef12',
      contribution: BigInt('10000000000000000000'),
      percentage: 30.77,
    },
    {
      address: '0x2222222222222222222222222222222222222222',
      contribution: BigInt('8000000000000000000'),
      percentage: 24.62,
    },
    {
      address: '0x3333333333333333333333333333333333333333',
      contribution: BigInt('5000000000000000000'),
      percentage: 15.38,
    },
    {
      address: '0x4444444444444444444444444444444444444444',
      contribution: BigInt('5000000000000000000'),
      percentage: 15.38,
    },
    {
      address: '0x5555555555555555555555555555555555555555',
      contribution: BigInt('4500000000000000000'),
      percentage: 13.85,
    },
  ],
};

export function usePresale(tokenAddress: string) {
  const { address: userAddress } = useAccount();
  const [isContributing, setIsContributing] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const getToken = useCallback((): Token | undefined => {
    return getTokenByAddress(tokenAddress);
  }, [tokenAddress]);

  const getParticipants = useCallback((): Participant[] => {
    return mockParticipants[tokenAddress.toLowerCase()] || [];
  }, [tokenAddress]);

  const getUserContribution = useCallback((): bigint => {
    if (!userAddress) return BigInt(0);
    const participants = getParticipants();
    const participant = participants.find(
      (p) => p.address.toLowerCase() === userAddress.toLowerCase()
    );
    return participant?.contribution || BigInt(0);
  }, [userAddress, getParticipants]);

  const contribute = useCallback(
    async (amount: bigint): Promise<void> => {
      setIsContributing(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log('Contributed:', amount.toString(), 'to', tokenAddress);
      } finally {
        setIsContributing(false);
      }
    },
    [tokenAddress]
  );

  const claim = useCallback(async (): Promise<void> => {
    setIsClaiming(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Claimed tokens from:', tokenAddress);
    } finally {
      setIsClaiming(false);
    }
  }, [tokenAddress]);

  const canClaim = useCallback((): boolean => {
    const token = getToken();
    const contribution = getUserContribution();
    return (
      token?.status === 'live' || token?.status === 'funded'
    ) && contribution > BigInt(0);
  }, [getToken, getUserContribution]);

  return {
    token: getToken(),
    participants: getParticipants(),
    userContribution: getUserContribution(),
    contribute,
    claim,
    canClaim: canClaim(),
    isContributing,
    isClaiming,
  };
}
