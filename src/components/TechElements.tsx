import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronDown, Globe, Shield, Zap, Cpu, Radio, Github, Twitter, Linkedin, Mail, ExternalLink, Lock, Share2, ChevronRight, Instagram } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const TechGrid = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1c1c3a_1px,transparent_1px),linear-gradient(to_bottom,#1c1c3a_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1c1c3a_1px,transparent_1px),linear-gradient(to_bottom,#1c1c3a_1px,transparent_1px)] bg-[size:200px_200px] border border-neon-cyan/10" />
      
      {/* Coordinate Labels */}
      <div className="absolute top-4 left-4 font-mono text-[8px] text-neon-cyan/40 uppercase tracking-widest">
        Sector: 7G-Neural // Lat: 34.0522 // Long: -118.2437
      </div>
      <div className="absolute bottom-4 right-4 font-mono text-[8px] text-neon-cyan/40 uppercase tracking-widest">
        Buffer: 0x8F2A // Status: Synchronized
      </div>
    </div>
  );
};

export const DataStream = () => {
  const [streams, setStreams] = useState<{ id: number; left: string; delay: number; duration: number }[]>([]);

  useEffect(() => {
    const newStreams = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 20,
      duration: 10 + Math.random() * 15,
    }));
    setStreams(newStreams);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
      {streams.map((stream) => (
        <motion.div
          key={stream.id}
          initial={{ y: '-100%' }}
          animate={{ y: '200%' }}
          transition={{
            duration: stream.duration,
            repeat: Infinity,
            delay: stream.delay,
            ease: "linear"
          }}
          className="absolute w-[1px] h-32 bg-gradient-to-b from-transparent via-neon-cyan to-transparent"
          style={{ left: stream.left }}
        />
      ))}
    </div>
  );
};

