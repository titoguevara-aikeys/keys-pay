import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

interface EnhancedMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  audioUrl?: string;
  isPlaying?: boolean;
}

interface ChatMessageProps {
  message: EnhancedMessage;
  onPlayAudio: (messageId: string, audioUrl: string) => void;
}

function ChatMessage({ message, onPlayAudio }: ChatMessageProps) {
  return (
    <div
      className={`flex ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-[80%] p-3 rounded-lg ${
          message.role === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs opacity-70">
            {new Date(message.timestamp).toLocaleTimeString()}
          </p>
          {message.audioUrl && message.role === 'assistant' && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onPlayAudio(message.id, message.audioUrl!)}
              disabled={message.isPlaying}
            >
              {message.isPlaying ? (
                <Pause className="h-3 w-3" />
              ) : (
                <Play className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(ChatMessage);