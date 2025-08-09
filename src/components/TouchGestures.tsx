import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface TouchGesturesProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  className?: string;
  disabled?: boolean;
}

interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

const TouchGestures: React.FC<TouchGesturesProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinch,
  onDoubleTap,
  onLongPress,
  className = '',
  disabled = false,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<TouchPoint | null>(null);
  const [lastTap, setLastTap] = useState<number>(0);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isLongPress, setIsLongPress] = useState(false);
  const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null);
  const { toast } = useToast();

  const SWIPE_THRESHOLD = 50; // Minimum distance for swipe
  const SWIPE_TIME_THRESHOLD = 500; // Maximum time for swipe
  const DOUBLE_TAP_DELAY = 300; // Maximum delay between taps
  const LONG_PRESS_DELAY = 500; // Delay for long press

  const getDistance = (touch1: React.Touch, touch2: React.Touch): number => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;

    const touch = e.touches[0];
    const now = Date.now();

    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      timestamp: now,
    });

    setIsLongPress(false);

    // Handle pinch gesture
    if (e.touches.length === 2 && onPinch) {
      const distance = getDistance(e.touches[0], e.touches[1]);
      setInitialPinchDistance(distance);
    }

    // Handle long press
    if (onLongPress) {
      const timer = setTimeout(() => {
        setIsLongPress(true);
        onLongPress();
        // Haptic feedback if available
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      }, LONG_PRESS_DELAY);
      setLongPressTimer(timer);
    }

    // Handle double tap
    if (onDoubleTap) {
      const timeSinceLastTap = now - lastTap;
      if (timeSinceLastTap < DOUBLE_TAP_DELAY && timeSinceLastTap > 0) {
        onDoubleTap();
        // Clear the timer to prevent long press
        if (longPressTimer) {
          clearTimeout(longPressTimer);
          setLongPressTimer(null);
        }
      }
      setLastTap(now);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || !touchStart) return;

    // Handle pinch gesture
    if (e.touches.length === 2 && onPinch && initialPinchDistance) {
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const scale = currentDistance / initialPinchDistance;
      onPinch(scale);
    }

    // Cancel long press if finger moves too much
    if (longPressTimer) {
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - touchStart.x);
      const deltaY = Math.abs(touch.clientY - touchStart.y);
      
      if (deltaX > 10 || deltaY > 10) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (disabled || !touchStart || isLongPress) {
      // Clear timers
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }
      setIsLongPress(false);
      return;
    }

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const deltaTime = Date.now() - touchStart.timestamp;

    // Clear long press timer
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    // Reset pinch state
    setInitialPinchDistance(null);

    // Check if it's a valid swipe
    if (deltaTime < SWIPE_TIME_THRESHOLD) {
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (absDeltaX > SWIPE_THRESHOLD || absDeltaY > SWIPE_THRESHOLD) {
        // Determine swipe direction
        if (absDeltaX > absDeltaY) {
          // Horizontal swipe
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight();
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft();
          }
        } else {
          // Vertical swipe
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown();
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp();
          }
        }
      }
    }

    setTouchStart(null);
  };

  // Prevent context menu on long press for better UX
  const handleContextMenu = (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
  };

  useEffect(() => {
    // Cleanup timer on unmount
    return () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
    };
  }, [longPressTimer]);

  return (
    <div
      ref={elementRef}
      className={`touch-none select-none ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onContextMenu={handleContextMenu}
      style={{
        touchAction: 'manipulation', // Disable double-tap zoom
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
    >
      {children}
    </div>
  );
};

// Hook for easier gesture integration
export const useSwipeGestures = () => {
  const { toast } = useToast();
  
  return {
    createSwipeHandlers: (handlers: {
      onSwipeLeft?: () => void;
      onSwipeRight?: () => void;
      onSwipeUp?: () => void;
      onSwipeDown?: () => void;
    }) => ({
      onSwipeLeft: handlers.onSwipeLeft || (() => toast({ title: 'Swipe Left', description: 'Swipe left gesture detected!' })),
      onSwipeRight: handlers.onSwipeRight || (() => toast({ title: 'Swipe Right', description: 'Swipe right gesture detected!' })),
      onSwipeUp: handlers.onSwipeUp || (() => toast({ title: 'Swipe Up', description: 'Swipe up gesture detected!' })),
      onSwipeDown: handlers.onSwipeDown || (() => toast({ title: 'Swipe Down', description: 'Swipe down gesture detected!' })),
    }),
  };
};

export default TouchGestures;