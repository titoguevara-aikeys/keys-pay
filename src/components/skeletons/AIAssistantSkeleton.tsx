// Simple loading placeholder for lazy-loaded AI Assistant tabs
import React from 'react';

export function AIAssistantSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-48 rounded bg-muted" />
      <div className="h-40 w-full rounded bg-muted" />
      <div className="grid grid-cols-3 gap-4">
        <div className="h-24 rounded bg-muted" />
        <div className="h-24 rounded bg-muted" />
        <div className="h-24 rounded bg-muted" />
      </div>
    </div>
  );
}

export default AIAssistantSkeleton;
