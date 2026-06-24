import { useEffect, useRef, useState } from 'react';

const continents = [
  {
    name: 'Северная Америка',
    lat: 40, lon: -100,
    attacks: 14832,
    details: 'Фишинг, ransomware, DDoS',
  },
  {
    name: 'Европа',
    lat: 50, lon: 15,
    attacks: 11205,
    details: 'APT-группировки, утечки данных',
  },
  {
    name: 'Азия',
    lat: 35, lon: 105,
    attacks: 22410,
    details: 'Supply chain, zero-day эксплойты',
  },
  {
    name: 'Южная Америка',
    lat: -15, lon: -60,
    attacks: 4567,
    details: 'Банковский троян, кража данных',
  },
  {
    name: 'Африка',
    lat: 5, lon: 25,
    attacks: 3218,
    details: 'Мошенничество, социальная инженерия',
  },
  {
    name: 'Австралия',
    lat: -25, lon: 135,
    attacks: 5640,
    details: 'Атаки на инфраструктуру, криптомайнеры',
  },
];

const attackLines = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 2, to: 0 },
  { from: 0, to: 3 },
  { from: 1, to: 4 },
  { from: 2, to: 5 },
  { from: 3, to: 4 },
  { from: 4, to: 5 },
  { from: 5, to: 1 },
  { from: 2, to: 3 },
];

function latLonTo3D(lat, lon, r) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return {
    x: -(r * Math.sin(phi) * Math.cos(theta)),
    y: r * Math.cos(phi),
    z: r * Math.sin(phi) * Math.sin(theta),
  };
}

function project(p, cx, cy, angleX, angleY) {
  // rotate Y
  let x = p.x * Math.cos(angleY) - p.z * Math.sin(angleY);
  let z = p.x * Math.sin(angleY) + p.z * Math.cos(angleY);
  let y = p.y;

  // rotate X
  const y2 = y * Math.cos(angleX) - z * Math.sin(angleX);
  const z2 = y * Math.sin(angleX) + z * Math.cos(angleX);
  y = y2;
  z = z2;

  const scale = 300 / (300 + z);
  return { x: cx + x * scale, y: cy + y * scale, z, scale };
}

export default function ThreatGlobe() {
  const canvasRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const angleRef = useRef({ x: 0.3, y: 0 });
  const [paused, setPaused] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = canvas.width = rect.width;
      h = canvas.height = Math.min(rect.width * 0.7, 500);
      canvas.style.height = h + 'px';
    }
    resize();
    window.addEventListener('resize', resize);

    const r = Math.min(w, h) * 0.32;

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const angleX = angleRef.current.x;
      const angleY = angleRef.current.y;

      // globe outline
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // grid lines (latitude)
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let first = true;
        for (let lon = 0; lon <= 360; lon += 5) {
          const p3d = latLonTo3D(lat, lon, r);
          const proj = project(p3d, cx, cy, angleX, angleY);
          if (proj.z < -r * 0.1) continue;
          if (first) { ctx.moveTo(proj.x, proj.y); first = false; }
          else ctx.lineTo(proj.x, proj.y);
        }
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.06)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // grid lines (longitude)
      for (let lon = 0; lon < 360; lon += 30) {
        ctx.beginPath();
        let first = true;
        for (let lat = -90; lat <= 90; lat += 5) {
          const p3d = latLonTo3D(lat, lon, r);
          const proj = project(p3d, cx, cy, angleX, angleY);
          if (proj.z < -r * 0.1) continue;
          if (first) { ctx.moveTo(proj.x, proj.y); first = false; }
          else ctx.lineTo(proj.x, proj.y);
        }
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.06)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // attack lines
      attackLines.forEach((line) => {
        const c1 = continents[line.from];
        const c2 = continents[line.to];
        const p1 = latLonTo3D(c1.lat, c1.lon, r);
        const p2 = latLonTo3D(c2.lat, c2.lon, r);
        const proj1 = project(p1, cx, cy, angleX, angleY);
        const proj2 = project(p2, cx, cy, angleX, angleY);

        if (proj1.z < -r * 0.2 || proj2.z < -r * 0.2) return;

        const alpha = Math.min(proj1.scale, proj2.scale) * 0.3;

        // curved line
        const mx = (proj1.x + proj2.x) / 2;
        const my = (proj1.y + proj2.y) / 2 - 30;
        ctx.beginPath();
        ctx.moveTo(proj1.x, proj1.y);
        ctx.quadraticCurveTo(mx, my, proj2.x, proj2.y);
        ctx.strokeStyle = `rgba(0, 255, 136, ${alpha * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // continents
      continents.forEach((c, i) => {
        const p3d = latLonTo3D(c.lat, c.lon, r);
        const proj = project(p3d, cx, cy, angleX, angleY);

        if (proj.z < -r * 0.15) return;

        const dotSize = 4 * proj.scale;
        const alpha = Math.max(0.3, Math.min(1, (proj.z + r) / (2 * r)));

        // glow
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, dotSize * 3, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, dotSize * 3);
        grad.addColorStop(0, `rgba(0, 255, 136, ${alpha * 0.3})`);
        grad.addColorStop(1, 'rgba(0, 255, 136, 0)');
        ctx.fillStyle = grad;
        ctx.fill();

        // dot
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 136, ${alpha})`;
        ctx.fill();

        // store projected position for hover detection
        c._proj = proj;
        c._dotSize = dotSize;
      });

      if (!paused) {
        angleRef.current.y += 0.003;
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    const onScroll = () => {
      const scrollY = window.scrollY;
      const section = canvas.closest('.section');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const visible = rect.top < window.innerHeight && rect.bottom > 0;
      if (visible) {
        angleRef.current.x = 0.3 + Math.sin(scrollY * 0.001) * 0.15;
      }
    };
    window.addEventListener('scroll', onScroll);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, [paused]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let found = null;
    continents.forEach((c) => {
      if (!c._proj) return;
      const dx = mx - c._proj.x;
      const dy = my - c._proj.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < (c._dotSize || 10) * 3 + 10) {
        found = c;
      }
    });

    if (found) {
      setTooltip({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top - 10,
        continent: found.name,
        attacks: found.attacks,
        details: found.details,
      });
      canvas.style.cursor = 'pointer';
    } else {
      setTooltip(null);
      canvas.style.cursor = 'default';
    }
  };

  return (
    <div className="globe-wrapper">
      <canvas
        ref={canvasRef}
        className="globe-canvas"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
      />
      {tooltip && (
        <div
          className="globe-tooltip"
          style={{
            left: tooltip.x,
            top: tooltip.y,
          }}
        >
          <div className="globe-tooltip-title">{tooltip.continent}</div>
          <div className="globe-tooltip-attacks">
            Зафиксировано <strong>{tooltip.attacks.toLocaleString()}</strong> атак за день
          </div>
          <div className="globe-tooltip-details">{tooltip.details}</div>
        </div>
      )}
    </div>
  );
}
