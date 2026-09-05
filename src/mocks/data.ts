import { Token, PresaleNFT, ChatMessage, Proposal, PlatformStats } from '@/types';

export const mockTokens: Token[] = [
  {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    name: 'CULT DAO',
    symbol: 'CULT',
    description: 'A decentralized autonomous organization funding revolutionary projects. CULT DAO empowers the community to break free from the system.',
    image: '/graphics/mock/CULTDAO.jpg',
    creator: '0xabcdef1234567890abcdef1234567890abcdef12',
    targetETH: BigInt('5000000000000000000'), // 5 ETH
    raisedETH: BigInt('3200000000000000000'), // 3.2 ETH
    startTime: Date.now() - 86400000 * 10, // 10 days ago
    endTime: Date.now() + 86400000 * 4, // 4 days from now
    totalSupply: BigInt('666000000000000000000000000'), // 666M tokens
    presalePercent: 40,
    lpPercent: 30,
    status: 'active',
  },
  {
    address: '0x2345678901abcdef2345678901abcdef23456789',
    name: 'FlightDEX',
    symbol: 'FLIGHT',
    description: 'The fastest DEX on Robinhood Chain. FlightDEX offers lightning-fast swaps, minimal fees, and deep liquidity. Your trades take flight instantly.',
    image: '/graphics/mock/FLIGHT.jpg',
    creator: '0xbcdef1234567890abcdef1234567890abcdef123',
    targetETH: BigInt('8000000000000000000'), // 8 ETH
    raisedETH: BigInt('8000000000000000000'), // 8 ETH (fully funded)
    startTime: Date.now() - 86400000 * 14, // 14 days ago
    endTime: Date.now() - 86400000 * 7, // ended 7 days ago
    totalSupply: BigInt('100000000000000000000000000'), // 100M tokens
    presalePercent: 30,
    lpPercent: 50,
    status: 'funded',
  },
  {
    address: '0x3456789012abcdef3456789012abcdef34567890',
    name: 'RTX GPU INU',
    symbol: 'RTXGPU',
    description: 'The ultimate meme coin for GPU enthusiasts and gamers. RTX GPU INU brings together the crypto and gaming communities. WAGMI to 4090!',
    image: '/graphics/mock/RTXGPUINU.png',
    creator: '0xcdef1234567890abcdef1234567890abcdef1234',
    targetETH: BigInt('4000000000000000000'), // 4 ETH
    raisedETH: BigInt('1200000000000000000'), // 1.2 ETH
    startTime: Date.now() - 86400000 * 1, // 1 day ago
    endTime: Date.now() + 86400000 * 13, // 13 days from now
    totalSupply: BigInt('4090000000000000000000000000'), // 4.09B tokens
    presalePercent: 45,
    lpPercent: 25,
    status: 'active',
  },
  {
    address: '0x4567890123abcdef4567890123abcdef45678901',
    name: 'BIZ',
    symbol: 'BIZ',
    description: 'The official coin of business frogs everywhere. BIZ is for the degens who HODL through the dips. Ribbit your way to riches.',
    image: '/graphics/mock/BIZ.png',
    creator: '0xdef1234567890abcdef1234567890abcdef12345',
    targetETH: BigInt('1500000000000000000'), // 1.5 ETH
    raisedETH: BigInt('0'), // 0 ETH (upcoming)
    startTime: Date.now() + 86400000 * 2, // starts in 2 days
    endTime: Date.now() + 86400000 * 16, // 16 days from now
    totalSupply: BigInt('1000000000000000000000000000'), // 1B tokens
    presalePercent: 50,
    lpPercent: 30,
    status: 'upcoming',
  },
  {
    address: '0x5678901234abcdef5678901234abcdef56789012',
    name: 'OFFICE',
    symbol: 'OFFICE',
    description: 'For the 9-5 warriors who trade on their lunch break. OFFICE coin rewards diamond hands and punishes paper hands. Clock in, stack sats.',
    image: '/graphics/mock/OFFICE.jpg',
    creator: '0xef1234567890abcdef1234567890abcdef123456',
    targetETH: BigInt('2500000000000000000'), // 2.5 ETH
    raisedETH: BigInt('1800000000000000000'), // 1.8 ETH
    startTime: Date.now() - 86400000 * 1, // 1 day ago
    endTime: Date.now() + 86400000 * 6, // 6 days from now
    totalSupply: BigInt('69000000000000000000000000'), // 69M tokens
    presalePercent: 40,
    lpPercent: 35,
    status: 'active',
  },
  {
    address: '0x6789012345abcdef6789012345abcdef67890123',
    name: 'GNOME',
    symbol: 'GNOME',
    description: 'The friendliest meme coin in the garden. Gnome brings joy and whimsy to DeFi with community-driven initiatives and surprise airdrops.',
    image: '/graphics/mock/GNOME.jpg',
    creator: '0xf1234567890abcdef1234567890abcdef1234567',
    targetETH: BigInt('2000000000000000000'), // 2 ETH
    raisedETH: BigInt('1400000000000000000'), // 1.4 ETH
    startTime: Date.now() - 86400000 * 3, // 3 days ago
    endTime: Date.now() + 86400000 * 4, // 4 days from now
    totalSupply: BigInt('247000000000000000000000000'), // 247M tokens
    presalePercent: 35,
    lpPercent: 40,
    status: 'active',
  },
  {
    address: '0x7890123456abcdef7890123456abcdef78901234',
    name: 'JOE',
    symbol: 'JOE',
    description: 'The chillest meme coin on Robinhood Chain. Trader Joe is here to make gains and drink coffee. No roadmap, just vibes.',
    image: '/graphics/mock/JOE.jpg',
    creator: '0x1234567890abcdef1234567890abcdef12345678',
    targetETH: BigInt('3000000000000000000'), // 3 ETH
    raisedETH: BigInt('1800000000000000000'), // 1.8 ETH
    startTime: Date.now() - 86400000 * 4, // 4 days ago
    endTime: Date.now() + 86400000 * 3, // 3 days from now
    totalSupply: BigInt('1000000000000000000000000000'), // 1B tokens
    presalePercent: 40,
    lpPercent: 30,
    status: 'active',
  },
  {
    address: '0x8901234567abcdef8901234567abcdef89012345',
    name: 'LOWFI',
    symbol: 'LOWFI',
    description: 'Chill beats to trade to. LOWFI is the meme coin for late night degens vibing to lo-fi hip hop while watching charts.',
    image: '/graphics/mock/LOWFI.jpg',
    creator: '0x2345678901abcdef2345678901abcdef23456789',
    targetETH: BigInt('2500000000000000000'), // 2.5 ETH
    raisedETH: BigInt('900000000000000000'), // 0.9 ETH
    startTime: Date.now() - 86400000 * 0.5, // 12 hours ago
    endTime: Date.now() + 86400000 * 7, // 7 days from now
    totalSupply: BigInt('808000000000000000000000000'), // 808M tokens
    presalePercent: 35,
    lpPercent: 40,
    status: 'active',
  },
];