export const TechConnector = ({ isActive, index }: { isActive: boolean; index: number }) => {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px hidden md:block">
      {/* Main Line */}
      <div className="absolute inset-0 bg-wada-ink/30" />
      
      {/* Animated Pulse */}
      {isActive && (
        <motion.div
          initial={{ top: '0%' }}
          animate={{ top: '100%' }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute w-px h-20 bg-gradient-to-b from-transparent via-neon-cyan to-transparent shadow-[0_0_10px_#00E5FF]"
        />
      )}

      {/* Cross-hairs and Micro Labels */}
      <div className="absolute top-1/4 left-0 -translate-x-1/2 flex flex-col items-center">
        <div className="w-4 h-[1px] bg-neon-cyan/20" />
        <div className="h-4 w-[1px] bg-neon-cyan/20 -mt-2" />
        <div className="font-mono text-[6px] text-neon-cyan/40 mt-1">COORD_X: {Math.floor(Math.random() * 1000)}</div>
      </div>

      <div className="absolute top-3/4 left-0 -translate-x-1/2 flex flex-col items-center">
        <div className="w-4 h-[1px] bg-neon-cyan/20" />
        <div className="h-4 w-[1px] bg-neon-cyan/20 -mt-2" />
        <div className="font-mono text-[6px] text-neon-cyan/40 mt-1">COORD_Y: {Math.floor(Math.random() * 1000)}</div>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 left-4 whitespace-nowrap">
        <motion.div
          animate={isActive ? { opacity: [0.2, 1, 0.2] } : { opacity: 0.1 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="font-mono text-[8px] text-neon-cyan uppercase tracking-tighter bg-bg-void/80 px-2 py-1 border border-neon-cyan/10 rounded"
        >
          Node_Link_{index.toString().padStart(2, '0')} // Signal_Strength: 98% // Latency: 12ms
        </motion.div>
      </div>
    </div>
  );
};

export const FloatingFragment = ({ delay = 0 }: { delay?: number }) => {
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 0.3, scale: 1 }}
      transition={{ delay, duration: 1 }}
      className="absolute pointer-events-none select-none"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className="border border-neon-cyan/20 p-2 rounded bg-bg-void/40 backdrop-blur-sm">
        <div className="font-mono text-[6px] text-neon-cyan/60 uppercase">
          0x{Math.random().toString(16).substring(2, 6).toUpperCase()}
        </div>
        <div className="w-8 h-[1px] bg-neon-cyan/20 my-1" />
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-neon-cyan/40 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export const CodeRain = () => {
  const [columns, setColumns] = useState<{ id: number; left: string; chars: string[]; duration: number; delay: number }[]>([]);

  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*()_+-=[]{}|;:,.<>?";
    const newColumns = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${(i / 40) * 100}%`,
      chars: Array.from({ length: 20 }).map(() => chars[Math.floor(Math.random() * chars.length)]),
      duration: 5 + Math.random() * 10,
      delay: Math.random() * 5,
    }));
    setColumns(newColumns);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03] select-none">
      {columns.map((col) => (
        <motion.div
          key={col.id}
          initial={{ y: '-100%' }}
          animate={{ y: '100%' }}
          transition={{
            duration: col.duration,
            repeat: Infinity,
            delay: col.delay,
            ease: "linear"
          }}
          className="absolute flex flex-col items-center font-mono text-[10px] text-neon-cyan"
          style={{ left: col.left }}
        >
          {col.chars.map((char, j) => (
            <span key={j} className="my-1">{char}</span>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export const ScrollNavigator = () => {
  const sections = [
    { id: 'hero', label: 'Neural Core' },
    { id: 'how-it-works', label: 'Protocol' },
    { id: 'step-0', label: 'Capture' },
    { id: 'step-1', label: 'Process' },
    { id: 'step-2', label: 'Map' },
    { id: 'step-3', label: 'Audit' },
    { id: 'final-cta', label: 'Launch' },
  ];

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col gap-6 items-end group">
      {sections.map((section, i) => (
        <button
          key={section.id}
          onClick={() => scrollTo(section.id)}
          className="flex items-center gap-4 group/btn"
        >
          <span className="font-mono text-[10px] text-neon-cyan/0 group-hover/btn:text-neon-cyan/60 transition-all uppercase tracking-widest translate-x-4 group-hover/btn:translate-x-0">
            {section.label}
          </span>
          <div className="relative w-2 h-2">
            <div className="absolute inset-0 border border-neon-cyan/30 rounded-full group-hover/btn:border-neon-cyan transition-colors" />
            <div className="absolute inset-[2px] bg-neon-cyan/20 rounded-full group-hover/btn:bg-neon-cyan group-hover/btn:shadow-[0_0_10px_#00E5FF] transition-all" />
          </div>
        </button>
      ))}
      
      {/* Vertical Rail */}
      <div className="absolute right-[3px] top-0 bottom-0 w-[1px] bg-neon-cyan/10 -z-10" />
    </div>
  );
};

export const NeuralNetwork = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
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

    const nodes = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.1)';
      ctx.lineWidth = 0.5;

      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 229, 255, 0.3)';
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const node2 = nodes[j];
          const dist = Math.sqrt((node.x - node2.x) ** 2 + (node.y - node2.y) ** 2);
          if (dist < 200) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(node2.x, node2.y);
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-30 z-0" />;
};

export const TerminalGalaxy = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Star Field */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.05)_0%,transparent_70%)]" />
      
      {/* Floating Nebula Clouds */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
          rotate: [0, 10, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-neon-cyan/5 blur-[120px] rounded-full"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.15, 0.05],
          rotate: [0, -15, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-neon-violet/5 blur-[100px] rounded-full"
      />

      {/* Distant Stars */}
      {[...Array(150)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: Math.random() }}
          animate={{ 
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1]
          }}
          transition={{ duration: 2 + Math.random() * 4, repeat: Infinity }}
          className="absolute w-[1px] h-[1px] bg-white rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Shooting Stars */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`shooting-${i}`}
          initial={{ x: '-100%', y: '0%', opacity: 0 }}
          animate={{ 
            x: '200%', 
            y: '100%',
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 1 + Math.random() * 2, 
            repeat: Infinity, 
            delay: Math.random() * 10,
            ease: "easeIn"
          }}
          className="absolute w-32 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent rotate-[30deg]"
          style={{
            top: `${Math.random() * 50}%`,
            left: `${Math.random() * 50}%`,
          }}
        />
      ))}

      {/* Flashy Tech Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] opacity-10">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border border-neon-cyan/20 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[10%] border border-neon-violet/10 rounded-full border-dashed"
        />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[20%] border border-wada-gold/5 rounded-full"
        />
      </div>

      {/* Neural Pulse Lines */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`pulse-${i}`}
            animate={{ 
              opacity: [0, 0.5, 0],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.7 }}
            className="absolute inset-0 border border-neon-cyan/10 rounded-full"
            style={{ transform: `scale(${0.5 + i * 0.2})` }}
          />
        ))}
      </div>
    </div>
  );
};

export const TechNavButton = () => {
  const sections = ['hero', 'how-it-works', 'step-0', 'step-1', 'step-2', 'step-3', 'final-cta'];
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    const nextIdx = (currentIndex + 1) % sections.length;
    setCurrentIndex(nextIdx);
    const el = document.getElementById(sections[nextIdx]);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.85 }}
      onClick={next}
      className="fixed bottom-12 right-12 z-[200] w-32 h-32 flex items-center justify-center group"
    >
      {/* Extreme Outer Rotating Rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border-[0.5px] border-neon-cyan/10 rounded-full group-hover:border-neon-cyan/40 transition-colors"
      >
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-neon-cyan/20 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${i * 30}deg) translate(64px, 0)`
            }}
          />
        ))}
      </motion.div>

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute inset-4 border-2 border-neon-cyan/20 rounded-full border-dashed group-hover:border-neon-cyan/60 transition-colors"
      />
      
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute inset-8 border border-neon-violet/20 rounded-full border-dotted group-hover:border-neon-violet/60 transition-colors"
      />
      
      {/* Inner Core - More Complex */}
      <div className="relative w-20 h-20 bg-bg-void/90 backdrop-blur-xl border-2 border-neon-cyan/40 rounded-full flex flex-col items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(0,229,255,0.3)] group-hover:shadow-[0_0_80px_rgba(0,229,255,0.6)] transition-all border-double">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.15),transparent_70%)]" />
        
        {/* Animated Hex Grid Background */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] animate-pulse" />

        {/* Icon and Micro Text */}
        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="text-neon-cyan group-hover:text-white transition-colors" size={28} />
          </motion.div>
          <div className="flex flex-col items-center -mt-1">
            <span className="font-mono text-[8px] text-neon-cyan font-bold uppercase tracking-tighter">PHASE</span>
            <span className="font-mono text-[12px] text-white font-black leading-none">{(currentIndex + 1).toString().padStart(2, '0')}</span>
          </div>
        </div>
        
        {/* Double Scanning Lines */}
        <motion.div
          animate={{ top: ['-100%', '200%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[2px] bg-neon-cyan shadow-[0_0_15px_#00E5FF]"
        />
        <motion.div
          animate={{ top: ['200%', '-100%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[1px] bg-neon-violet opacity-50"
        />
      </div>

      {/* Floating Labels - More Detailed */}
      <div className="absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
        <div className="flex flex-col items-center gap-1">
          <div className="bg-bg-void/95 border border-neon-cyan/40 px-4 py-1.5 rounded-sm text-[10px] font-mono text-neon-cyan uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(0,229,255,0.3)] backdrop-blur-md">
            INITIATE_PHASE_TRANSITION
          </div>
          <div className="text-[8px] font-mono text-neon-cyan/40 uppercase tracking-widest">Target: {sections[(currentIndex + 1) % sections.length].replace('-', '_')}</div>
        </div>
      </div>

      {/* Decorative Crosshairs */}
      <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-8 h-[1px] bg-neon-cyan/40 group-hover:w-12 transition-all" />
      <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-8 h-[1px] bg-neon-cyan/40 group-hover:w-12 transition-all" />
      <div className="absolute left-1/2 -top-6 -translate-x-1/2 w-[1px] h-8 bg-neon-cyan/40 group-hover:h-12 transition-all" />
      <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 w-[1px] h-8 bg-neon-cyan/40 group-hover:h-12 transition-all" />

      {/* Pulsing Outer Glow */}
      <div className="absolute inset-0 rounded-full bg-neon-cyan/5 animate-ping -z-10" />
    </motion.button>
  );
};

export const JarvisHUD = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
      {/* Rotating Rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-[600px] h-[600px] border border-neon-cyan/10 rounded-full"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-neon-cyan/40" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-neon-cyan/40" />
      </motion.div>
      
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute w-[500px] h-[500px] border border-neon-violet/10 rounded-full border-dashed"
      />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute w-[800px] h-[800px] border-[0.5px] border-neon-cyan/5 rounded-full"
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-[0.5px] bg-neon-cyan/20"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${i * 45}deg) translate(400px, 0)`
            }}
          />
        ))}
      </motion.div>

      {/* Scanning Corners */}
      <div className="absolute top-10 left-10 w-32 h-32 border-t border-l border-neon-cyan/20">
        <div className="absolute top-0 left-0 w-4 h-4 bg-neon-cyan/40" />
      </div>
      <div className="absolute top-10 right-10 w-32 h-32 border-t border-r border-neon-cyan/20">
        <div className="absolute top-0 right-0 w-4 h-4 bg-neon-cyan/40" />
      </div>
      <div className="absolute bottom-10 left-10 w-32 h-32 border-b border-l border-neon-cyan/20">
        <div className="absolute bottom-0 left-0 w-4 h-4 bg-neon-cyan/40" />
      </div>
      <div className="absolute bottom-10 right-10 w-32 h-32 border-b border-r border-neon-cyan/20">
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-neon-cyan/40" />
      </div>
    </div>
  );
};

export const Logo = ({ size = 40, glow = false }: { size?: number; glow?: boolean }) => {
  return (
    <div 
      className={cn(
        "relative flex items-center justify-center",
        glow && "drop-shadow-[0_0_15px_rgba(0,255,156,0.6)]"
      )}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Stylized 'P' based on the provided image */}
        <motion.path
          d="M30 20 V80 H45 V55 H70 L80 45 V20 H30 Z M45 35 H65 V45 H45 V35 Z"
          fill="none"
          stroke="#00FF9C"
          strokeWidth="4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          d="M30 20 L80 20 L80 45 L70 55 L45 55 L45 80 L30 80 Z"
          fill="rgba(0, 255, 156, 0.1)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        />
        {/* Inner detail */}
        <rect x="45" y="35" width="20" height="10" fill="rgba(0, 255, 156, 0.2)" stroke="#00FF9C" strokeWidth="1" />
      </svg>
    </div>
  );
};

export const Navbar = ({ onEnter }: { onEnter: () => void }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] px-8 py-6 flex items-center justify-between bg-gradient-to-bottom from-bg-void to-transparent backdrop-blur-sm">
      <div className="flex items-center gap-4 group cursor-pointer">
        <div className="relative">
          <div className="absolute inset-0 bg-neon-cyan blur-md opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
          <Logo size={40} glow />
        </div>
        <div className="flex flex-col">
          <span className="font-display font-bold text-white tracking-tighter text-xl leading-none group-hover:text-neon-cyan transition-colors">PARSENT</span>
          <span className="font-mono text-[8px] text-neon-cyan tracking-[0.4em] uppercase">Neural Intelligence</span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-12">
        {[
          { name: 'Protocol', id: 'how-it-works' },
          { name: 'Features', id: 'step-1' },
          { name: 'Network', id: 'step-2' },
          { name: 'Security', id: 'step-3' }
        ].map((item) => (
          <button 
            key={item.name}
            onClick={() => {
              const el = document.getElementById(item.id);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="font-mono text-[10px] text-text-secondary hover:text-neon-cyan uppercase tracking-widest transition-colors relative group"
          >
            {item.name}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-neon-cyan transition-all group-hover:w-full" />
          </button>
        ))}
      </div>

      <motion.button 
        whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0,229,255,0.4)" }}
        whileTap={{ scale: 0.95 }}
        onClick={onEnter}
        className="relative overflow-hidden px-8 py-3 bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan font-mono text-[11px] uppercase tracking-[0.3em] font-bold transition-all group"
      >
        <div className="absolute inset-0 bg-neon-cyan/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
        <span className="relative z-10">Access Terminal</span>
      </motion.button>
    </nav>
  );
};

