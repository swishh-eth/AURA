'use client';

import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { mockPresaleNFTs, mockTokens, getTokenByAddress } from '@/mocks/data';
import { PresaleNFT, Token } from '@/types';

export function usePresaleNFT() {
  const { address: userAddress } = useAccount();

  const userNFTs = useMemo((): PresaleNFT[] => {
    if (!userAddress) return [];
    return mockPresaleNFTs.filter(
      (nft) => nft.owner.toLowerCase() === userAddress.toLowerCase()
    );
  }, [userAddress]);

  const getNFTsForToken = (tokenAddress: string): PresaleNFT[] => {
    if (!userAddress) return [];
    return mockPresaleNFTs.filter(
      (nft) =>
        nft.owner.toLowerCase() === userAddress.toLowerCase() &&
        nft.tokenAddress.toLowerCase() === tokenAddress.toLowerCase()
    );
  };

  const getTokenForNFT = (nft: PresaleNFT): Token | undefined => {
    return getTokenByAddress(nft.tokenAddress);
  };

  const claimableNFTs = useMemo((): PresaleNFT[] => {
    return userNFTs.filter((nft) => {
      if (nft.claimed) return false;
      const token = getTokenByAddress(nft.tokenAddress);
      return token?.status === 'live' || token?.status === 'funded';
    });
  }, [userNFTs]);

  const totalContributed = useMemo((): bigint => {
    return userNFTs.reduce((sum, nft) => sum + nft.contribution, BigInt(0));
  }, [userNFTs]);

  const allTokens = mockTokens;

  return {
    userNFTs,
    getNFTsForToken,
    getTokenForNFT,
    claimableNFTs,
    totalContributed,
    allTokens,
  };
}
