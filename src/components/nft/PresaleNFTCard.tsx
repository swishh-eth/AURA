import Link from 'next/link';
import { PresaleNFT, Token } from '@/types';
import { formatETH, truncateAddress } from '@/lib/utils';
import { ExternalLink, Check, Clock } from 'lucide-react';

interface PresaleNFTCardProps {
  nft: PresaleNFT;
  token?: Token;
}

export function PresaleNFTCard({ nft, token }: PresaleNFTCardProps) {
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-lg font-bold">
          {token?.symbol.slice(0, 2) || '??'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">
            {token?.name || 'Unknown Token'}
          </h3>
          <p className="text-sm text-white/60">${token?.symbol || '???'}</p>
        </div>
        <Link
          href={`/token/${nft.tokenAddress}`}
          className="text-white/60 hover:text-white transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">NFT ID</span>
          <span className="font-mono">#{nft.tokenId.toString()}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Contribution</span>
          <span>{formatETH(nft.contribution)} ETH</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Ownership</span>
          <span>{nft.percentage.toFixed(2)}%</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Status</span>
          {nft.claimed ? (
            <span className="flex items-center gap-1 text-green-400">
              <Check className="w-4 h-4" />
              Claimed
            </span>
          ) : (
            <span className="flex items-center gap-1 text-yellow-400">
              <Clock className="w-4 h-4" />
              Pending
            </span>
          )}
        </div>
      </div>

      {!nft.claimed && token?.status === 'live' && (
        <button className="btn-primary w-full mt-4 text-sm">
          Claim Tokens
        </button>
      )}
    </div>
  );
}
