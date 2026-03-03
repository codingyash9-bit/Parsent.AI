import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  BarChart3, 
  Database, 
  FileText, 
  MessageSquare, 
  RefreshCw, 
  Search, 
  TrendingDown, 
  TrendingUp, 
  Zap,
  Twitter,
  MessageCircle,
  Cpu,
  Layers,
  Radio,
  Terminal,
  Server,
  Shield,
  ChevronRight,
  Globe,
  Lock,
  ZapOff,
  Share2,
  ExternalLink,
  Github,
  Linkedin
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
} from 'recharts';
import { motion, AnimatePresence, useTransform, useScroll } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { gsap } from 'gsap';
import { analyzeSentiment } from './services/geminiService';
import { SentimentReport } from './types';
import { AIBallScene } from './components/AIBall';
import { TechGrid, DataStream, TechConnector, FloatingFragment, CodeRain, JarvisHUD, ScrollNavigator, Logo, Navbar, Footer, TerminalGalaxy, NeuralNetwork } from './components/TechElements';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const AnimatedCounter = ({ value, decimals = 0, suffix = "" }: { value: number; decimals?: number; suffix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let startTimestamp: number | null = null;
        const duration = 1800;
        const step = (timestamp: number) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplayValue(value * eased);
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };
        window.requestAnimationFrame(step);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={nodeRef} className="font-mono text-neon-cyan">{displayValue.toFixed(decimals)}{suffix}</span>;
};

const SentimentWaveform = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = 80;
    };
    resize();
    window.addEventListener('resize', resize);

    let t = 0;
    const colors = ['#00FF9C', '#00E676', '#00C853', '#B2FF59'];

    const drawWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      colors.forEach((color, i) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.4 - i * 0.07;

        for (let x = 0; x < canvas.width; x++) {
          const freq = 0.008 + i * 0.002;
          const amp = 18 - i * 3;
          const y = 40 + Math.sin(x * freq + t + i * 1.2) * amp
                       + Math.sin(x * freq * 2.3 + t * 1.5) * (amp * 0.4);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      t += 0.02;
      requestAnimationFrame(drawWave);
    };

    const animationId = requestAnimationFrame(drawWave);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-20 opacity-50" />;
};

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current && followerRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - 10}px, ${e.clientY - 10}px, 0)`;
        followerRef.current.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`;
      }
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor hidden md:block" />
      <div ref={followerRef} className="custom-cursor-follower hidden md:block" />
    </>
  );
};

const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("transition-transform duration-200 ease-out preserve-3d", className)}
    >
      {children}
    </div>
  );
};