export const Footer = () => {
  return (
    <footer className="relative z-10 bg-bg-void/80 border-t border-wada-ink pt-24 pb-12 px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <span className="font-display font-bold text-white text-2xl tracking-tighter">PARSENT</span>
          </div>
          <p className="text-text-secondary/60 text-sm font-light leading-relaxed">
            Advanced neural intelligence for real-time emotional frequency decoding across global digital streams.
          </p>
          <div className="flex gap-4">
            <a href="https://github.com/codingyash9-bit" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-wada-ink flex items-center justify-center text-text-dim hover:text-neon-cyan hover:border-neon-cyan transition-all">
              <Github size={18} />
            </a>
            <a href="https://www.instagram.com/coding_yash/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-wada-ink flex items-center justify-center text-text-dim hover:text-neon-cyan hover:border-neon-cyan transition-all">
              <Instagram size={18} />
            </a>
            <a href="https://www.linkedin.com/in/yash-mahadeshvar-bb1669280/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-wada-ink flex items-center justify-center text-text-dim hover:text-neon-cyan hover:border-neon-cyan transition-all">
              <Linkedin size={18} />
            </a>
            <a href="mailto:codingyash9@gmail.com" className="w-10 h-10 rounded-full border border-wada-ink flex items-center justify-center text-text-dim hover:text-neon-cyan hover:border-neon-cyan transition-all">
              <Mail size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-mono text-xs text-white uppercase tracking-widest mb-8">System Architecture</h4>
          <ul className="space-y-4">
            {['Neural Core', 'Signal Capture', 'Processing Pipeline', 'Sentiment Mapping', 'Audit Engine'].map((item) => (
              <li key={item}>
                <button className="text-text-dim hover:text-neon-cyan text-sm font-light transition-colors">{item}</button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-xs text-white uppercase tracking-widest mb-8">Resources</h4>
          <ul className="space-y-4">
            {['Documentation', 'API Reference', 'Security Whitepaper', 'Network Status', 'Privacy Protocol'].map((item) => (
              <li key={item}>
                <button className="text-text-dim hover:text-neon-cyan text-sm font-light transition-colors">{item}</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-8">
          <div>
            <h4 className="font-mono text-xs text-white uppercase tracking-widest mb-4">System Status</h4>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse shadow-[0_0_10px_#00E5FF]" />
              <span className="font-mono text-[10px] text-neon-cyan uppercase tracking-widest">All Nodes Operational</span>
            </div>
          </div>
          <div className="p-4 border border-wada-ink bg-bg-elevated/30 rounded-sm">
            <span className="font-mono text-[8px] text-text-dim uppercase tracking-widest block mb-2">Network Load</span>
            <div className="w-full h-1 bg-wada-ink rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: ['40%', '65%', '55%'] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="h-full bg-neon-cyan" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-12 border-t border-wada-ink flex flex-col md:flex-row justify-between items-center gap-6">
        <span className="font-mono text-[10px] text-text-dim uppercase tracking-widest">
          © 2026 PARSENT NEURAL SYSTEMS // ALL RIGHTS RESERVED
        </span>
        <div className="flex gap-8">
          {['Terms', 'Privacy', 'Cookies', 'Legal'].map((item) => (
            <button key={item} className="font-mono text-[10px] text-text-dim hover:text-white uppercase tracking-widest transition-colors">
              {item}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
};
