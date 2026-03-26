import { useEffect, useMemo, useRef } from "react";

interface CelebrationFireworksProps {
  enabled: boolean;
  replayNonce: number;
}

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
};

const AUTO_PLAY_KEY = "memos-anniversary-fireworks-played";

const CelebrationFireworks = ({ enabled, replayNonce }: CelebrationFireworksProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const playingRef = useRef(false);
  const handledReplayNonceRef = useRef(0);

  const prefersReducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useEffect(() => {
    if (!enabled) {
      particlesRef.current = [];
      playingRef.current = false;
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const resizeCanvas = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const getFireworkColors = () => {
      const rootStyle = getComputedStyle(document.documentElement);
      const c1 = rootStyle.getPropertyValue("--celebration-spark-1").trim() || "oklch(0.79 0.16 57)";
      const c2 = rootStyle.getPropertyValue("--celebration-spark-2").trim() || "oklch(0.74 0.18 26)";
      const c3 = rootStyle.getPropertyValue("--celebration-spark-3").trim() || "oklch(0.86 0.12 92)";
      const c4 = rootStyle.getPropertyValue("--celebration-spark-4").trim() || "oklch(0.7 0.12 15)";
      return [c1, c2, c3, c4];
    };

    const launchBurst = (x: number, y: number, amount: number) => {
      const colors = getFireworkColors();
      for (let index = 0; index < amount; index += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.6 + Math.random() * 2.8;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          life: 0,
          maxLife: 45 + Math.random() * 35,
          size: 1.4 + Math.random() * 2.1,
          color: colors[Math.floor(Math.random() * colors.length)] || colors[0],
        });
      }
    };

    const runShow = (mode: "auto" | "manual") => {
      if (!enabled || playingRef.current) {
        return false;
      }

      if (mode === "auto" && prefersReducedMotion) {
        return false;
      }

      playingRef.current = true;
      particlesRef.current = [];

      const duration = mode === "manual" && prefersReducedMotion ? 1200 : 4200;
      const burstCount = mode === "manual" && prefersReducedMotion ? 1 : 5;
      const startTime = performance.now();
      let launched = 0;
      let nextBurstAt = startTime;

      const animate = (timestamp: number) => {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);

        if (launched < burstCount && timestamp >= nextBurstAt) {
          const x = mode === "manual" && prefersReducedMotion ? window.innerWidth * 0.5 : window.innerWidth * (0.12 + Math.random() * 0.76);
          const y =
            mode === "manual" && prefersReducedMotion ? window.innerHeight * 0.25 : window.innerHeight * (0.15 + Math.random() * 0.28);
          const amount = mode === "manual" && prefersReducedMotion ? 30 : 52;
          launchBurst(x, y, amount);
          launched += 1;
          nextBurstAt = timestamp + 260;
        }

        particlesRef.current = particlesRef.current.filter((particle) => {
          const progress = particle.life / particle.maxLife;
          if (progress >= 1) {
            return false;
          }

          particle.life += 1;
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.vx *= 0.988;
          particle.vy += 0.034;

          context.globalAlpha = Math.max(0, 1 - progress);
          context.fillStyle = particle.color;
          context.beginPath();
          context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          context.fill();

          return true;
        });

        context.globalAlpha = 1;

        const elapsed = timestamp - startTime;
        if (elapsed < duration || particlesRef.current.length > 0) {
          animationRef.current = requestAnimationFrame(animate);
          return;
        }

        playingRef.current = false;
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      };

      animationRef.current = requestAnimationFrame(animate);
      return true;
    };

    const hasAutoPlayed = sessionStorage.getItem(AUTO_PLAY_KEY) === "1";
    if (!hasAutoPlayed) {
      const didStartAuto = runShow("auto");
      if (didStartAuto) {
        sessionStorage.setItem(AUTO_PLAY_KEY, "1");
      }
    }

    if (replayNonce > handledReplayNonceRef.current) {
      handledReplayNonceRef.current = replayNonce;
      runShow("manual");
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particlesRef.current = [];
      playingRef.current = false;
    };
  }, [enabled, replayNonce, prefersReducedMotion]);

  if (!enabled) {
    return null;
  }

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-40" />;
};

export default CelebrationFireworks;
