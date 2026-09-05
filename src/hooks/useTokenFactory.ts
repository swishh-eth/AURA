'use client';

import { useState, useCallback } from 'react';
import { mockTokens, mockPlatformStats } from '@/mocks/data';
import { Token, CreateTokenForm, PlatformStats } from '@/types';
import { parseEther } from 'viem';

const LAUNCH_FEE = parseEther('0.01');

export function useTokenFactory() {
  const [isLoading, setIsLoading] = useState(false);

  const getAllTokens = useCallback((): Token[] => {
    return mockTokens;
  }, []);

  const getActiveTokens = useCallback((): Token[] => {
    return mockTokens.filter((t) => t.status === 'active');
  }, []);

  const getFeaturedTokens = useCallback((): Token[] => {
    return mockTokens
      .filter((t) => t.status === 'active' || t.status === 'funded')
      .slice(0, 5);
  }, []);

  const getRecentTokens = useCallback((): Token[] => {
    return [...mockTokens]
      .sort((a, b) => b.startTime - a.startTime)
      .slice(0, 6);
  }, []);

  const getPlatformStats = useCallback((): PlatformStats => {
    return mockPlatformStats;
  }, []);

  const getLaunchFee = useCallback((): bigint => {
    return LAUNCH_FEE;
  }, []);

  const createToken = useCallback(
    async (form: CreateTokenForm): Promise<string> => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const newAddress = `0x${Math.random().toString(16).slice(2, 42)}`;
        console.log('Token created:', newAddress, form);
        return newAddress;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    getAllTokens,
    getActiveTokens,
    getFeaturedTokens,
    getRecentTokens,
    getPlatformStats,
    getLaunchFee,
    createToken,
    isLoading,
    launchFee: LAUNCH_FEE,
  };
}
