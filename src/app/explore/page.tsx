'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, SortDesc } from 'lucide-react';
import { TokenCard } from '@/components/token/TokenCard';
import { useTokenFactory } from '@/hooks/useTokenFactory';
import { Token } from '@/types';
import { cn } from '@/lib/utils';

type StatusFilter = 'all' | 'active' | 'upcoming' | 'funded' | 'live';
type SortOption = 'recent' | 'ending' | 'raised' | 'progress';

export default function ExplorePage() {
  const { getAllTokens } = useTokenFactory();
  const allTokens = getAllTokens();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  const filteredTokens = useMemo(() => {
    let tokens = [...allTokens];

    if (search) {
      const searchLower = search.toLowerCase();
      tokens = tokens.filter(
        (t) =>
          t.name.toLowerCase().includes(searchLower) ||
          t.symbol.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower)
      );
    }

    if (statusFilter !== 'all') {
      tokens = tokens.filter((t) => t.status === statusFilter);
    }

    switch (sortBy) {
      case 'recent':
        tokens.sort((a, b) => b.startTime - a.startTime);
        break;
      case 'ending':
        tokens.sort((a, b) => a.endTime - b.endTime);
        break;
      case 'raised':
        tokens.sort((a, b) => Number(b.raisedETH - a.raisedETH));
        break;
      case 'progress':
        tokens.sort((a, b) => {
          const progressA = Number((a.raisedETH * BigInt(100)) / a.targetETH);
          const progressB = Number((b.raisedETH * BigInt(100)) / b.targetETH);
          return progressB - progressA;
        });
        break;
    }

    return tokens;
  }, [allTokens, search, statusFilter, sortBy]);

  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'funded', label: 'Funded' },
    { value: 'live', label: 'Live' },
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'ending', label: 'Ending Soon' },
    { value: 'raised', label: 'Most Raised' },
    { value: 'progress', label: 'Most Progress' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Header - extends behind transparent nav */}
      <div
        className="relative overflow-hidden"
        style={{ marginTop: '-8rem', paddingTop: '8rem' }}
      >
        {/* Cloud background */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-20px',
            left: '-20px',
            right: '-20px',
            height: '100vh',
            backgroundImage: 'url(/graphics/cloudsbackground.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            opacity: 0.3,
          }}
        />
        {/* Radial gradient overlay to darken clouds toward center - same as home screen */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-20px',
            left: '-20px',
            right: '-20px',
            height: '100vh',
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 80%)'
          }}
        />
        {/* Fade to black at bottom */}
        <div
          className="absolute left-0 right-0 bottom-0 h-32 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 100%)'
          }}
        />

        <div className="pt-4 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#00C805]">
              Explore Presales
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tokens..."
              className="input w-full pl-12"
            />
          </div>

          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="input pl-10 pr-8 appearance-none cursor-pointer"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <SortDesc className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="input pl-10 pr-8 appearance-none cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={cn(
                'px-4 py-2 text-sm border transition-colors',
                statusFilter === option.value
                  ? 'bg-[#00C805] text-black border-[#00C805]'
                  : 'bg-transparent text-white/60 border-white/20 hover:border-[#00C805]/50 hover:text-white'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {filteredTokens.length === 0 ? (
          <div className="card text-center py-16">
            <p className="text-white/60 mb-2">No tokens found</p>
            <p className="text-sm text-white/40">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-white/40 mb-4">
              {filteredTokens.length} token{filteredTokens.length !== 1 && 's'} found
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTokens.map((token) => (
                <TokenCard key={token.address} token={token} />
              ))}
            </div>
          </>
        )}
      </div>
      </div>
    </div>
  );
}
