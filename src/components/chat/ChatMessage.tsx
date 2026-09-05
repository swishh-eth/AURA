import { ChatMessage as ChatMessageType } from '@/types';
import { truncateAddress, formatTimestamp } from '@/lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
  isCreator?: boolean;
}

export function ChatMessage({ message, isCreator }: ChatMessageProps) {
  return (
    <div className="flex gap-3 py-3 border-b border-white/5 last:border-b-0">
      <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
        {message.sender.slice(2, 4).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-sm">
            {truncateAddress(message.sender)}
          </span>
          {isCreator && (
            <span className="text-xs bg-white/10 px-2 py-0.5 text-white/60">
              Creator
            </span>
          )}
          <span className="text-xs text-white/40">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
        <p className="text-sm text-white/80 break-words">{message.content}</p>
      </div>
    </div>
  );
}
