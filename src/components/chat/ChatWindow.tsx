'use client';

import { useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType } from '@/types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { MessageSquare } from 'lucide-react';

interface ChatWindowProps {
  messages: ChatMessageType[];
  creatorAddress?: string;
  onSendMessage: (message: string) => Promise<void>;
  disabled?: boolean;
}

export function ChatWindow({
  messages,
  creatorAddress,
  onSendMessage,
  disabled,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="card p-0 flex flex-col h-[500px]">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          <h3 className="font-semibold">Community Chat</h3>
          <span className="text-sm text-white/40 ml-auto">
            {messages.length} messages
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/40">
            <MessageSquare className="w-8 h-8 mb-2" />
            <p>No messages yet</p>
            <p className="text-sm">Be the first to say something!</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isCreator={
                  creatorAddress?.toLowerCase() === message.sender.toLowerCase()
                }
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <ChatInput onSend={onSendMessage} disabled={disabled} />
    </div>
  );
}