export const mockPresaleNFTs: PresaleNFT[] = [
  {
    tokenId: BigInt(1),
    tokenAddress: '0x1234567890abcdef1234567890abcdef12345678',
    owner: '0x1111111111111111111111111111111111111111',
    contribution: BigInt('5000000000000000000'), // 5 ETH
    percentage: 15.38,
    claimed: false,
  },
  {
    tokenId: BigInt(2),
    tokenAddress: '0x2345678901abcdef2345678901abcdef23456789',
    owner: '0x1111111111111111111111111111111111111111',
    contribution: BigInt('10000000000000000000'), // 10 ETH
    percentage: 10.0,
    claimed: true,
  },
  {
    tokenId: BigInt(3),
    tokenAddress: '0x5678901234abcdef5678901234abcdef56789012',
    owner: '0x1111111111111111111111111111111111111111',
    contribution: BigInt('3000000000000000000'), // 3 ETH
    percentage: 5.0,
    claimed: true,
  },
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    tokenAddress: '0x1234567890abcdef1234567890abcdef12345678',
    sender: '0xabcdef1234567890abcdef1234567890abcdef12',
    content: 'Welcome to Aurora Protocol! Excited to have you all here. We are building something special.',
    timestamp: Date.now() - 3600000 * 24,
  },
  {
    id: '2',
    tokenAddress: '0x1234567890abcdef1234567890abcdef12345678',
    sender: '0x2222222222222222222222222222222222222222',
    content: 'When will the tokenomics details be released?',
    timestamp: Date.now() - 3600000 * 20,
  },
  {
    id: '3',
    tokenAddress: '0x1234567890abcdef1234567890abcdef12345678',
    sender: '0xabcdef1234567890abcdef1234567890abcdef12',
    content: 'Full tokenomics breakdown coming this week! 40% presale, 30% LP, 20% team (vested), 10% ecosystem.',
    timestamp: Date.now() - 3600000 * 18,
  },
  {
    id: '4',
    tokenAddress: '0x1234567890abcdef1234567890abcdef12345678',
    sender: '0x3333333333333333333333333333333333333333',
    content: 'Looking forward to launch! Been following this project for a while.',
    timestamp: Date.now() - 3600000 * 12,
  },
  {
    id: '5',
    tokenAddress: '0x1234567890abcdef1234567890abcdef12345678',
    sender: '0x4444444444444444444444444444444444444444',
    content: 'Just contributed 2 ETH. LFG!',
    timestamp: Date.now() - 3600000 * 6,
  },
];

