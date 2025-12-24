import { useEffect, useRef } from 'react';

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle network
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }

    const particles: Particle[] = [];
    const particleCount = 80;
    const maxDistance = 150;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      });
    }

    // Matrix falling code
    const matrixChars = '01';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * canvas.height;
    }

    // Hexagonal grid
    const hexSize = 40;
    const hexagons: { x: number; y: number; opacity: number }[] = [];
    for (let y = 0; y < canvas.height + hexSize; y += hexSize * 1.5) {
      for (let x = 0; x < canvas.width + hexSize; x += hexSize * Math.sqrt(3)) {
        hexagons.push({
          x: x + (y % (hexSize * 3) === 0 ? hexSize * Math.sqrt(3) / 2 : 0),
          y,
          opacity: Math.random() * 0.1,
        });
      }
    }

    // Animation loop
    let animationFrame: number;
    let frame = 0;

    const animate = () => {
      frame++;
      
      // Fade effect
      ctx.fillStyle = 'rgba(2, 6, 23, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw hexagonal grid (every 3 frames for performance)
      if (frame % 3 === 0) {
        hexagons.forEach((hex) => {
          ctx.strokeStyle = `rgba(14, 165, 233, ${hex.opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = hex.x + hexSize * Math.cos(angle);
            const y = hex.y + hexSize * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();

          // Pulse effect
          hex.opacity = Math.abs(Math.sin(frame * 0.001 + hex.x * 0.01)) * 0.15;
        });
      }

      // Draw matrix falling code
      if (frame % 2 === 0) {
        ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
        ctx.font = `${fontSize}px monospace`;
        for (let i = 0; i < drops.length; i++) {
          const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
          ctx.fillText(char, i * fontSize, drops[i]);
          
          if (drops[i] > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i] += fontSize;
        }
      }

      // Update particles
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.fillStyle = 'rgba(139, 92, 246, 0.6)';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.3;
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ background: 'linear-gradient(to bottom, #020617, #0f172a)' }}
    />
  );
}
