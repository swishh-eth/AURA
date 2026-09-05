'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import {
  Wallet,
  Image as ImageIcon,
  Coins,
  Gift,
  ArrowRight,
} from 'lucide-react';
import { NFTGrid } from '@/components/nft/NFTGrid';
import { TokenCard } from '@/components/token/TokenCard';
import { usePresaleNFT } from '@/hooks/usePresaleNFT';
import { formatETH, cn } from '@/lib/utils';

type Tab = 'nfts' | 'contributions' | 'created' | 'claimable';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { userNFTs, claimableNFTs, totalContributed, allTokens } = usePresaleNFT();
  const [activeTab, setActiveTab] = useState<Tab>('nfts');

  const createdTokens = allTokens.filter(
    (t) => address && t.creator.toLowerCase() === address.toLowerCase()
  );

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8 px-4">
        <div className="text-center">
          <Wallet className="w-16 h-16 mx-auto text-white/40 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Connect Your Wallet</h1>
          <p className="text-white/60 mb-6 max-w-md">
            Connect your wallet to view your NFTs, contributions, and created tokens.
          </p>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'nfts', label: 'My NFTs', icon: <ImageIcon className="w-4 h-4" />, count: userNFTs.length },
    {
      id: 'contributions',
      label: 'Contributions',
      icon: <Coins className="w-4 h-4" />,
      count: userNFTs.length,
    },
    {
      id: 'created',
      label: 'Created',
      icon: <Wallet className="w-4 h-4" />,
      count: createdTokens.length,
    },
    {
      id: 'claimable',
      label: 'Claimable',
      icon: <Gift className="w-4 h-4" />,
      count: claimableNFTs.length,
    },
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-white/60">
            Manage your NFTs, contributions, and tokens
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <ImageIcon className="w-5 h-5 text-white/60" />
              <span className="text-white/60">Total NFTs</span>
            </div>
            <p className="text-2xl font-bold">{userNFTs.length}</p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <Coins className="w-5 h-5 text-white/60" />
              <span className="text-white/60">Total Contributed</span>
            </div>
            <p className="text-2xl font-bold">{formatETH(totalContributed)} ETH</p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="w-5 h-5 text-white/60" />
              <span className="text-white/60">Tokens Created</span>
            </div>
            <p className="text-2xl font-bold">{createdTokens.length}</p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <Gift className="w-5 h-5 text-white/60" />
              <span className="text-white/60">Claimable</span>
            </div>
            <p className="text-2xl font-bold">{claimableNFTs.length}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 border whitespace-nowrap transition-colors',
                activeTab === tab.id
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-white/60 border-white/20 hover:border-white/40 hover:text-white'
              )}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={cn(
                    'text-xs px-1.5 py-0.5',
                    activeTab === tab.id ? 'bg-black/20' : 'bg-white/10'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'nfts' && (
          <div>
            <NFTGrid nfts={userNFTs} tokens={allTokens} />
          </div>
        )}

        {activeTab === 'contributions' && (
          <div>
            {userNFTs.length === 0 ? (
              <div className="card text-center py-12">
                <Coins className="w-12 h-12 mx-auto text-white/40 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Contributions</h3>
                <p className="text-white/60 mb-4">
                  You have not contributed to any presales yet
                </p>
                <Link href="/explore" className="btn-primary inline-flex items-center gap-2">
                  Explore Presales
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-xs text-white/60 font-medium pb-3">
                        Token
                      </th>
                      <th className="text-left text-xs text-white/60 font-medium pb-3">
                        NFT ID
                      </th>
                      <th className="text-right text-xs text-white/60 font-medium pb-3">
                        Contribution
                      </th>
                      <th className="text-right text-xs text-white/60 font-medium pb-3">
                        Ownership
                      </th>
                      <th className="text-right text-xs text-white/60 font-medium pb-3">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {userNFTs.map((nft) => {
                      const token = allTokens.find(
                        (t) => t.address.toLowerCase() === nft.tokenAddress.toLowerCase()
                      );
                      return (
                        <tr
                          key={`${nft.tokenAddress}-${nft.tokenId}`}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-4">
                            <Link
                              href={`/token/${nft.tokenAddress}`}
                              className="flex items-center gap-3 hover:text-white/80"
                            >
                              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-xs font-bold">
                                {token?.symbol.slice(0, 2) || '??'}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {token?.name || 'Unknown'}
                                </p>
                                <p className="text-xs text-white/60">
                                  ${token?.symbol || '???'}
                                </p>
                              </div>
                            </Link>
                          </td>
                          <td className="py-4 font-mono text-sm">
                            #{nft.tokenId.toString()}
                          </td>
                          <td className="py-4 text-right">
                            {formatETH(nft.contribution)} ETH
                          </td>
                          <td className="py-4 text-right text-white/60">
                            {nft.percentage.toFixed(2)}%
                          </td>
                          <td className="py-4 text-right">
                            {nft.claimed ? (
                              <span className="text-green-400">Claimed</span>
                            ) : (
                              <span className="text-yellow-400">Pending</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'created' && (
          <div>
            {createdTokens.length === 0 ? (
              <div className="card text-center py-12">
                <Wallet className="w-12 h-12 mx-auto text-white/40 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Tokens Created</h3>
                <p className="text-white/60 mb-4">
                  You have not created any tokens yet
                </p>
                <Link href="/create" className="btn-primary inline-flex items-center gap-2">
                  Create Token
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {createdTokens.map((token) => (
                  <TokenCard key={token.address} token={token} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'claimable' && (
          <div>
            {claimableNFTs.length === 0 ? (
              <div className="card text-center py-12">
                <Gift className="w-12 h-12 mx-auto text-white/40 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nothing to Claim</h3>
                <p className="text-white/60">
                  You do not have any tokens ready to claim
                </p>
              </div>
            ) : (
              <NFTGrid nfts={claimableNFTs} tokens={allTokens} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
