'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  MessageSquare,
  Users,
  Vote,
  Info,
} from 'lucide-react';
import { TokenStats } from '@/components/token/TokenStats';
import { ContributeForm } from '@/components/token/ContributeForm';
import { ParticipantsList } from '@/components/token/ParticipantsList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { ProposalCard } from '@/components/governance/ProposalCard';
import { ProposalForm } from '@/components/governance/ProposalForm';
import { usePresale } from '@/hooks/usePresale';
import { useChat } from '@/hooks/useChat';
import { useGovernance } from '@/hooks/useGovernance';
import { truncateAddress, cn } from '@/lib/utils';

type Tab = 'overview' | 'chat' | 'participants' | 'governance';

export default function TokenDetailPage() {
  const params = useParams();
  const address = params.address as string;

  const { token, participants, userContribution, contribute } = usePresale(address);
  const { messages, sendMessage } = useChat(address);
  const { proposals, createProposal, vote } = useGovernance(address);

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [copied, setCopied] = useState(false);
  const [showProposalForm, setShowProposalForm] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Token Not Found</h1>
          <p className="text-white/60 mb-4">
            The token you are looking for does not exist.
          </p>
          <Link href="/explore" className="btn-primary">
            Browse Tokens
          </Link>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Info className="w-4 h-4" /> },
    { id: 'chat', label: 'Chat', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'participants', label: 'Participants', icon: <Users className="w-4 h-4" /> },
    { id: 'governance', label: 'Governance', icon: <Vote className="w-4 h-4" /> },
  ];

  const teamPercent = 100 - token.presalePercent - token.lpPercent;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Explore
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="card mb-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  {token.symbol.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold mb-1">{token.name}</h1>
                  <p className="text-white/60 mb-2">${token.symbol}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-white/40">
                      {truncateAddress(address, 8)}
                    </span>
                    <button
                      onClick={copyAddress}
                      className="text-white/40 hover:text-white"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <a
                      href={`https://explorer.mainnet.chain.robinhood.com/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/40 hover:text-white"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
                <span>Created by</span>
                <span className="font-mono">{truncateAddress(token.creator)}</span>
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
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">About</h3>
                  <p className="text-white/80 whitespace-pre-wrap">
                    {token.description}
                  </p>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Tokenomics</h3>
                  <div className="h-4 flex overflow-hidden mb-4">
                    <div
                      className="bg-blue-400"
                      style={{ width: `${token.presalePercent}%` }}
                    />
                    <div
                      className="bg-green-400"
                      style={{ width: `${token.lpPercent}%` }}
                    />
                    <div
                      className="bg-white/20"
                      style={{ width: `${teamPercent}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-400" />
                      <span className="text-white/60">Presale:</span>
                      <span>{token.presalePercent}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400" />
                      <span className="text-white/60">LP:</span>
                      <span>{token.lpPercent}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-white/20" />
                      <span className="text-white/60">Other:</span>
                      <span>{teamPercent}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <ChatWindow
                messages={messages}
                creatorAddress={token.creator}
                onSendMessage={sendMessage}
              />
            )}

            {activeTab === 'participants' && (
              <ParticipantsList
                participants={participants}
                totalRaised={token.raisedETH}
              />
            )}

            {activeTab === 'governance' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Proposals</h3>
                  {!showProposalForm && (
                    <button
                      onClick={() => setShowProposalForm(true)}
                      className="btn-secondary text-sm"
                    >
                      Create Proposal
                    </button>
                  )}
                </div>

                {showProposalForm && (
                  <ProposalForm
                    onSubmit={async (title, description) => {
                      await createProposal(title, description);
                    }}
                    onCancel={() => setShowProposalForm(false)}
                  />
                )}

                {proposals.length === 0 ? (
                  <div className="card text-center py-12">
                    <Vote className="w-12 h-12 mx-auto text-white/40 mb-4" />
                    <h4 className="font-semibold mb-2">No Proposals Yet</h4>
                    <p className="text-white/60 text-sm">
                      Create the first proposal for this community
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {proposals.map((proposal) => (
                      <ProposalCard
                        key={proposal.id.toString()}
                        proposal={proposal}
                        onVote={vote}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:w-96 space-y-6">
            <TokenStats
              token={token}
              userContribution={userContribution}
              participantsCount={participants.length}
            />
            <ContributeForm token={token} onContribute={contribute} />
          </div>
        </div>
      </div>
    </div>
  );
}
