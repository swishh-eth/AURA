'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Send, AlertCircle, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const { isConnected } = useAccount();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading || !isConnected) return;

    setIsLoading(true);
    try {
      await onSend(message.trim());
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-4 border-t border-white/10">
        <p className="text-sm text-white/40 text-center">
          Connect your wallet to send messages
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
      <div className="flex items-center gap-2 text-xs text-white/40 mb-2">
        <AlertCircle className="w-3 h-3" />
        <span>Messages are stored on-chain and require gas</span>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={isLoading || disabled}
          className="input flex-1"
          maxLength={280}
        />
        <button
          type="submit"
          disabled={!message.trim() || isLoading || disabled}
          className="btn-primary px-4"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </form>
  );
}
