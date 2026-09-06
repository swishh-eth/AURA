'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  AlertCircle,
  Loader2,
  Info,
} from 'lucide-react';
import { useTokenFactory } from '@/hooks/useTokenFactory';
import { CreateTokenForm } from '@/types';
import { formatETH, cn } from '@/lib/utils';

const STEPS = [
  { id: 1, title: 'Token Details' },
  { id: 2, title: 'Presale Settings' },
  { id: 3, title: 'Tokenomics' },
  { id: 4, title: 'Review' },
];

const initialForm: CreateTokenForm = {
  name: '',
  symbol: '',
  description: '',
  image: '',
  targetETH: '',
  duration: 7,
  maxPerWallet: '',
  totalSupply: '1000000',
  presalePercent: 40,
  lpPercent: 30,
};

export default function CreatePage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { createToken, isLoading, launchFee } = useTokenFactory();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CreateTokenForm>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateTokenForm, string>>>({});

  const updateForm = (field: keyof CreateTokenForm, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Partial<Record<keyof CreateTokenForm, string>> = {};

    if (stepNumber === 1) {
      if (!form.name.trim()) newErrors.name = 'Token name is required';
      if (!form.symbol.trim()) newErrors.symbol = 'Symbol is required';
      if (form.symbol.length > 10) newErrors.symbol = 'Symbol must be 10 characters or less';
      if (!form.description.trim()) newErrors.description = 'Description is required';
    }

    if (stepNumber === 2) {
      if (!form.targetETH || parseFloat(form.targetETH) <= 0) {
        newErrors.targetETH = 'Target ETH must be greater than 0';
      }
      if (form.duration < 1 || form.duration > 30) {
        newErrors.duration = 'Duration must be between 1 and 30 days' as any;
      }
    }

    if (stepNumber === 3) {
      if (!form.totalSupply || parseFloat(form.totalSupply) <= 0) {
        newErrors.totalSupply = 'Total supply must be greater than 0';
      }
      if (form.presalePercent + form.lpPercent > 100) {
        newErrors.presalePercent = 'Presale + LP cannot exceed 100%';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!isConnected) {
      alert('Please connect your wallet');
      return;
    }

    try {
      const address = await createToken(form);
      router.push(`/token/${address}`);
    } catch (error) {
      console.error('Failed to create token:', error);
    }
  };

  const teamPercent = 100 - form.presalePercent - form.lpPercent;

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
              Create Token
            </h1>
          </div>
        </div>
      </div>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div
                className={cn(
                  'flex items-center gap-2 px-4 py-2 border whitespace-nowrap',
                  step === s.id
                    ? 'bg-white text-black border-white'
                    : step > s.id
                    ? 'bg-white/10 text-white border-white/20'
                    : 'bg-transparent text-white/40 border-white/10'
                )}
              >
                {step > s.id ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-sm">{s.id}</span>
                )}
                <span className="text-sm font-medium">{s.title}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="w-8 h-px bg-white/10 mx-1" />
              )}
            </div>
          ))}
        </div>

        <div className="card mb-6">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Token Details</h2>

              <div>
                <label className="label">Token Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  placeholder="e.g., Aurora Protocol"
                  className={cn('input w-full', errors.name && 'border-red-400')}
                />
                {errors.name && (
                  <p className="text-sm text-red-400 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="label">Symbol</label>
                <input
                  type="text"
                  value={form.symbol}
                  onChange={(e) => updateForm('symbol', e.target.value.toUpperCase())}
                  placeholder="e.g., AURORA"
                  maxLength={10}
                  className={cn('input w-full', errors.symbol && 'border-red-400')}
                />
                {errors.symbol && (
                  <p className="text-sm text-red-400 mt-1">{errors.symbol}</p>
                )}
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateForm('description', e.target.value)}
                  placeholder="Describe your project..."
                  rows={4}
                  className={cn(
                    'input w-full resize-none',
                    errors.description && 'border-red-400'
                  )}
                />
                {errors.description && (
                  <p className="text-sm text-red-400 mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="label">Image URL (optional)</label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => updateForm('image', e.target.value)}
                  placeholder="https://..."
                  className="input w-full"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Presale Settings</h2>

              <div>
                <label className="label">Target ETH</label>
                <input
                  type="number"
                  value={form.targetETH}
                  onChange={(e) => updateForm('targetETH', e.target.value)}
                  placeholder="e.g., 50"
                  min="0"
                  step="0.1"
                  className={cn('input w-full', errors.targetETH && 'border-red-400')}
                />
                {errors.targetETH && (
                  <p className="text-sm text-red-400 mt-1">{errors.targetETH}</p>
                )}
              </div>

              <div>
                <label className="label">Duration (days)</label>
                <input
                  type="number"
                  value={form.duration}
                  onChange={(e) => updateForm('duration', parseInt(e.target.value) || 7)}
                  min="1"
                  max="30"
                  className="input w-full"
                />
                <p className="text-xs text-white/40 mt-1">
                  Presale will run for {form.duration} day{form.duration !== 1 && 's'}
                </p>
              </div>

              <div>
                <label className="label">Max per Wallet (ETH, optional)</label>
                <input
                  type="number"
                  value={form.maxPerWallet}
                  onChange={(e) => updateForm('maxPerWallet', e.target.value)}
                  placeholder="Leave empty for no limit"
                  min="0"
                  step="0.1"
                  className="input w-full"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Tokenomics</h2>

              <div>
                <label className="label">Total Supply</label>
                <input
                  type="number"
                  value={form.totalSupply}
                  onChange={(e) => updateForm('totalSupply', e.target.value)}
                  placeholder="e.g., 1000000"
                  min="1"
                  className={cn('input w-full', errors.totalSupply && 'border-red-400')}
                />
                {errors.totalSupply && (
                  <p className="text-sm text-red-400 mt-1">{errors.totalSupply}</p>
                )}
              </div>

              <div>
                <label className="label">Presale Allocation (%)</label>
                <input
                  type="range"
                  value={form.presalePercent}
                  onChange={(e) => updateForm('presalePercent', parseInt(e.target.value))}
                  min="10"
                  max="80"
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-white/60 mt-1">
                  <span>10%</span>
                  <span className="font-medium text-white">{form.presalePercent}%</span>
                  <span>80%</span>
                </div>
              </div>

              <div>
                <label className="label">Liquidity Pool (%)</label>
                <input
                  type="range"
                  value={form.lpPercent}
                  onChange={(e) => updateForm('lpPercent', parseInt(e.target.value))}
                  min="10"
                  max="60"
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-white/60 mt-1">
                  <span>10%</span>
                  <span className="font-medium text-white">{form.lpPercent}%</span>
                  <span>60%</span>
                </div>
              </div>

              <div className="bg-white/5 p-4 border border-white/10">
                <h4 className="text-sm font-medium mb-3">Token Distribution</h4>
                <div className="h-4 flex overflow-hidden mb-3">
                  <div
                    className="bg-blue-400"
                    style={{ width: `${form.presalePercent}%` }}
                  />
                  <div
                    className="bg-green-400"
                    style={{ width: `${form.lpPercent}%` }}
                  />
                  <div className="bg-white/20" style={{ width: `${teamPercent}%` }} />
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400" />
                    <span>Presale: {form.presalePercent}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400" />
                    <span>Liquidity: {form.lpPercent}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-white/20" />
                    <span>Team/Other: {teamPercent}%</span>
                  </div>
                </div>
              </div>

              {errors.presalePercent && (
                <p className="text-sm text-red-400">{errors.presalePercent}</p>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Review & Submit</h2>

              <div className="space-y-4">
                <div className="bg-white/5 p-4 border border-white/10">
                  <h4 className="text-sm font-medium text-white/60 mb-3">
                    Token Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/60">Name</span>
                      <span>{form.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Symbol</span>
                      <span>${form.symbol}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 p-4 border border-white/10">
                  <h4 className="text-sm font-medium text-white/60 mb-3">
                    Presale Settings
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/60">Target</span>
                      <span>{form.targetETH} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Duration</span>
                      <span>{form.duration} days</span>
                    </div>
                    {form.maxPerWallet && (
                      <div className="flex justify-between">
                        <span className="text-white/60">Max per Wallet</span>
                        <span>{form.maxPerWallet} ETH</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white/5 p-4 border border-white/10">
                  <h4 className="text-sm font-medium text-white/60 mb-3">
                    Tokenomics
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/60">Total Supply</span>
                      <span>{parseInt(form.totalSupply).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Presale</span>
                      <span>{form.presalePercent}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Liquidity</span>
                      <span>{form.lpPercent}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-blue-400/10 border border-blue-400/30 p-4">
                  <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-blue-400 font-medium">Launch Fee</p>
                    <p className="text-white/60">
                      {formatETH(launchFee)} ETH will be charged to create this token
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="btn-secondary flex items-center gap-2 disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {step < 4 ? (
            <button onClick={handleNext} className="btn-primary flex items-center gap-2">
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isConnected || isLoading}
              className="btn-primary flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : !isConnected ? (
                'Connect Wallet'
              ) : (
                <>
                  Launch Token
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
