import { formatEther, parseEther } from 'viem';

export function truncateAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatETH(wei: bigint, decimals = 4): string {
  const eth = formatEther(wei);
  const num = parseFloat(eth);
  if (num === 0) return '0';
  if (num < 0.0001) return '<0.0001';
  return num.toFixed(decimals).replace(/\.?0+$/, '');
}

export function formatTokenAmount(amount: bigint, decimals = 18, displayDecimals = 2): string {
  const divisor = BigInt(10 ** decimals);
  const whole = amount / divisor;
  const remainder = amount % divisor;

  if (remainder === BigInt(0)) {
    return whole.toLocaleString();
  }

  const remainderStr = remainder.toString().padStart(decimals, '0');
  const displayRemainder = remainderStr.slice(0, displayDecimals);

  return `${whole.toLocaleString()}.${displayRemainder}`;
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toFixed(0);
}

export function calculatePercentage(raised: bigint, target: bigint): number {
  if (target === BigInt(0)) return 0;
  return Number((raised * BigInt(10000)) / target) / 100;
}

export function getTimeRemaining(endTime: number): string {
  const now = Date.now();
  const diff = endTime - now;

  if (diff <= 0) return 'Ended';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function getTimeUntilStart(startTime: number): string {
  const now = Date.now();
  const diff = startTime - now;

  if (diff <= 0) return 'Started';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `Starts in ${days}d ${hours}h`;
  return `Starts in ${hours}h`;
}

export function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Date(timestamp).toLocaleDateString();
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return 'text-green-400';
    case 'funded':
      return 'text-blue-400';
    case 'live':
      return 'text-purple-400';
    case 'upcoming':
      return 'text-yellow-400';
    default:
      return 'text-white';
  }
}

export function getStatusBgColor(status: string): string {
  switch (status) {
    case 'active':
      return 'bg-green-400/10 border-green-400/30';
    case 'funded':
      return 'bg-blue-400/10 border-blue-400/30';
    case 'live':
      return 'bg-purple-400/10 border-purple-400/30';
    case 'upcoming':
      return 'bg-yellow-400/10 border-yellow-400/30';
    default:
      return 'bg-white/10 border-white/30';
  }
}

export function validateETHInput(value: string): boolean {
  if (!value) return true;
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0;
}

export function safeParseEther(value: string): bigint {
  try {
    return parseEther(value || '0');
  } catch {
    return BigInt(0);
  }
}

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
