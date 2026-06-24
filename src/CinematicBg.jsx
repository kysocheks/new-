import { useEffect, useRef, useState } from 'react';

export default function CinematicBg() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, hasMoved: false });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let w, h;
    let time = 0;

    const particleCount = isMobile ? 0 : 60;
    const particles = [];
    const satellites = [];
    const pulseWaves = [];

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const onMouse = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.hasMoved = true;
    };
    window.addEventListener('mousemove', onMouse);

    for (let i = 0; i < particleCount; i++) {
      const isGreen = Math.random() < 0.4;
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.8 + 0.3,
        color: isGreen ? 'rgba(0, 255, 136, 0.25)' : 'rgba(255, 255, 255, 0.18)',
        glowColor: isGreen ? 'rgba(0, 255, 136, 0.08)' : 'rgba(255, 255, 255, 0.04)',
        parallax: Math.random() * 20 + 5,
        phase: Math.random() * Math.PI * 2,
      });
    }

    if (!isMobile) {
      for (let i = 0; i < 4; i++) {
        satellites.push({
          angle: Math.random() * Math.PI * 2,
          radius: Math.random() * Math.min(w, h) * 0.35 + 100,
          speed: (Math.random() * 0.0003 + 0.0001) * (Math.random() < 0.5 ? 1 : -1),
          length: Math.random() * 0.4 + 0.2,
          alpha: Math.random() * 0.08 + 0.03,
          width: Math.random() * 0.8 + 0.3,
        });
      }
    }

    function spawnPulse() {
      if (pulseWaves.length > 2) return;
      pulseWaves.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0,
        maxR: Math.random() * 250 + 150,
        alpha: 0.15,
        speed: Math.random() * 1.5 + 1,
      });
    }

    let pulseTimer = 0;

    function draw() {
      ctx.clearRect(0, 0, w, h);

      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
      grad.addColorStop(0, '#0a0e1a');
      grad.addColorStop(1, '#05080f');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      satellites.forEach((s) => {
        s.angle += s.speed;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, s.radius, s.angle, s.angle + Math.PI * 2 * s.length);
        ctx.strokeStyle = `rgba(0, 255, 136, ${s.alpha})`;
        ctx.lineWidth = s.width;
        ctx.stroke();

        const headX = w / 2 + s.radius * Math.cos(s.angle + Math.PI * 2 * s.length);
        const headY = h / 2 + s.radius * Math.sin(s.angle + Math.PI * 2 * s.length);
        ctx.beginPath();
        ctx.arc(headX, headY, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 136, ${s.alpha * 3})`;
        ctx.fill();
      });

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mouseActive = mouseRef.current.hasMoved;

      particles.forEach((p) => {
        p.x += p.vx + Math.sin(time * 0.0005 + p.phase) * 0.1;
        p.y += p.vy + Math.cos(time * 0.0004 + p.phase) * 0.08;

        if (mouseActive) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 0) {
            const force = (1 - dist / 120) * 0.8;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        const pxOffset = mouseActive ? (mx - w / 2) * p.parallax / w : 0;
        const pyOffset = mouseActive ? (my - h / 2) * p.parallax / h : 0;
        const drawX = p.x + pxOffset;
        const drawY = p.y + pyOffset;

        ctx.beginPath();
        ctx.arc(drawX, drawY, p.r * 4, 0, Math.PI * 2);
        const glow = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, p.r * 4);
        glow.addColorStop(0, p.glowColor);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(drawX, drawY, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      if (!isMobile) {
        pulseTimer++;
        if (pulseTimer > 150) {
          spawnPulse();
          pulseTimer = 0;
        }
      }

      for (let i = pulseWaves.length - 1; i >= 0; i--) {
        const pw = pulseWaves[i];
        pw.r += pw.speed;
        pw.alpha = 0.15 * (1 - pw.r / pw.maxR);
        if (pw.r >= pw.maxR) { pulseWaves.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(pw.x, pw.y, pw.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 255, 136, ${pw.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      time++;
      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div className="css-pulse-container" aria-hidden="true">
        <div className="css-pulse css-pulse-1" />
        <div className="css-pulse css-pulse-2" />
        <div className="css-pulse css-pulse-3" />
      </div>
    </>
  );
}
