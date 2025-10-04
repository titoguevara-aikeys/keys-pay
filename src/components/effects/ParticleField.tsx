import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  life: number;
  maxLife: number;
}

interface ParticleFieldProps {
  particleCount?: number;
  className?: string;
  color?: string;
  interactive?: boolean;
}

export default function ParticleField({ 
  particleCount = 15, 
  className = '',
  interactive = false
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = [
      'rgba(59, 130, 246, 0.6)',   // blue
      'rgba(139, 92, 246, 0.6)',   // purple
      'rgba(236, 72, 153, 0.6)',   // pink
      'rgba(251, 146, 60, 0.6)',   // orange
      'rgba(34, 197, 94, 0.6)',    // green
      'rgba(6, 182, 212, 0.6)',    // cyan
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 40 + 20, // 20-60px
      opacity: Math.random() * 0.3 + 0.1, // 0.1-0.4
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2, // -1 to 1 degrees per frame
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: Math.random() * 500 + 500, // 500-1000 frames
    });

    const initParticles = () => {
      particlesRef.current = Array.from({ length: particleCount }, createParticle);
    };

    const updateParticles = () => {
      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;
        particle.life++;

        if (interactive && mouseRef.current) {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const force = (150 - distance) / 150;
            particle.vx -= (dx / distance) * force * 0.1;
            particle.vy -= (dy / distance) * force * 0.1;
          }
        }

        // Fade in and out
        if (particle.life < 100) {
          particle.opacity = (particle.life / 100) * 0.3;
        } else if (particle.life > particle.maxLife - 100) {
          particle.opacity = ((particle.maxLife - particle.life) / 100) * 0.3;
        }

        // Respawn if out of bounds or life expired
        if (
          particle.x < -100 ||
          particle.x > canvas.width + 100 ||
          particle.y < -100 ||
          particle.y > canvas.height + 100 ||
          particle.life >= particle.maxLife
        ) {
          Object.assign(particle, createParticle());
        }

        // Damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate((particle.rotation * Math.PI) / 180);
        ctx.globalAlpha = particle.opacity;

        // Draw logo as colored shape (simplified Keys logo)
        const size = particle.size;
        ctx.fillStyle = particle.color;
        
        // Keys logo simplified geometric shape
        ctx.beginPath();
        ctx.moveTo(-size/3, -size/3);
        ctx.lineTo(size/3, -size/3);
        ctx.lineTo(size/3, 0);
        ctx.lineTo(size/6, 0);
        ctx.lineTo(size/6, size/3);
        ctx.lineTo(-size/6, size/3);
        ctx.lineTo(-size/6, size/6);
        ctx.lineTo(-size/3, size/6);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    resizeCanvas();
    initParticles();
    animate();

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    window.addEventListener('resize', resizeCanvas);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [particleCount, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}