const FUIOverlay = ({ isVisible, progress, status }: { isVisible: boolean; progress: number; status: string }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const radarLeftRef = useRef<HTMLCanvasElement>(null);
  const radarRightRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle Network (Layer 5)
    const particles: any[] = [];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        color: Math.random() > 0.4 ? '#00E5FF' : (Math.random() > 0.5 ? '#6A1FFF' : '#D4A85A')
      });
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 229, 255, ${0.2 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(drawParticles);
    };

    const animId = requestAnimationFrame(drawParticles);

    // Radar Sweeps (Layer 6)
    const drawRadar = (canvas: HTMLCanvasElement, label: string) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = 180;
      canvas.height = 180;
      let angle = 0;
      const dots = Array.from({ length: 10 }, () => ({
        x: Math.random() * 160 + 10,
        y: Math.random() * 160 + 10,
        opacity: 0
      }));

      const sweep = () => {
        ctx.clearRect(0, 0, 180, 180);
        
        // Circle
        ctx.beginPath();
        ctx.arc(90, 90, 85, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.2)';
        ctx.stroke();

        // Sweep line
        ctx.beginPath();
        ctx.moveTo(90, 90);
        const x = 90 + Math.cos(angle) * 85;
        const y = 90 + Math.sin(angle) * 85;
        ctx.lineTo(x, y);
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.8)';
        ctx.stroke();

        // Dots
        dots.forEach(d => {
          const dotAngle = Math.atan2(d.y - 90, d.x - 90);
          const diff = Math.abs(angle % (Math.PI * 2) - (dotAngle + Math.PI * 2) % (Math.PI * 2));
          if (diff < 0.1) d.opacity = 1;
          d.opacity *= 0.95;
          ctx.beginPath();
          ctx.arc(d.x, d.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 229, 255, ${d.opacity})`;
          ctx.fill();
        });

        angle += 0.05;
        requestAnimationFrame(sweep);
      };
      sweep();
    };

    if (radarLeftRef.current) drawRadar(radarLeftRef.current, "SOURCE SCAN");
    if (radarRightRef.current) drawRadar(radarRightRef.current, "MODEL ACTIVE");

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [isVisible]);

  return (
    <div ref={overlayRef} className={cn("fui-overlay", isVisible && "visible opacity-100")}>
      <div className="fui-grid-floor" />
      <div className="fui-god-ray" />
      <div className="fui-hex-grid" />
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Reticle System (Layer 3) */}
      <div className="relative z-20 flex flex-col items-center">
        <svg width="300" height="300" className="relative">
          <circle cx="150" cy="150" r="50" fill="none" stroke="#00E5FF" strokeWidth="1" className="animate-[spin_4s_linear_infinite]" strokeDasharray="10 5" />
          <circle cx="150" cy="150" r="80" fill="none" stroke="#6A1FFF" strokeWidth="1" className="animate-[spin_8s_linear_infinite_reverse]" strokeDasharray="20 10" />
          <circle cx="150" cy="150" r="110" fill="none" stroke="#D4A85A" strokeWidth="1" className="animate-pulse" strokeDasharray="5 5" />
          <path d="M150 20 V40 M150 260 V280 M20 150 H40 M260 150 H280" stroke="#00E5FF" strokeWidth="2" />
        </svg>
        
        <div className="absolute top-0 right-0 font-mono text-[10px] text-neon-cyan opacity-60">
          LAT: {(Math.random() * 180 - 90).toFixed(4)}<br/>
          LON: {(Math.random() * 360 - 180).toFixed(4)}
        </div>

        {/* Progress System (Layer 8) */}
        <div className="mt-12 text-center space-y-4">
          <div className="flex gap-1">
            {Array.from({ length: 24 }).map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "w-3 h-8 border border-neon-cyan/20 transition-all duration-300",
                  i / 24 < progress / 100 ? "bg-neon-cyan shadow-[0_0_10px_#00E5FF]" : "bg-transparent"
                )} 
              />
            ))}
          </div>
          <div className="text-4xl font-mono text-neon-cyan">{Math.round(progress)}%</div>
          <div className="text-sm font-mono text-neon-cyan tracking-widest h-6">{status}</div>
        </div>
      </div>

      {/* Radar Panels (Layer 6) */}
      <div className="absolute left-20 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
        <canvas ref={radarLeftRef} />
        <span className="font-mono text-[10px] text-neon-cyan opacity-60">SOURCE SCAN</span>
      </div>
      <div className="absolute right-20 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
        <canvas ref={radarRightRef} />
        <span className="font-mono text-[10px] text-neon-cyan opacity-60">MODEL ACTIVE</span>
      </div>

      {/* Data Streams (Layer 7) */}
      <div className="absolute left-4 top-0 bottom-0 w-32 overflow-hidden opacity-30 pointer-events-none">
        <div className="animate-[slide-down_20s_linear_infinite] font-mono text-[10px] text-neon-cyan space-y-2">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i}>NODE_{i}: {Math.random().toString(36).substring(7).toUpperCase()} :: {Math.random().toFixed(3)}</div>
          ))}
        </div>
      </div>
      <div className="absolute right-4 top-0 bottom-0 w-32 overflow-hidden opacity-30 pointer-events-none">
        <div className="animate-[slide-down_25s_linear_infinite_reverse] font-mono text-[10px] text-neon-cyan space-y-2">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i}>SENTIMENT_{i}: {Math.random() > 0.5 ? 'POS' : 'NEG'} :: {Math.random().toFixed(3)}</div>
          ))}
        </div>
      </div>

      {/* Corner Brackets (Layer 10) */}
      <div className="fui-corner-bracket top-10 left-10 border-t-2 border-l-2" />
      <div className="fui-corner-bracket top-10 right-10 border-t-2 border-r-2" />
      <div className="fui-corner-bracket bottom-10 left-10 border-b-2 border-l-2" />
      <div className="fui-corner-bracket bottom-10 right-10 border-b-2 border-r-2" />
    </div>
  );
};

const InitiateAuditButton = ({ onClick, loading, isSearchMode }: { onClick: () => void; loading: boolean; isSearchMode: boolean }) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const traceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!btnRef.current || !traceRef.current) return;
    
    let angle = 0;
    const animateTrace = () => {
      if (!btnRef.current || !traceRef.current) return;
      const rect = btnRef.current.getBoundingClientRect();
      const x = rect.width / 2 + Math.cos(angle) * (rect.width / 2 + 10);
      const y = rect.height / 2 + Math.sin(angle) * (rect.height / 2 + 10);
      traceRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      angle += 0.02;
      requestAnimationFrame(animateTrace);
    };
    const animId = requestAnimationFrame(animateTrace);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      disabled={loading}
      className="fui-button w-full group"
    >
      <div className="fui-button-bg" />
      <div className="fui-button-bracket fui-button-bracket-tl" />
      <div className="fui-button-bracket fui-button-bracket-br" />
      <div ref={traceRef} className="fui-button-trace" />
      <span className="relative z-10 flex items-center justify-center gap-4">
        {loading ? <RefreshCw className="animate-spin" size={24} /> : <Zap size={24} />}
        {loading ? "INITIATING..." : isSearchMode ? "Initiate Web Crawl" : "Audit Stream"}
      </span>
    </button>
  );
};

const StepItem = ({ step, index, total, id }: { step: any; index: number; total: number; id: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [50, 0, 0, -50]);
  const blur = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], ["blur(10px)", "blur(0px)", "blur(0px)", "blur(10px)"]);
  const isActive = useTransform(scrollYProgress, [0.3, 0.7], [false, true]);
  
  const [active, setActive] = useState(false);
  useEffect(() => {
    return isActive.on("change", (v) => setActive(v));
  }, [isActive]);

  return (
    <div ref={ref} id={id} className="relative">
      {index < total - 1 && (
        <TechConnector isActive={active} index={index} />
      )}

      <motion.div
        style={{ opacity, scale, filter: blur, y }}
        className={cn(
          "relative flex flex-col md:flex-row items-center gap-12 transition-all duration-1000 ease-out",
          index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
        )}
      >
        <div className="flex-1 text-center md:text-left">
          <div className={cn(
            "inline-flex p-4 rounded-2xl border transition-all duration-500 mb-6",
            active ? "bg-neon-cyan/10 border-neon-cyan/50 shadow-[0_0_20px_rgba(0,229,255,0.2)]" : "bg-bg-elevated/50 border-wada-ink"
          )}>
            {React.cloneElement(step.icon as React.ReactElement<any>, { className: active ? "text-neon-cyan" : "text-text-dim" })}
          </div>
          <h3 className={cn(
            "text-3xl font-display font-bold mb-4 transition-colors duration-500",
            active ? "text-text-primary" : "text-text-dim"
          )}>
            {step.title}
          </h3>
          <p className={cn(
            "text-lg font-light leading-relaxed transition-colors duration-500",
            active ? "text-text-secondary" : "text-text-dim/50"
          )}>
            {step.desc}
          </p>
        </div>
        
        {/* Node Dot */}
        <div className="w-6 h-6 rounded-full bg-bg-void border-2 border-wada-ink relative z-10 hidden md:block">
          <div className="absolute inset-[-4px] border border-neon-cyan/20 rounded-full animate-ping" />
          {active && (
            <motion.div 
              layoutId="active-dot"
              className="absolute inset-0 bg-neon-cyan rounded-full shadow-[0_0_15px_#00E5FF]"
            />
          )}
        </div>
        <div className="flex-1" />
      </motion.div>
    </div>
  );
};

const LandingPage = ({ onEnter }: { onEnter: () => void }) => {
  const [counts, setCounts] = useState({ posts: 0, sources: 0, accuracy: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setScrollProgress(latest);
    });
    
    const timer = setTimeout(() => {
      setCounts({ posts: 1248502, sources: 42, accuracy: 99.8 });
    }, 500);
    
    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [scrollYProgress]);

  const steps = [
    { title: "Signal Capture", desc: "Intercepting raw data streams from global networks.", icon: <Radio size={20} /> },
    { title: "Neural Processing", desc: "AI-driven emotional decoding and pattern recognition.", icon: <Cpu size={20} /> },
    { title: "Sentiment Mapping", desc: "Visualizing the collective consciousness in real-time.", icon: <Activity size={20} /> },
    { title: "Audit Generation", desc: "Finalizing deep-dive reports with actionable insights.", icon: <Shield size={20} /> }
  ];

  return (
    <div ref={containerRef} className="relative min-h-[400vh] bg-bg-void overflow-hidden selection:bg-neon-cyan selection:text-bg-void">
      <div className="scanline" />
      
      {/* Background Tech Layer */}
      <div className="fixed inset-0 z-0">
        <TechGrid />
        <DataStream />
        <CodeRain />
        <JarvisHUD />
        <ScrollNavigator />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(106,31,255,0.15),transparent_70%)]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.1, 1, 1.1],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(0,229,255,0.1),transparent_60%)]" 
        />
      </div>

      <Navbar onEnter={onEnter} />

      {/* Scrolling Scanning Text */}
      <motion.div
        style={{ top: useTransform(scrollYProgress, [0, 1], ['0%', '100%']) }}
        className="fixed left-0 right-0 z-50 pointer-events-none"
      >
        <div className="absolute right-4 top-2 font-mono text-[8px] text-neon-cyan uppercase tracking-widest">
          Scanning_Neural_Nodes... {Math.round(scrollProgress * 100)}%
        </div>
      </motion.div>
      
      {/* Hero Section */}
      <section id="hero" className="sticky top-0 h-screen flex flex-col items-center justify-start pt-16 md:pt-24 px-12 md:px-24 overflow-hidden">
        <div className="relative z-10 flex flex-col items-center text-center w-full max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative mb-4"
          >
            {/* Glitchy PARSENT Text with enhanced glow - Now at the top */}
            <div className="relative group">
              <h1 className="text-[10vw] md:text-[12rem] font-bebas leading-none text-neon-cyan glitch hover-zoom relative z-10 drop-shadow-[0_0_50px_rgba(0,229,255,0.8)] tracking-tighter" data-text="PARSENT">
                PARSENT
              </h1>
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-8 h-[2px] bg-neon-cyan/40 hidden lg:block" />
              <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-8 h-[2px] bg-neon-cyan/40 hidden lg:block" />
            </div>
            <div className="absolute inset-0 bg-neon-cyan/30 blur-[120px] -z-10 animate-pulse" />
          </motion.div>

          {/* 3D AI Ball Container - Shifted up to where PARSENT was */}
          <div className="w-full h-[70vh] md:h-[85vh] relative -mt-40 md:-mt-80">
            <div className="absolute inset-0 z-0 pointer-events-none opacity-100">
              <AIBallScene scrollProgress={scrollProgress} />
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 -mt-24 md:-mt-32 relative z-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="text-[10px] md:text-xs font-mono uppercase tracking-[1.5em] text-neon-cyan/90 bg-bg-void/60 backdrop-blur-md px-6 py-3 border border-neon-cyan/30 rounded-full shadow-[0_0_20px_rgba(0,229,255,0.2)]"
            >
              Neural Intelligence Interface // v2.5
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="text-base md:text-lg font-display font-light text-text-secondary/80 max-w-2xl leading-relaxed italic"
            >
              "Decoding the emotional frequency of the global digital stream."
            </motion.p>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="absolute bottom-0 left-0 w-full border-t border-wada-ink bg-bg-surface/80 backdrop-blur-md px-12 py-8 flex flex-wrap justify-between items-center gap-8 z-20">
          <div className="flex flex-col hover-zoom items-start">
            <span className="text-[10px] font-mono text-text-dim uppercase tracking-widest">Signals Analyzed Today</span>
            <span className="text-2xl font-mono text-neon-cyan/80">
              <AnimatedCounter value={counts.posts} />
            </span>
          </div>
          <div className="flex flex-col hover-zoom items-start">
            <span className="text-[10px] font-mono text-text-dim uppercase tracking-widest">Active Neural Nodes</span>
            <span className="text-2xl font-mono text-neon-cyan/80">
              <AnimatedCounter value={counts.sources} />
            </span>
          </div>
          <div className="flex flex-col hover-zoom items-start">
            <span className="text-[10px] font-mono text-text-dim uppercase tracking-widest">Audit Accuracy</span>
            <span className="text-2xl font-mono text-neon-cyan/80">
              <AnimatedCounter value={counts.accuracy} decimals={1} suffix="%" />
            </span>
          </div>
        </div>
      </section>

      {/* Interactive How It Works Section */}
      <section id="how-it-works" className="relative py-64 px-8 bg-transparent z-10">
        {/* Floating Fragments in background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <FloatingFragment key={i} delay={i * 0.1} />
          ))}
        </div>

        <div className="max-w-4xl mx-auto space-y-32">
          <div className="text-center space-y-6">
            <div className="text-[10px] font-mono uppercase tracking-[0.6em] text-wada-gold/60 hover-zoom">Operational Protocol</div>
            <h2 className="text-5xl font-display font-bold text-text-primary/80 hover-zoom">How Parsent Decodes Reality</h2>
          </div>

          <div className="space-y-64 relative">
            {steps.map((step, i) => {
              return (
                <StepItem key={i} step={step} index={i} total={steps.length} id={`step-${i}`} />
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="final-cta" className="relative py-64 px-8 text-center bg-bg-void/40 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="relative inline-block">
            <h2 className="text-6xl font-display font-bold text-text-primary/90 hover-zoom">Ready to see the unseen?</h2>
            <div className="absolute -bottom-4 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50" />
          </div>
          <p className="text-text-secondary/60 font-mono text-xs uppercase tracking-widest">
            Neural Link Status: Ready // Encryption: AES-256 // Nodes: Online
          </p>
          <button 
            onClick={onEnter}
            className="px-16 py-6 bg-bg-elevated border border-wada-ink text-text-primary font-display font-bold uppercase tracking-[0.5em] hover:bg-neon-cyan hover:text-bg-void hover:shadow-[0_0_60px_rgba(0,229,255,0.4)] transition-all hover-zoom relative group"
          >
            <span className="relative z-10">Launch Terminal →</span>
            <div className="absolute inset-0 bg-neon-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [input, setInput] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(true);
  const [report, setReport] = useState<SentimentReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fuiVisible, setFuiVisible] = useState(false);
  const [fuiProgress, setFuiProgress] = useState(0);
  const [fuiStatus, setFuiStatus] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('in-view'), i * 80);
        }
      });
    }, { threshold: 0.01 });

    const observeElements = () => {
      document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
      });
    };

    // Initial observation
    observeElements();

    // Use MutationObserver to catch elements mounted by AnimatePresence
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, { 
      childList: true, 
      subtree: true 
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [report, loading, showLanding]);

  const handleAudit = async () => {
    if (!input || input.trim().length < 5) {
      setError(isSearchMode ? 'Please enter a topic to search.' : 'Please paste some data to analyze.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Reset GSAP props from previous runs
    gsap.set(".fui-overlay", { clearProps: "all" });
    gsap.set("main", { clearProps: "filter" });

    // Phase 2-5: FUI Sequence
    const tl = gsap.timeline();
    
    // Phase 2: Click Reaction
    tl.to(".fui-button", { scale: 1.05, duration: 0.1 })
      .to(".fui-button", { scale: 1, duration: 0.1 })
      .call(() => {
        // Shockwave effect
        const shock = document.createElement('div');
        shock.className = 'fixed inset-0 pointer-events-none z-[10000] border-4 border-neon-cyan rounded-full opacity-0';
        document.body.appendChild(shock);
        gsap.fromTo(shock, { scale: 0, opacity: 0.8 }, { scale: 4, opacity: 0, duration: 1, onComplete: () => shock.remove() });
      });

    // Phase 3: System Boot
    tl.to(".crt-flash", { opacity: 0.1, duration: 0.05 })
      .to(".crt-flash", { opacity: 0, duration: 0.05 })
      .to("main", { filter: "blur(8px)", duration: 0.4 }, "-=0.1")
      .call(() => setFuiVisible(true));

    // Phase 4: Loading Overlay
    const statuses = [
      "ESTABLISHING SECURE CONNECTION...",
      "AUTHENTICATING DATA SOURCES...",
      "FETCHING REDDIT CORPUS...",
      "FETCHING X CORPUS...",
      "PREPROCESSING TEXT PIPELINE...",
      "RUNNING VADER SENTIMENT MODEL...",
      "RUNNING BERT CLASSIFICATION...",
      "CROSS-REFERENCING SOURCE WEIGHTS...",
      "COMPILING SENTIMENT MATRIX...",
      "FINALIZING AUDIT REPORT..."
    ];

    statuses.forEach((status, i) => {
      tl.call(() => {
        setFuiStatus(status);
        setFuiProgress((i + 1) * 10);
      }, null, 1 + i * 0.4);
    });

    // Start API call in background
    const apiPromise = analyzeSentiment(input, isSearchMode);

    tl.to({}, { duration: 5 }); // Wait for sequence

    try {
      const result = await apiPromise;
      
      // Phase 5: Completion
      tl.call(() => setFuiStatus("AUDIT COMPLETE // CONFIDENCE 97.3%"))
        .to(".fui-overlay", { opacity: 0, duration: 0.6, ease: "power2.inOut", delay: 0.5 })
        .call(() => {
          setFuiVisible(false);
          if ('error' in result) {
            setError(result.executive_summary);
          } else {
            setReport(result);
          }
          setLoading(false);
          gsap.to("main", { filter: "blur(0px)", duration: 0.4 });
        });

    } catch (err) {
      setError('Failed to process audit. Please check your connection and try again.');
      setLoading(false);
      setFuiVisible(false);
      gsap.to("main", { filter: "blur(0px)", duration: 0.4 });
    }
  };

  const resetAudit = () => {
    setReport(null);
    setInput('');
    setError(null);
    gsap.set("main", { clearProps: "filter" });
  };

  const chartData = useMemo(() => {
    if (!report) return [];
    return [
      { name: 'Positive', value: report.sentiment_analysis.score_breakdown.positive, color: '#00FF9C' },
      { name: 'Negative', value: report.sentiment_analysis.score_breakdown.negative, color: '#FF2D78' },
      { name: 'Neutral', value: report.sentiment_analysis.score_breakdown.neutral, color: '#D4A85A' },
    ];
  }, [report]);

  const handleEnterTerminal = () => {
    // Warp Speed Transition
    const tl = gsap.timeline();
    tl.to(".scanline", { height: "100vh", opacity: 0.5, duration: 0.4, ease: "power4.in" })
      .to(".scanline", { height: "2px", opacity: 0.1, duration: 0.2 })
      .call(() => setShowLanding(false));
  };

  return (
    <div className="min-h-screen selection:bg-neon-cyan selection:text-black overflow-x-hidden">
      <CustomCursor />
      <FUIOverlay isVisible={fuiVisible} progress={fuiProgress} status={fuiStatus} />
      <div className="crt-flash" />

      {showLanding ? (
        <LandingPage onEnter={handleEnterTerminal} />
      ) : (
        <>
          {/* Header */}
          <header className="relative z-50 border-b border-wada-ink px-8 py-6 flex items-center justify-between backdrop-blur-md bg-bg-surface/40 sticky top-0">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-4 cursor-pointer group"
          onClick={resetAudit}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-neon-cyan blur-md opacity-50 group-hover:opacity-100 transition-opacity animate-pulse" />
            <div className="relative bg-bg-void border border-neon-cyan p-1 rounded-lg text-neon-cyan shadow-[0_0_15px_rgba(0,229,255,0.5)] group-hover:scale-110 transition-transform">
              <Logo size={32} glow />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-display uppercase tracking-tighter leading-none glitch hover-zoom" data-text="PARSENT">Parsent</h1>
          </div>
        </motion.div>

        <div className="hidden md:flex items-center gap-8 text-[10px] font-mono uppercase tracking-widest text-text-secondary">
          <button 
            onClick={() => setShowLanding(true)}
            className="hover:text-neon-cyan transition-colors border-r border-wada-ink pr-8 hover-zoom"
          >
            Terminal Exit
          </button>
          <div className="flex items-center gap-2 hover-zoom">
            <div className="w-1.5 h-1.5 rounded-full bg-sentiment-pos shadow-[0_0_8px_#00FF9C] animate-pulse" />
            Neural Link Active
          </div>
          <div className="flex items-center gap-2 hover-zoom">
            <Radio size={14} className="text-neon-violet animate-pulse" />
            Live Feed: Reddit, X, Logs
          </div>
        </div>
      </header>

      <main className="relative z-10 w-full overflow-hidden">
        {/* Terminal Background Effects - Only visible in terminal mode */}
        {!showLanding && (
          <>
            <TerminalGalaxy />
            <NeuralNetwork />
          </>
        )}
        
        <AnimatePresence mode="wait">
          {!report ? (
            <motion.div 
              key="input-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05, y: -50 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="min-h-[calc(100vh-100px)] flex items-center justify-center p-8 relative z-10"
            >
              <div className="w-full max-w-2xl space-y-8">
                <div className="text-center space-y-4 mb-12">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-6xl font-display uppercase tracking-tighter text-neon-cyan mb-2 hover-zoom">Initiate Audit</h2>
                    <p className="text-sm font-mono uppercase tracking-[0.3em] text-text-secondary italic hover-zoom">Decrypting Global Sentiment Nodes</p>
                  </motion.div>
                </div>

                <TiltCard className="scroll-reveal w-full">
                  <motion.section 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card rounded-3xl overflow-hidden w-full"
                  >
                    <div className="px-8 py-5 border-b border-wada-ink flex items-center justify-between bg-bg-elevated/40">
                      <div className="flex items-center gap-3 text-[12px] font-mono uppercase tracking-widest text-neon-cyan hover-zoom">
                        <Terminal size={16} />
                        Command Interface
                      </div>
                      <div className="flex bg-bg-void p-2 rounded-xl border border-wada-ink gap-2 relative z-50">
                        <button 
                          onClick={() => setIsSearchMode(true)}
                          className={cn(
                            "flex-1 px-6 py-3 rounded-lg text-[11px] uppercase tracking-[0.2em] transition-all font-bold flex items-center justify-center gap-2 pointer-events-auto",
                            isSearchMode ? "bg-neon-cyan text-bg-void shadow-[0_0_20px_rgba(0,229,255,0.4)]" : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                          )}
                        >
                          <Search size={14} />
                          Auto-Gather
                        </button>
                        <button 
                          onClick={() => setIsSearchMode(false)}
                          className={cn(
                            "flex-1 px-6 py-3 rounded-lg text-[11px] uppercase tracking-[0.2em] transition-all font-bold flex items-center justify-center gap-2 pointer-events-auto",
                            !isSearchMode ? "bg-neon-magenta text-text-primary shadow-[0_0_20px_rgba(255,45,120,0.4)]" : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                          )}
                        >
                          <Database size={14} />
                          Manual Ingest
                        </button>
                      </div>
                    </div>
                    <div className="p-10 space-y-8">
                      {isSearchMode ? (
                        <div className="space-y-6">
                          <p className="text-sm font-mono text-text-secondary leading-relaxed text-center italic hover-zoom opacity-60">
                            Target a topic, brand, or incident. AI will crawl Reddit, X, and technical nodes.
                          </p>
                          <div className="relative group">
                            <div className="absolute inset-0 bg-neon-cyan/5 blur-2xl group-focus-within:bg-neon-cyan/10 transition-all" />
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-neon-cyan transition-colors" size={24} />
                            <input 
                              type="text"
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              placeholder="e.g. 'Parsent API Outage 2026'"
                              className="relative w-full bg-bg-void/80 border border-wada-ink rounded-2xl py-6 pl-16 pr-8 text-xl focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/30 transition-all outline-none font-display tracking-wide text-text-primary"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6 relative">
                          <p className="text-sm font-mono text-text-secondary leading-relaxed text-center italic hover-zoom opacity-60">
                            Inject raw data streams directly into the neural auditor.
                          </p>
                          <div className="relative group">
                            <div className={cn(
                              "absolute inset-0 bg-neon-magenta/5 blur-2xl group-focus-within:bg-neon-magenta/10 transition-all",
                              loading && "animate-pulse bg-neon-magenta/20"
                            )} />
                            <textarea
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              disabled={loading}
                              placeholder="Paste raw data streams here (Reddit posts, Tweets, Logs, etc.)..."
                              className={cn(
                                "relative w-full h-[350px] bg-bg-void/80 border border-wada-ink rounded-2xl p-8 text-base font-mono resize-none focus:border-neon-magenta focus:ring-1 focus:ring-neon-magenta/30 transition-all outline-none text-text-primary leading-relaxed",
                                loading && "opacity-50 cursor-wait"
                              )}
                            />
                            {/* Decorative corner brackets for manual ingest */}
                            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-neon-magenta/30 pointer-events-none" />
                            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-neon-magenta/30 pointer-events-none" />
                            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-neon-magenta/30 pointer-events-none" />
                            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-neon-magenta/30 pointer-events-none" />
                            
                            {loading && !isSearchMode && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="bg-bg-void/80 backdrop-blur-md border border-neon-magenta/40 px-8 py-4 rounded-xl flex items-center gap-4">
                                  <RefreshCw className="animate-spin text-neon-magenta" size={24} />
                                  <span className="font-mono text-xs text-neon-magenta uppercase tracking-[0.3em]">Analyzing Stream...</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Audit Trigger Section */}
                      <div className="pt-8 border-t border-wada-ink/30">
                        <InitiateAuditButton 
                          onClick={handleAudit} 
                          loading={loading} 
                          isSearchMode={isSearchMode} 
                        />
                        <div className="flex justify-center mt-6">
                          <div className="flex items-center gap-4 px-6 py-2 bg-bg-void/50 border border-wada-ink rounded-full">
                            <div className={cn(
                              "w-2 h-2 rounded-full animate-pulse",
                              isSearchMode ? "bg-neon-cyan shadow-[0_0_10px_#00E5FF]" : "bg-neon-magenta shadow-[0_0_10px_#FF2D78]"
                            )} />
                            <span className="text-[10px] font-mono text-text-secondary uppercase tracking-[0.3em]">
                              {isSearchMode ? "Awaiting Target Parameters..." : "Awaiting Data Stream Injection..."}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.section>
                </TiltCard>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl flex gap-4 text-red-400 backdrop-blur-md"
                  >
                    <AlertTriangle className="shrink-0" size={24} />
                    <div>
                      <div className="font-display uppercase tracking-wider mb-1">Audit Failure</div>
                      <p className="text-xs opacity-80 leading-relaxed">{error}</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="report-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-8 py-16 space-y-16"
            >
              <div className="flex items-center justify-between mb-12 reveal-mask animate-[reveal-right_0.8s_ease_forwards]">
                <div className="space-y-1">
                  <h2 className="text-4xl font-display uppercase tracking-widest text-neon-cyan hover-zoom">Audit Report</h2>
                  <p className="text-xs font-mono text-text-secondary uppercase tracking-[0.4em] hover-zoom">Session ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                </div>
                <button 
                  onClick={resetAudit}
                  className="px-8 py-3 rounded-full border border-neon-cyan/30 text-neon-cyan font-mono text-[10px] uppercase tracking-widest hover:bg-neon-cyan/10 transition-all flex items-center gap-3 group"
                >
                  <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                  New Audit
                </button>
              </div>

              {/* Immersive Hero Summary */}
              <div className="glass-card rounded-[40px] p-12 relative overflow-hidden scroll-reveal reveal-mask animate-[reveal-right_0.8s_ease_0.2s_forwards]">
                <SentimentWaveform />
                <div className="absolute top-0 right-0 p-12 opacity-5">
                  <Layers size={200} />
                </div>
                <div className="relative z-10 text-center max-w-4xl mx-auto">
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <div className={cn(
                      "w-4 h-4 rounded-full animate-pulse",
                      report.sentiment_analysis.overall_mood === 'Positive' ? "bg-sentiment-pos shadow-[0_0_15px_#00FF9C]" :
                      report.sentiment_analysis.overall_mood === 'Negative' ? "bg-sentiment-neg shadow-[0_0_15px_#FF2D78]" :
                      "bg-sentiment-neu shadow-[0_0_15px_#D4A85A]"
                    )} />
                    <span className="text-[12px] font-mono uppercase tracking-[0.6em] text-text-secondary hover-zoom">Audit Verdict</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display leading-relaxed mb-12 text-text-primary hover-zoom">
                    {report.executive_summary}
                  </h2>
                  
                  <div className="flex flex-wrap justify-center gap-16 pt-12 border-t border-wada-ink">
                    <div className="space-y-3 hover-zoom">
                      <div className="text-[11px] font-mono uppercase tracking-widest text-text-dim">Mood Polarity</div>
                      <div className={cn(
                        "text-4xl font-display uppercase tracking-widest drop-shadow-[0_0_10px_currentColor]",
                        report.sentiment_analysis.overall_mood === 'Positive' ? "text-sentiment-pos" :
                        report.sentiment_analysis.overall_mood === 'Negative' ? "text-sentiment-neg" :
                        "text-sentiment-neu"
                      )}>
                        {report.sentiment_analysis.overall_mood}
                      </div>
                    </div>
                    <div className="space-y-3 hover-zoom">
                      <div className="text-[11px] font-mono uppercase tracking-widest text-text-dim">Signals Extracted</div>
                      <div className="text-4xl font-mono text-neon-cyan">
                        <AnimatedCounter value={report.raw_counts.total_signals_analyzed} />
                      </div>
                    </div>
                    <div className="space-y-3 hover-zoom">
                      <div className="text-[11px] font-mono uppercase tracking-widest text-text-dim">Trend Projection</div>
                      <div className="flex items-center gap-4 text-4xl font-display tracking-widest text-text-primary">
                        {report.projections_and_risks.projected_trend === 'Improving' ? <TrendingUp className="text-sentiment-pos" /> : 
                         report.projections_and_risks.projected_trend === 'Worsening' ? <TrendingDown className="text-sentiment-neg" /> : 
                         <Activity className="text-sentiment-neu" />}
                        {report.projections_and_risks.projected_trend}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Neon Chart */}
                <motion.section 
                  className="glass-card rounded-[32px] p-10 scroll-reveal reveal-mask animate-[reveal-right_0.8s_ease_0.4s_forwards]"
                >
                  <div className="flex items-center gap-3 text-[12px] font-mono uppercase tracking-widest text-neon-cyan mb-10 hover-zoom">
                    <BarChart3 size={18} />
                    Sentiment Distribution
                  </div>
                  <div className="h-[300px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          innerRadius={80}
                          outerRadius={110}
                          paddingAngle={8}
                          dataKey="value"
                          stroke="none"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#0D0D1A', 
                            border: '1px solid rgba(0,245,255,0.2)',
                            borderRadius: '12px',
                            fontFamily: 'Share Tech Mono'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <div className="text-4xl font-mono text-neon-cyan hover-zoom">
                        <AnimatedCounter 
                          value={Math.max(...chartData.map(d => d.value))} 
                          suffix="%"
                        />
                      </div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-text-dim hover-zoom">Peak Signal</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-10">
                    {chartData.map((item, i) => (
                      <div key={i} className="text-center space-y-1 hover-zoom">
                        <div className="text-[10px] font-mono uppercase tracking-tighter text-text-dim">{item.name}</div>
                        <div className="text-xl font-mono" style={{ color: item.color }}>{item.value}%</div>
                      </div>
                    ))}
                  </div>
                </motion.section>

                {/* Themes */}
                <motion.section 
                  className="glass-card rounded-[32px] p-10 scroll-reveal reveal-mask animate-[reveal-right_0.8s_ease_0.6s_forwards]"
                >
                  <div className="flex items-center gap-3 text-[12px] font-mono uppercase tracking-widest text-wada-gold mb-10 hover-zoom">
                    <MessageSquare size={18} />
                    Neural Themes
                  </div>
                  <div className="space-y-5">
                    {report.key_discussion_themes.map((theme, i) => (
                      <motion.div 
                        key={i} 
                        className="flex items-center gap-5 p-5 rounded-2xl bg-bg-void/40 border border-wada-ink hover:border-wada-gold/40 transition-all group hover-zoom"
                      >
                        <div className="w-10 h-10 rounded-xl bg-wada-gold/10 text-wada-gold flex items-center justify-center text-sm font-mono border border-wada-gold/20 group-hover:scale-110 transition-transform">
                          {i + 1}
                        </div>
                        <span className="text-base font-display tracking-tight text-text-primary">{theme}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              </div>

              {/* Source Feed */}
              <motion.section 
                className="glass-card rounded-[40px] overflow-hidden scroll-reveal reveal-mask animate-[reveal-right_0.8s_ease_0.8s_forwards]"
              >
                <div className="px-10 py-8 border-b border-wada-ink flex items-center justify-between bg-bg-elevated/40">
                  <div className="flex items-center gap-3 text-[12px] font-mono uppercase tracking-widest text-neon-cyan hover-zoom">
                    <Radio size={18} className="animate-pulse" />
                    Live Signal Feed
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-text-dim hover-zoom">Real-time Extraction</div>
                </div>
                <div className="divide-y divide-wada-ink/30">
                  {report.sources_breakdown.map((source, i) => (
                    <motion.div 
                      key={i}
                      className="px-10 py-8 hover:bg-bg-elevated/20 transition-colors flex flex-col md:flex-row md:items-center gap-10 group hover-zoom"
                    >
                      <div className="md:w-64 shrink-0">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="p-3 rounded-xl bg-bg-void border border-wada-ink group-hover:border-neon-cyan/50 transition-colors shadow-inner">
                            {(() => {
                              const name = source.source_name.toLowerCase();
                              if (name.includes('twitter') || name.includes('x.com')) return <Twitter size={18} className="text-neon-cyan" />;
                              if (name.includes('reddit')) return <MessageCircle size={18} className="text-neon-magenta" />;
                              if (name.includes('log') || name.includes('system')) return <Terminal size={18} className="text-sentiment-pos" />;
                              if (name.includes('database') || name.includes('db')) return <Database size={18} className="text-wada-gold" />;
                              if (name.includes('server')) return <Server size={18} className="text-neon-cyan" />;
                              if (name.includes('report') || name.includes('audit')) return <Shield size={18} className="text-neon-magenta" />;
                              return <FileText size={18} className="text-text-dim" />;
                            })()}
                          </div>
                          <span className="text-sm font-display uppercase tracking-widest text-text-primary">{source.source_name}</span>
                        </div>
                        <div className={cn(
                          "text-[10px] font-mono uppercase px-3 py-1 rounded-full border inline-block font-bold",
                          source.sentiment === 'Positive' ? "text-sentiment-pos border-sentiment-pos bg-sentiment-pos/20 shadow-[0_0_10px_rgba(0,255,156,0.2)]" :
                          source.sentiment === 'Negative' ? "text-sentiment-neg border-sentiment-neg bg-sentiment-neg/20 shadow-[0_0_10px_rgba(255,45,120,0.2)]" :
                          "text-sentiment-neu border-sentiment-neu bg-sentiment-neu/20 shadow-[0_0_10px_rgba(212,168,90,0.2)]"
                        )}>
                          {source.sentiment}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-xl font-display italic text-text-secondary leading-relaxed group-hover:text-text-primary transition-colors">
                          "{source.key_quote}"
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Risks & Reasoning */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <motion.section 
                  className="glass-card rounded-[32px] p-10 border-l-8 border-l-neon-magenta scroll-reveal reveal-mask animate-[reveal-right_0.8s_ease_1s_forwards]"
                >
                  <div className="flex items-center gap-3 text-[12px] font-mono uppercase tracking-widest text-neon-magenta mb-10 hover-zoom">
                    <AlertTriangle size={18} />
                    Risk Vectors
                  </div>
                  <ul className="space-y-6">
                    {report.projections_and_risks.risk_factors.map((risk, i) => (
                      <li key={i} className="flex gap-5 text-base leading-relaxed hover-zoom">
                        <div className="w-2 h-2 rounded-full bg-neon-magenta mt-2 shrink-0 shadow-[0_0_12px_#FF2D78]" />
                        <span className="text-text-secondary">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </motion.section>
                <motion.section 
                  className="glass-card rounded-[32px] p-10 border-l-8 border-l-wada-gold scroll-reveal reveal-mask animate-[reveal-right_0.8s_ease_1.2s_forwards]"
                >
                  <div className="flex items-center gap-3 text-[12px] font-mono uppercase tracking-widest text-wada-gold mb-10 hover-zoom">
                    <BarChart3 size={18} />
                    Audit Logic
                  </div>
                  <p className="text-base font-mono leading-relaxed text-text-dim italic hover-zoom">
                    {report.sentiment_analysis.reasoning}
                  </p>
                </motion.section>
              </div>

              <div className="pt-16 flex justify-center reveal-mask animate-[reveal-right_0.8s_ease_1.4s_forwards]">
                <button 
                  onClick={resetAudit}
                  className="px-12 py-5 rounded-2xl bg-bg-elevated border border-wada-ink text-text-primary font-display uppercase tracking-[0.4em] hover:bg-neon-cyan hover:text-bg-void hover:shadow-[0_0_40px_rgba(0,229,255,0.4)] transition-all active:scale-95"
                >
                  Return to Command Center
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  )}

      {/* Footer */}
      <footer className="relative z-10 mt-20 border-t border-wada-ink p-12 text-center">
        <div className="text-[10px] font-mono uppercase tracking-[0.8em] text-text-dim opacity-40">
          Parsent Neo-Auditor • Quantum Decryption Active • 2026
        </div>
      </footer>
    </div>
  );
}
