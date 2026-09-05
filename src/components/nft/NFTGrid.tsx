import { PresaleNFT, Token } from '@/types';
import { PresaleNFTCard } from './PresaleNFTCard';
import { Wallet } from 'lucide-react';

interface NFTGridProps {
  nfts: PresaleNFT[];
  tokens: Token[];
}

export function NFTGrid({ nfts, tokens }: NFTGridProps) {
  const getToken = (address: string) =>
    tokens.find((t) => t.address.toLowerCase() === address.toLowerCase());

  if (nfts.length === 0) {
    return (
      <div className="card text-center py-12">
        <Wallet className="w-12 h-12 mx-auto text-white/40 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No NFTs Yet</h3>
        <p className="text-white/60">
          Contribute to a presale to receive your participation NFT
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {nfts.map((nft) => (
        <PresaleNFTCard
          key={`${nft.tokenAddress}-${nft.tokenId}`}
          nft={nft}
          token={getToken(nft.tokenAddress)}
        />
      ))}
    </div>
  );
}
