import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useEffect, useRef } from 'react';
import { useIsDark } from '../hooks/useIsDark';

// ─── Theme token maps ────────────────────────────────────────────────────────
const DARK_BG   = '#000000';            // pitch black
const LIGHT_BG  = '#f1f5f9';            // slate-100

const DARK_PARTICLES  = ['#ffffff', '#e2ff3b', '#a78bfa', '#38bdf8', '#eab308']; // high-contrast white & accent yellow
const LIGHT_PARTICLES = ['#6366f1', '#8b5cf6', '#db2777', '#0284c7', '#0d9488'];

const DARK_LINK_COLOR  = 'rgba(255,255,255,';   // white glow
const LIGHT_LINK_COLOR = 'rgba(99,102,241,';    // indigo muted

// ─── Particle Canvas ─────────────────────────────────────────────────────────
interface ParticleCanvasProps { isDark: boolean }

function ParticleCanvas({ isDark }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // refs so the loop reads live values without restart
  const isDarkRef = useRef(isDark);
  useEffect(() => { isDarkRef.current = isDark; }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animId: number;
    let dpr = window.devicePixelRatio || 1;
    const mouse = { x: null as number | null, y: null as number | null };

    class Particle {
      x = 0; y = 0; vx = 0; vy = 0; bvx = 0; bvy = 0;
      size = 0; color = ''; opacity = 0;

      init() {
        const w = canvas!.width / dpr, h = canvas!.height / dpr;
        this.size    = Math.random() * 2 + 1.2;
        this.x       = Math.random() * (w - this.size * 4) + this.size * 2;
        this.y       = Math.random() * (h - this.size * 4) + this.size * 2;
        this.vx      = (Math.random() - 0.5) * 0.65;
        this.vy      = (Math.random() - 0.5) * 0.65;
        this.bvx     = this.vx; this.bvy = this.vy;
        this.opacity = Math.random() * 0.5 + (isDarkRef.current ? 0.3 : 0.45);
        const palette = isDarkRef.current ? DARK_PARTICLES : LIGHT_PARTICLES;
        this.color   = palette[Math.floor(Math.random() * palette.length)];
        return this;
      }

      refreshColor() {
        const palette = isDarkRef.current ? DARK_PARTICLES : LIGHT_PARTICLES;
        this.color = palette[Math.floor(Math.random() * palette.length)];
        this.opacity = Math.random() * 0.5 + (isDarkRef.current ? 0.3 : 0.45);
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      update() {
        const w = canvas!.width / dpr, h = canvas!.height / dpr;
        if (this.x < this.size || this.x > w - this.size) { this.vx = -this.vx; this.bvx = -this.bvx; }
        if (this.y < this.size || this.y > h - this.size) { this.vy = -this.vy; this.bvy = -this.bvy; }
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x, dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150 && dist > 0) {
            const force = (150 - dist) / 150;
            this.vx -= (dx / dist) * force * 0.45;
            this.vy -= (dy / dist) * force * 0.45;
          } else {
            this.vx += (this.bvx - this.vx) * 0.05;
            this.vy += (this.bvy - this.vy) * 0.05;
          }
        } else {
          this.vx += (this.bvx - this.vx) * 0.03;
          this.vy += (this.bvy - this.vy) * 0.03;
        }
        this.x += this.vx; this.y += this.vy;
        this.draw();
      }
    }

    let particles: Particle[] = [];

    function spawnParticles() {
      particles = Array.from({ length: 90 }, () => new Particle().init());
    }

    function resize() {
      dpr = window.devicePixelRatio || 1;
      canvas!.width  = window.innerWidth  * dpr;
      canvas!.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      spawnParticles();
    }

    function connect() {
      const linkColor = isDarkRef.current ? DARK_LINK_COLOR : LIGHT_LINK_COLOR;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * (isDarkRef.current ? 0.15 : 0.25);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `${linkColor}${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }

    function loop() {
      ctx.clearRect(0, 0, canvas!.width / dpr, canvas!.height / dpr);
      for (const p of particles) p.update();
      connect();
      animId = requestAnimationFrame(loop);
    }

    const onMove    = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave   = () => { mouse.x = null; mouse.y = null; };
    const onTouch   = (e: TouchEvent) => { if (e.touches[0]) { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; } };
    const onTouchEnd = () => { mouse.x = null; mouse.y = null; };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('resize', resize);

    resize();
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', resize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // mount once — isDark changes are handled via ref

  // When theme switches, refresh particle colors smoothly
  const prevIsDark = useRef(isDark);
  useEffect(() => {
    if (prevIsDark.current === isDark) return;
    prevIsDark.current = isDark;
    // We can't access particles directly, but the ref update in the loop handles
    // color reads. Trigger a color refresh by mutating via a custom event.
    window.dispatchEvent(new CustomEvent('theme-changed'));
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

// ─── Layout ──────────────────────────────────────────────────────────────────
export default function Layout() {
  const isDark = useIsDark();

  const bg          = isDark ? DARK_BG  : LIGHT_BG;
  const gradientA   = isDark
    ? 'radial-gradient(circle at 80% 20%, rgba(226,255,59,0.08) 0%, transparent 50%)'
    : 'radial-gradient(circle at 80% 20%, rgba(99,102,241,0.08) 0%, transparent 50%)';
  const gradientB   = isDark
    ? 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)'
    : 'radial-gradient(circle at 20% 80%, rgba(236,72,153,0.06) 0%, transparent 50%)';
  const headerBg    = isDark
    ? 'rgba(0,0,0,0.85)'
    : 'rgba(241,245,249,0.80)';
  const headerBorder = isDark
    ? 'rgba(255,255,255,0.12)'
    : 'rgba(0,0,0,0.08)';
  const textColor   = isDark ? '#ffffff' : '#0f172a';

  return (
    <div
      className="flex flex-col min-h-screen relative overflow-hidden"
      style={{ background: bg, transition: 'background 0.5s ease' }}
    >
      <ParticleCanvas isDark={isDark} />

      {/* Depth gradient overlays */}
      <div aria-hidden className="fixed inset-0 pointer-events-none z-0 transition-all duration-500" style={{ background: gradientA }} />
      <div aria-hidden className="fixed inset-0 pointer-events-none z-0 transition-all duration-500" style={{ background: gradientB }} />

      <Sidebar isDark={isDark} />

      <main className="flex-1 w-full relative pb-20 md:pb-0 z-10">
        {/* Mobile Header */}
        <div
          className="md:hidden flex items-center justify-between p-4 sticky top-0 z-40 border-b"
          style={{
            background: headerBg,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderColor: headerBorder,
            transition: 'background 0.5s ease, border-color 0.5s ease',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black"
              style={{ background: 'linear-gradient(135deg, #d946ef, #6366f1)', boxShadow: '0 0 16px rgba(217,70,239,0.5)' }}
            >K</div>
            <span className="font-extrabold text-xl tracking-tight" style={{ color: textColor, transition: 'color 0.5s' }}>KaSao</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>

        <div className="p-4 md:p-8 lg:p-12 w-full max-w-none mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
