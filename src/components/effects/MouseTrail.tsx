import React, { useEffect, useRef } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

interface MouseTrailProps {
  maxTrailLength?: number;
  trailColor?: string;
  trailWidth?: number;
  fadeSpeed?: number;
  className?: string;
}

export function MouseTrail({ 
  maxTrailLength = 20,
  trailColor = '#60a5fa',
  trailWidth = 2,
  fadeSpeed = 0.1,
  className = ''
}: MouseTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<TrailPoint[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const addTrailPoint = (x: number, y: number) => {
      trailRef.current.unshift({ x, y, age: 0 });
      if (trailRef.current.length > maxTrailLength) {
        trailRef.current.pop();
      }
    };

    const updateTrail = () => {
      trailRef.current.forEach(point => {
        point.age += fadeSpeed;
      });
      trailRef.current = trailRef.current.filter(point => point.age < 1);
    };

    const drawTrail = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (trailRef.current.length < 2) return;

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = 0; i < trailRef.current.length - 1; i++) {
        const point = trailRef.current[i];
        const nextPoint = trailRef.current[i + 1];
        
        const opacity = (1 - point.age) * 0.8;
        const width = trailWidth * (1 - point.age);
        
        if (opacity <= 0 || width <= 0) continue;

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.strokeStyle = trailColor;
        ctx.lineWidth = width;
        
        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = trailColor;
        
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(nextPoint.x, nextPoint.y);
        ctx.stroke();
        ctx.restore();
      }
    };

    const animate = () => {
      updateTrail();
      drawTrail();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      addTrailPoint(e.clientX, e.clientY);
    };

    const handleResize = () => {
      resizeCanvas();
    };

    // Initialize
    resizeCanvas();
    animate();

    // Event listeners
    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [maxTrailLength, trailColor, trailWidth, fadeSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 pointer-events-none z-50 ${className}`}
    />
  );
}