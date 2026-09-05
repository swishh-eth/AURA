'use client';

import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { getTokenMessages } from '@/mocks/data';
import { ChatMessage } from '@/types';

export function useChat(tokenAddress: string) {
  const { address: userAddress } = useAccount();
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    getTokenMessages(tokenAddress)
  );
  const [isSending, setIsSending] = useState(false);

  const sendMessage = useCallback(
    async (content: string): Promise<void> => {
      if (!userAddress || !content.trim()) return;

      setIsSending(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const newMessage: ChatMessage = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          tokenAddress,
          sender: userAddress,
          content: content.trim(),
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, newMessage]);
        console.log('Message sent:', content);
      } finally {
        setIsSending(false);
      }
    },
    [tokenAddress, userAddress]
  );

  const refreshMessages = useCallback(() => {
    setMessages(getTokenMessages(tokenAddress));
  }, [tokenAddress]);

  return {
    messages,
    sendMessage,
    refreshMessages,
    isSending,
  };
}
