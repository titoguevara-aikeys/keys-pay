import React from 'react';
import { FixedSizeList as List } from 'react-window';

interface VirtualizedListProps<T> {
  items: T[];
  height: number;
  itemSize: number;
  renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
  className?: string;
}

export function VirtualizedList<T>({ 
  items, 
  height, 
  itemSize, 
  renderItem, 
  className 
}: VirtualizedListProps<T>) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      {renderItem(items[index], index, style)}
    </div>
  );

  if (items.length === 0) {
    return (
      <div className={`flex items-center justify-center text-muted-foreground ${className}`} style={{ height }}>
        No items to display
      </div>
    );
  }

  return (
    <List
      className={className}
      height={height}
      itemCount={items.length}
      itemSize={itemSize}
      width="100%"
    >
      {Row}
    </List>
  );
}