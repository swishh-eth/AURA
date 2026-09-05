'use client';

import { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Token } from '@/types';
import { formatETH, validateETHInput, safeParseEther, calculatePercentage } from '@/lib/utils';
import { formatEther } from 'viem';

interface ContributeFormProps {
  token: Token;
  onContribute?: (amount: bigint) => Promise<void>;
}

export function ContributeForm({ token, onContribute }: ContributeFormProps) {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isActive = token.status === 'active';
  const amountWei = safeParseEther(amount);
  const remainingToTarget = token.targetETH - token.raisedETH;
  const estimatedTokens =
    amountWei > 0 && token.targetETH > 0
      ? (amountWei * token.totalSupply * BigInt(token.presalePercent)) /
        (token.targetETH * BigInt(100))
      : BigInt(0);

  const estimatedOwnership =
    amountWei > 0 && token.targetETH > 0
      ? calculatePercentage(amountWei, token.targetETH) * (token.presalePercent / 100)
      : 0;

  const handleAmountChange = (value: string) => {
    setError('');
    if (validateETHInput(value)) {
      setAmount(value);
    }
  };

  const handleMaxClick = () => {
    if (balance) {
      const maxAmount = balance.value > BigInt(1e16) ? balance.value - BigInt(1e16) : BigInt(0);
      setAmount(formatEther(maxAmount));
    }
  };

  const handleSubmit = async () => {
    if (!isConnected) {
      setError('Please connect your wallet');
      return;
    }

    if (amountWei <= 0) {
      setError('Please enter an amount');
      return;
    }

    if (balance && amountWei > balance.value) {
      setError('Insufficient balance');
      return;
    }

    if (amountWei > remainingToTarget) {
      setError('Amount exceeds remaining target');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (onContribute) {
        await onContribute(amountWei);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        alert('Contribution submitted! (Mock)');
      }
      setAmount('');
    } catch (err) {
      setError('Transaction failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Contribute</h3>

      {!isActive && (
        <div className="bg-yellow-400/10 border border-yellow-400/30 p-4 mb-4">
          <p className="text-sm text-yellow-400">
            {token.status === 'upcoming'
              ? 'This presale has not started yet.'
              : token.status === 'funded'
              ? 'This presale has been fully funded.'
              : 'This token is already live.'}
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="label">Amount (ETH)</label>
          <div className="relative">
            <input
              type="text"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0.0"
              disabled={!isActive || isLoading}
              className="input w-full pr-16"
            />
            <button
              onClick={handleMaxClick}
              disabled={!isConnected || !isActive}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/60 hover:text-white disabled:opacity-50"
            >
              MAX
            </button>
          </div>
          {balance && isConnected && (
            <p className="text-xs text-white/40 mt-1">
              Balance: {formatETH(balance.value)} ETH
            </p>
          )}
        </div>

        {amountWei > 0 && (
          <div className="bg-white/5 p-4 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Estimated tokens</span>
              <span>{formatETH(estimatedTokens)} {token.symbol}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Estimated ownership</span>
              <span>{estimatedOwnership.toFixed(4)}%</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!isConnected || !isActive || isLoading || amountWei <= 0}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Contributing...
            </>
          ) : !isConnected ? (
            'Connect Wallet'
          ) : (
            'Contribute'
          )}
        </button>
      </div>
    </div>
  );
}
