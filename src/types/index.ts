export interface Token {
  address: string;
  name: string;
  symbol: string;
  description: string;
  image: string;
  creator: string;
  targetETH: bigint;
  raisedETH: bigint;
  startTime: number;
  endTime: number;
  totalSupply: bigint;
  presalePercent: number;
  lpPercent: number;
  status: 'upcoming' | 'active' | 'funded' | 'live';
}

export interface PresaleNFT {
  tokenId: bigint;
  tokenAddress: string;
  owner: string;
  contribution: bigint;
  percentage: number;
  claimed: boolean;
}

export interface ChatMessage {
  id: string;
  tokenAddress: string;
  sender: string;
  content: string;
  timestamp: number;
}

export interface Proposal {
  id: bigint;
  tokenAddress: string;
  proposer: string;
  title: string;
  description: string;
  forVotes: bigint;
  againstVotes: bigint;
  startTime: number;
  endTime: number;
  executed: boolean;
}

export interface CreateTokenForm {
  name: string;
  symbol: string;
  description: string;
  image: string;
  targetETH: string;
  duration: number;
  maxPerWallet: string;
  totalSupply: string;
  presalePercent: number;
  lpPercent: number;
}

export interface PlatformStats {
  totalRaised: bigint;
  tokensLaunched: number;
  activePresales: number;
}
