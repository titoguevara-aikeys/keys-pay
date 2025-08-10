import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface QuickActionButtonProps {
  icon: LucideIcon;
  label: string;
  prompt: string;
  onClick: (prompt: string) => void;
  disabled?: boolean;
}

function QuickActionButton({ icon: Icon, label, prompt, onClick, disabled }: QuickActionButtonProps) {
  return (
    <Button
      variant="outline"
      className="h-auto p-4 flex flex-col items-center gap-2 text-center"
      onClick={() => onClick(prompt)}
      disabled={disabled}
    >
      <Icon className="h-6 w-6 text-primary" />
      <span className="text-sm font-medium">{label}</span>
    </Button>
  );
}

export default React.memo(QuickActionButton);