'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, Users, TrendingUp } from 'lucide-react';
import { TokenCard } from '@/components/token/TokenCard';
import { useTokenFactory } from '@/hooks/useTokenFactory';
import { formatETH, formatNumber } from '@/lib/utils';

// Candlestick data type
interface Candle {
  x: number;
  open: number;
  close: number;
  high: number;
  low: number;
  isBullish: boolean;
}

// Generate candlestick chart data between two points
function generateCandlesticks(x1: number, y1: number, x2: number, y2: number, seed: number): Candle[] {
  const numCandles = 40;
  const candles: Candle[] = [];

  const dx = x2 - x1;
  const dy = y2 - y1;

  // Use seeded random for consistent candles
  const seededRandom = (i: number) => {
    const x = Math.sin(seed + i * 9999) * 10000;
    return x - Math.floor(x);
  };

  let currentPrice = y1;

  for (let i = 0; i < numCandles; i++) {
    const t = (i + 1) / (numCandles + 1);
    const targetY = y1 + dy * t;
    const x = x1 + dx * t;

    // Smooth bias towards the target
    const trendBias = (targetY - currentPrice) * 0.25;

    // Varied candle sizes - some tiny, some medium, some big
    const sizeRoll = seededRandom(i + 50);
    let moveSize;
    if (sizeRoll > 0.92) {
      moveSize = 5; // 8% chance of very big candle
    } else if (sizeRoll > 0.75) {
      moveSize = 3; // 17% chance of big candle
    } else if (sizeRoll > 0.4) {
      moveSize = 1.5; // 35% chance of medium candle
    } else {
      moveSize = 0.6; // 40% chance of small candle
    }

    const randomMove = (seededRandom(i) - 0.5) * moveSize;

    const open = currentPrice;
    const close = currentPrice + trendBias + randomMove;

    // Wicks - some candles have long wicks (doji, hammer, etc)
    const bodySize = Math.abs(close - open);
    const wickRoll = seededRandom(i + 200);
    let upperWickMult, lowerWickMult;

    if (wickRoll > 0.9) {
      // Long upper wick (shooting star)
      upperWickMult = 2.5;
      lowerWickMult = 0.3;
    } else if (wickRoll > 0.8) {
      // Long lower wick (hammer)
      upperWickMult = 0.3;
      lowerWickMult = 2.5;
    } else if (wickRoll > 0.7) {
      // Long both wicks (doji-like)
      upperWickMult = 1.8;
      lowerWickMult = 1.8;
    } else {
      // Normal wicks
      upperWickMult = 0.5;
      lowerWickMult = 0.5;
    }

    const upperWick = seededRandom(i + 100) * bodySize * upperWickMult + 0.2;
    const lowerWick = seededRandom(i + 150) * bodySize * lowerWickMult + 0.2;

    const high = Math.min(open, close) - upperWick;
    const low = Math.max(open, close) + lowerWick;

    candles.push({
      x,
      open,
      close,
      high,
      low,
      isBullish: close < open // In screen coords, lower Y = higher price = bullish
    });

    currentPrice = close;
  }

  return candles;
}

