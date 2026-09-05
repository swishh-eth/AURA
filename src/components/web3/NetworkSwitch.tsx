'use client';

import { useAccount, useSwitchChain } from 'wagmi';
import { AlertTriangle } from 'lucide-react';
import { robinhoodMainnet } from '@/lib/wagmi';

export function NetworkSwitch() {
  const { chain, isConnected } = useAccount();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected) return null;

  const isCorrectNetwork = chain?.id === robinhoodMainnet.id;

  if (isCorrectNetwork) return null;

  return (
    <div className="flex items-center gap-3 bg-yellow-400/10 border border-yellow-400/30 px-4 py-3">
      <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
      <p className="text-sm text-yellow-400">
        Please switch to Robinhood Chain to use this app.
      </p>
      <button
        onClick={() => switchChain({ chainId: robinhoodMainnet.id })}
        disabled={isPending}
        className="ml-auto text-sm font-medium text-black bg-yellow-400 px-3 py-1 hover:bg-yellow-300 transition-colors disabled:opacity-50"
      >
        {isPending ? 'Switching...' : 'Switch Network'}
      </button>
    </div>
  );
}
