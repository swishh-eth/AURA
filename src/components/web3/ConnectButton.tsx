'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Wallet, ChevronDown, LogOut, Copy, Check, LayoutDashboard } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { truncateAddress } from '@/lib/utils';
import Link from 'next/link';

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (mounted && isConnected && address) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 text-sm font-medium hover:bg-white/15 transition-colors"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          {truncateAddress(address)}
          <ChevronDown className="w-4 h-4" />
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-black border border-white/20 py-2 z-50">
            <button
              onClick={copyAddress}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? 'Copied!' : 'Copy Address'}
            </button>
            <Link
              href="/dashboard"
              onClick={() => setShowDropdown(false)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <button
              onClick={() => {
                disconnect();
                setShowDropdown(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  const injectedConnector = connectors.find((c) => c.id === 'injected');

  return (
    <button
      onClick={() => injectedConnector && connect({ connector: injectedConnector })}
      className="flex items-center gap-2 btn-primary px-3 py-2 text-sm"
    >
      <Wallet className="w-4 h-4" />
      Connect
    </button>
  );
}