export default function HomePage() {
  const { getFeaturedTokens, getRecentTokens, getPlatformStats } = useTokenFactory();
  const leftDotRef = useRef<HTMLDivElement>(null);
  const rightDotRef = useRef<HTMLDivElement>(null);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [isUptrend, setIsUptrend] = useState(true);
  const seedRef = useRef(Math.random() * 1000);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const featuresRef = useRef<HTMLElement>(null);

  // Track scroll position for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track mouse position for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Update candlestick chart to follow the dots smoothly
  useEffect(() => {
    const updateChart = () => {
      if (leftDotRef.current && rightDotRef.current) {
        const leftRect = leftDotRef.current.getBoundingClientRect();
        const rightRect = rightDotRef.current.getBoundingClientRect();
        const container = leftDotRef.current.parentElement?.getBoundingClientRect();

        if (container) {
          // Convert to percentage coordinates (0-100 viewBox)
          const x1 = ((leftRect.left + leftRect.width / 2 - container.left) / container.width) * 100;
          const y1 = ((leftRect.top + leftRect.height / 2 - container.top) / container.height) * 100;
          const x2 = ((rightRect.left + rightRect.width / 2 - container.left) / container.width) * 100;
          const y2 = ((rightRect.top + rightRect.height / 2 - container.top) / container.height) * 100;

          // Determine trend: if right hand is higher (lower Y value), it's uptrend
          setIsUptrend(y2 < y1);

          // Generate candles with fixed seed - chart shape stays consistent
          const newCandles = generateCandlesticks(x1, y1, x2, y2, seedRef.current);
          setCandles(newCandles);
        }
      }
      requestAnimationFrame(updateChart);
    };

    const animationId = requestAnimationFrame(updateChart);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  const featuredTokens = getFeaturedTokens();
  const recentTokens = getRecentTokens();
  const stats = getPlatformStats();

  return (
    <div className="min-h-screen">
      {/* Hero Section - Takes up most of viewport */}
      <section className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ height: '100dvh', marginTop: '-8rem', paddingTop: '8rem' }}>
        {/* Background clouds image */}
        <div
          className="absolute -z-20 transition-transform duration-100 ease-out pointer-events-none"
          style={{
            top: '-20px',
            left: '-20px',
            right: '-20px',
            bottom: '-20px',
            backgroundImage: 'url(/graphics/cloudsbackground.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            opacity: 0.3,
            transform: `translate(${mousePos.x * 5}px, ${mousePos.y * 5}px)`
          }}
        />
        {/* Radial gradient overlay to darken clouds toward center */}
        <div
          className="absolute -z-10 pointer-events-none"
          style={{
            top: '-20px',
            left: '-20px',
            right: '-20px',
            bottom: '-20px',
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 80%)'
          }}
        />
        <div className="max-w-7xl mx-auto text-center relative z-10 -mt-40">
          {/* Radial gradient backdrop - darker/more blurred in center, fades at edges */}
          <div
            className="absolute inset-0 -z-10 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0) 50%)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              maskImage: 'radial-gradient(ellipse at center, black 0%, black 25%, transparent 50%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, black 25%, transparent 50%)',
              transform: 'scale(1.5)',
            }}
          />
          <div className="px-8 py-10">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              Launch Tokens on
              <br />
              <span className="text-white">Robinhood Chain</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10">
              Crowdfund from members to raise ETH via smart contracts. Then create, LP, and distribute tokens to members—all through a decentralized protocol.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/create" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
                Launch Token
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/explore" className="btn-secondary flex items-center gap-2 text-lg px-8 py-4">
                Explore Presales
              </Link>
            </div>
          </div>
        </div>

        {/* Hand graphics - Creation of Adam style */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          {/* Left finger dot - animates with left hand */}
          <div
            ref={leftDotRef}
            className="absolute w-2 h-2 rounded-full animate-float-slow opacity-30 md:opacity-100"
            style={{
              left: 'calc(32% - 100px)',
              top: 'calc(40% + 145px)',
              backgroundColor: '#00C805'
            }}
          />
          {/* Right finger dot - animates with right hand */}
          <div
            ref={rightDotRef}
            className="absolute w-2 h-2 rounded-full animate-float-slow-reverse opacity-30 md:opacity-100"
            style={{
              right: 'calc(30% - 35px)',
              top: 'calc(47% - 310px)',
              backgroundColor: '#00C805'
            }}
          />
          {/* Candlestick chart between fingers */}
          <svg
            className="absolute inset-0 w-full h-full opacity-30 md:opacity-100"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Subtle glow filter for candles */}
              <filter id="candle-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="0.2" result="blur1"/>
                <feMerge>
                  <feMergeNode in="blur1"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              {/* Gradient for bullish candles */}
              <linearGradient id="bullish-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00FF0A" />
                <stop offset="100%" stopColor="#00C805" />
              </linearGradient>
              {/* Gradient for bearish candles */}
              <linearGradient id="bearish-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ff5252" />
                <stop offset="100%" stopColor="#ff3b30" />
              </linearGradient>
            </defs>
            {/* Render candlesticks */}
            {candles.map((candle, index) => {
              const color = candle.isBullish ? '#00C805' : '#ff3b30';
              const gradient = candle.isBullish ? 'url(#bullish-gradient)' : 'url(#bearish-gradient)';
              const bodyTop = Math.min(candle.open, candle.close);
              const bodyHeight = Math.abs(candle.close - candle.open);
              const candleWidth = 0.7;

              return (
                <g key={index} style={{ filter: 'url(#candle-glow)' }}>
                  {/* Wick (high to low line) */}
                  <line
                    x1={candle.x}
                    y1={candle.high}
                    x2={candle.x}
                    y2={candle.low}
                    stroke={color}
                    strokeWidth="0.12"
                    strokeLinecap="round"
                  />
                  {/* Body (rectangle) */}
                  <rect
                    x={candle.x - candleWidth / 2}
                    y={bodyTop}
                    width={candleWidth}
                    height={Math.max(bodyHeight, 0.2)}
                    fill={gradient}
                    rx="0.1"
                  />
                </g>
              );
            })}
          </svg>

          {/* Right hand (flipped) - now on left side, lower position */}
          <div className="absolute -left-[100px] md:-left-[50px] top-[30%] md:top-[22%] h-[50%] md:h-[70%] w-auto animate-float-slow opacity-30 md:opacity-100">
            <div className="h-full" style={{ transform: 'scaleX(-1) rotate(15deg)' }}>
              <img
                src="/graphics/RightHandHero.png?v=3"
                alt=""
                className="h-full w-auto object-contain"
              />
            </div>
          </div>
          {/* Left hand (flipped) - now on right side, higher position */}
          <div className="absolute top-[5%] md:-top-[10%] -right-[100px] md:-right-[50px] h-[50%] md:h-[70%] w-auto animate-float-slow-reverse opacity-30 md:opacity-100">
            <div className="h-full" style={{ transform: 'scaleX(-1) rotate(-10deg)' }}>
              <img
                src="/graphics/LeftHandHero.png?v=3"
                alt=""
                className="h-full w-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* Stats - sitting at bottom of viewport */}
        <div className="absolute bottom-0 left-0 right-0 py-6 bg-black z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold mb-1">{formatETH(stats.totalRaised)} ETH</p>
                <p className="text-sm text-white/60">Total Raised</p>
              </div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold mb-1">{formatNumber(stats.tokensLaunched)}</p>
                <p className="text-sm text-white/60">Tokens Launched</p>
              </div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold mb-1">{formatNumber(stats.activePresales)}</p>
                <p className="text-sm text-white/60">Active Presales</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features + Featured Presales Wrapper for statue clipping */}
      <div className="relative overflow-hidden">
        {/* Phone statue image - spans both sections */}
        <img
          src="/graphics/phonestatuegraphic.png"
          alt=""
          className="absolute pointer-events-none z-[5] opacity-20 md:opacity-100 scale-75 md:scale-100 origin-bottom-left"
          style={{
            left: '-150px',
            top: '150px',
            transform: `scale(1.2) translateY(${Math.max(0, Math.min(100, 100 - (scrollY - 200) * 0.15))}px)`,
            transformOrigin: 'center center',
            transition: 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
            maskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 95%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 95%)',
          }}
        />
      {/* Features Section */}
      <section ref={featuresRef} className="py-32 px-4 sm:px-6 lg:px-8 bg-black relative">
        {/* Gradient accent */}
        <div
          className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 100% 50%, rgba(0,200,5,0.15) 0%, transparent 60%)',
          }}
        />

        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Placeholder for statue */}
            <div className="relative h-[600px] hidden lg:flex items-center justify-center">
              {/* Statue appears here via absolute positioning */}
            </div>

            {/* Right side - Features */}
            <div className="space-y-10">
              <div>
                <p className="text-[#00C805] text-sm font-medium tracking-widest uppercase mb-2">Platform Benefits</p>
                <h2 className="text-4xl sm:text-5xl font-bold mb-4">Why Choose AURA?</h2>
                <p className="text-white/40 text-lg max-w-md">The decentralized launchpad built for communities, not VCs.</p>
              </div>

              <div className="space-y-4">
                <div className="group flex gap-5 p-5 border border-white/5 hover:border-[#00C805]/30 bg-white/[0.02] hover:bg-[#00C805]/5 transition-all duration-300">
                  <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center border border-[#00C805] text-[#00C805] font-bold text-xl group-hover:bg-[#00C805] group-hover:text-black transition-all duration-300">
                    01
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1.5 group-hover:text-[#00C805] transition-colors">Fair Launch</h3>
                    <p className="text-white/40 text-sm leading-relaxed">
                      No presale allocation for insiders. Everyone gets equal opportunity.
                    </p>
                  </div>
                </div>

                <div className="group flex gap-5 p-5 border border-white/5 hover:border-[#00C805]/30 bg-white/[0.02] hover:bg-[#00C805]/5 transition-all duration-300">
                  <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center border border-[#00C805] text-[#00C805] font-bold text-xl group-hover:bg-[#00C805] group-hover:text-black transition-all duration-300">
                    02
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1.5 group-hover:text-[#00C805] transition-colors">NFT Ownership</h3>
                    <p className="text-white/40 text-sm leading-relaxed">
                      Your contribution is represented as an NFT with voting rights.
                    </p>
                  </div>
                </div>

                <div className="group flex gap-5 p-5 border border-white/5 hover:border-[#00C805]/30 bg-white/[0.02] hover:bg-[#00C805]/5 transition-all duration-300">
                  <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center border border-[#00C805] text-[#00C805] font-bold text-xl group-hover:bg-[#00C805] group-hover:text-black transition-all duration-300">
                    03
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1.5 group-hover:text-[#00C805] transition-colors">Community Vault</h3>
                    <p className="text-white/40 text-sm leading-relaxed">
                      Excess funds go to a vault governed by token holders.
                    </p>
                  </div>
                </div>

                <div className="group flex gap-5 p-5 border border-white/5 hover:border-[#00C805]/30 bg-white/[0.02] hover:bg-[#00C805]/5 transition-all duration-300">
                  <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center border border-[#00C805] text-[#00C805] font-bold text-xl group-hover:bg-[#00C805] group-hover:text-black transition-all duration-300">
                    04
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1.5 group-hover:text-[#00C805] transition-colors">Auto LP</h3>
                    <p className="text-white/40 text-sm leading-relaxed">
                      Liquidity automatically added and locked after presale.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Presales */}
      {featuredTokens.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Green background layer - behind statue */}
          <div className="absolute inset-0 bg-[#00C805] z-0" />
          <div className="relative z-20">
                        {/* Desktop layout - middle 3 in container, outer 2 extend beyond */}
            <div className="hidden lg:block">
              <div className="max-w-7xl mx-auto relative">
                {/* Middle 3 cards */}
                <div className="grid grid-cols-3 gap-6">
                  <TokenCard token={featuredTokens[1]} featured />
                  <TokenCard token={featuredTokens[2]} featured />
                  <TokenCard token={featuredTokens[3]} featured />
                </div>
                {/* Left card - positioned outside container */}
                <div
                  className="absolute top-0"
                  style={{
                    right: 'calc(100% + 24px)',
                    width: 'calc((100% - 48px) / 3)'
                  }}
                >
                  <TokenCard token={featuredTokens[0]} featured />
                </div>
                {/* Right card - positioned outside container */}
                <div
                  className="absolute top-0"
                  style={{
                    left: 'calc(100% + 24px)',
                    width: 'calc((100% - 48px) / 3)'
                  }}
                >
                  <TokenCard token={featuredTokens[4]} featured />
                </div>
              </div>
            </div>
            {/* Tablet/mobile fallback */}
            <div className="lg:hidden">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {featuredTokens.map((token) => (
                    <TokenCard key={token.address} token={token} featured />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      </div>{/* End of statue clipping wrapper */}

      {/* Recent Launches */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-[#00C805] text-sm font-medium tracking-widest uppercase mb-2">Just Launched</p>
              <h2 className="text-3xl sm:text-4xl font-bold">Recent Launches</h2>
            </div>
            <Link
              href="/explore"
              className="text-sm text-white/60 hover:text-[#00C805] flex items-center gap-2 border border-white/20 hover:border-[#00C805]/50 px-4 py-2 transition-all"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentTokens.map((token) => (
              <TokenCard key={token.address} token={token} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pt-[4.5rem] pb-24 px-4 sm:px-6 lg:px-8 bg-black relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Launch?</h2>
          <p className="text-white/60 mb-8">
            Create your token presale and build a community around your project.
          </p>
          <Link href="/create" className="btn-primary inline-flex items-center gap-2">
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
                {/* Structures graphic - bottom right */}
        <img
          src="/graphics/structuresgraphics.png"
          alt=""
          className="absolute bottom-0 pointer-events-none opacity-20 md:opacity-40"
          style={{
            height: '1000px',
            width: 'auto',
            right: '-200px',
            transform: `translateY(${Math.max(0, Math.min(150, 150 - (scrollY - 800) * 0.15))}px)`,
            transition: 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
            maskImage: 'linear-gradient(to right, transparent 0%, black 70%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 70%, black 100%)',
          }}
        />
      </section>
    </div>
  );
}