export const mockProposals: Proposal[] = [
  {
    id: BigInt(1),
    tokenAddress: '0x5678901234abcdef5678901234abcdef56789012',
    proposer: '0xef1234567890abcdef1234567890abcdef123456',
    title: 'Increase marketing budget allocation',
    description: 'Proposal to allocate 10 ETH from the community vault for marketing initiatives including influencer partnerships, Twitter campaigns, and community events.',
    forVotes: BigInt('45000000000000000000000'), // 45K tokens
    againstVotes: BigInt('12000000000000000000000'), // 12K tokens
    startTime: Date.now() - 86400000 * 2,
    endTime: Date.now() + 86400000 * 5,
    executed: false,
  },
  {
    id: BigInt(2),
    tokenAddress: '0x5678901234abcdef5678901234abcdef56789012',
    proposer: '0x5555555555555555555555555555555555555555',
    title: 'Partnership with DeFi protocol',
    description: 'Establish a strategic partnership with a leading DeFi protocol for liquidity mining and cross-promotion. This will help expand our user base and provide additional utility for token holders.',
    forVotes: BigInt('78000000000000000000000'), // 78K tokens
    againstVotes: BigInt('5000000000000000000000'), // 5K tokens
    startTime: Date.now() - 86400000 * 10,
    endTime: Date.now() - 86400000 * 3,
    executed: true,
  },
];

export const mockPlatformStats: PlatformStats = {
  totalRaised: BigInt('47300000000000000000'), // 47.3 ETH
  tokensLaunched: 12,
  activePresales: 3,
};

export const getTokenByAddress = (address: string): Token | undefined => {
  return mockTokens.find((t) => t.address.toLowerCase() === address.toLowerCase());
};

export const getTokenMessages = (address: string): ChatMessage[] => {
  return mockChatMessages.filter((m) => m.tokenAddress.toLowerCase() === address.toLowerCase());
};

export const getTokenProposals = (address: string): Proposal[] => {
  return mockProposals.filter((p) => p.tokenAddress.toLowerCase() === address.toLowerCase());
};

export const getUserNFTs = (userAddress: string): PresaleNFT[] => {
  return mockPresaleNFTs.filter((n) => n.owner.toLowerCase() === userAddress.toLowerCase());
};
