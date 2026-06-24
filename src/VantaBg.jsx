import { useEffect, useRef, useState } from 'react';

export default function VantaBg() {
  const containerRef = useRef(null);
  const vantaRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    if (!containerRef.current) return;
    if (vantaRef.current) return;

    let mounted = true;

    import('vanta/dist/vanta.net.min.js').then((mod) => {
      if (!mounted || !containerRef.current) return;
      const VANTA = mod.default || mod;
      vantaRef.current = VANTA({
        el: containerRef.current,
        mouseControls: true,
        touchControls: false,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0x00ff88,
        backgroundColor: 0x05080f,
        points: 8.0,
        maxDistance: 22.0,
        spacing: 18.0,
        showDots: true,
      });
    });

    return () => {
      mounted = false;
      if (vantaRef.current) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }
    };
  }, [isMobile]);

  if (isMobile) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        background: 'linear-gradient(135deg, #0a0e1a 0%, #05080f 100%)',
      }} />
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
      }}
    />
  );
}
