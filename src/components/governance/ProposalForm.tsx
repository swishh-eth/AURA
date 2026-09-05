'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Loader2, AlertCircle, Plus, X } from 'lucide-react';

interface ProposalFormProps {
  onSubmit: (title: string, description: string) => Promise<void>;
  onCancel?: () => void;
}

export function ProposalForm({ onSubmit, onCancel }: ProposalFormProps) {
  const { isConnected } = useAccount();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    if (title.length > 100) {
      setError('Title must be 100 characters or less');
      return;
    }

    if (description.length > 1000) {
      setError('Description must be 1000 characters or less');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(title.trim(), description.trim());
      setTitle('');
      setDescription('');
      onCancel?.();
    } catch (err) {
      setError('Failed to create proposal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="card">
        <p className="text-center text-white/60">
          Connect your wallet to create a proposal
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Create Proposal</h3>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="label">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter proposal title"
            disabled={isLoading}
            className="input w-full"
            maxLength={100}
          />
          <p className="text-xs text-white/40 mt-1">{title.length}/100</p>
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your proposal in detail"
            disabled={isLoading}
            className="input w-full min-h-[120px] resize-none"
            maxLength={1000}
          />
          <p className="text-xs text-white/40 mt-1">{description.length}/1000</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || !title.trim() || !description.trim()}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Create Proposal
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
