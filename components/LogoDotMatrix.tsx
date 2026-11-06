"use client";

import { useEffect, useRef } from "react";
import { LOGO_DOTS } from "@/lib/logoDots";

type Props = {
  className?: string;
  // Dot radius as a fraction of the grid cell (0.5 = neighbouring dots touch).
  dotRadius?: number;
};

// Hover lens, in grid cells. Dots under the cursor scale by (1 + GROW).
const GROW = 0.5;
const HOVER_RADIUS = 5;

// A dot's radius never exceeds this fraction of the distance to its nearest
// neighbour, so pulse + lens + spring overshoot can't make dots overlap.
const MAX_FILL = 0.45;

// Spring per dot: STIFFNESS pulls toward the target, DAMPING < 1 bleeds off velocity.
// Lower damping = more wobble.
const STIFFNESS = 0.12;
const DAMPING = 0.75;
const EPSILON = 1e-3;

// Idle "ocean" pulse: radius scales by 1 + PULSE * wave, wave in [-1, 1].
// Each component travels along a row; rowShift offsets its phase per row so swells
// roll diagonally. k = rad per column, speed = rad per second, amps sum to 1.
const PULSE = 0.2;
const WAVES = [
  { amp: 0.6, k: 0.3, speed: 5.0, rowShift: 0.35 },
  { amp: 0.25, k: 0.55, speed: -6.5, rowShift: -0.2 },
  { amp: 0.15, k: 0.12, speed: 3.0, rowShift: 0.6 },
];

export default function LogoDotMatrix({ className, dotRadius = 0.35 }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { cols, rows, dots } = LOGO_DOTS;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const circles = Array.from(svg.querySelectorAll("circle"));
    const n = dots.length;
    const col = Float32Array.from(dots, ([c]) => c);
    const row = Float32Array.from(dots, ([, r]) => r);
    const homeX = col.map((c) => c + 0.5);
    const homeY = row.map((r) => r + 0.5);
    const x = Float32Array.from(homeX);
    const y = Float32Array.from(homeY);
    // Cursor-driven scale (springs back to 1); the pulse multiplies on top of it.
    const s = new Float32Array(n).fill(1);
    const vx = new Float32Array(n);
    const vy = new Float32Array(n);
    const vs = new Float32Array(n);

    // Indices of each dot's (up to 8) adjacent grid dots, for the overlap clamp.
    const indexOf = new Map(dots.map(([c, r], i) => [`${c},${r}`, i]));
    const neighbors = dots.map(([c, r]) => {
      const list: number[] = [];
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const j = indexOf.get(`${c + dc},${r + dr}`);
          if (j !== undefined && (dr || dc)) list.push(j);
        }
      }
      return list;
    });

    let cursor: { x: number; y: number } | null = null;
    let frame = 0;

    const tick = (now: number) => {
      const t = now / 1000;

      for (let i = 0; i < n; i++) {
        let tx = homeX[i];
        let ty = homeY[i];
        let ts = 1;

        if (cursor) {
          // Fisheye lens: a dot at distance d moves to d * (1 + GROW * e^(-q)), q = (d/R)^2.
          // That stretches local spacing by 1 + GROW * (1 - 2q) * e^(-q) along the radius,
          // so growing each dot by the same factor keeps it from touching its neighbours.
          const dx = homeX[i] - cursor.x;
          const dy = homeY[i] - cursor.y;
          const q = (dx * dx + dy * dy) / (HOVER_RADIUS * HOVER_RADIUS);
          if (q < 9) {
            const falloff = Math.exp(-q);
            tx += dx * GROW * falloff;
            ty += dy * GROW * falloff;
            ts = Math.max(1, 1 + GROW * (1 - 2 * q) * falloff);
          }
        }

        vx[i] = (vx[i] + (tx - x[i]) * STIFFNESS) * DAMPING;
        vy[i] = (vy[i] + (ty - y[i]) * STIFFNESS) * DAMPING;
        vs[i] = (vs[i] + (ts - s[i]) * STIFFNESS) * DAMPING;
        s[i] += vs[i];

        const settled =
          Math.abs(tx - x[i]) + Math.abs(ty - y[i]) < EPSILON &&
          Math.abs(vx[i]) + Math.abs(vy[i]) < EPSILON;
        if (!settled) {
          x[i] += vx[i];
          y[i] += vy[i];
          circles[i].setAttribute("cx", x[i].toFixed(3));
          circles[i].setAttribute("cy", y[i].toFixed(3));
        } else if (x[i] !== tx || y[i] !== ty) {
          x[i] = tx;
          y[i] = ty;
          vx[i] = vy[i] = 0;
          circles[i].setAttribute("cx", x[i].toFixed(3));
          circles[i].setAttribute("cy", y[i].toFixed(3));
        }
      }

      // Radii in a second pass, once every dot has its new position.
      for (let i = 0; i < n; i++) {
        let wave = 0;
        for (const w of WAVES) {
          wave += w.amp * Math.sin(w.k * col[i] - w.speed * t + w.rowShift * row[i]);
        }

        let nearest = Infinity;
        for (const j of neighbors[i]) {
          nearest = Math.min(nearest, Math.hypot(x[i] - x[j], y[i] - y[j]));
        }

        const radius = Math.min(dotRadius * s[i] * (1 + PULSE * wave), MAX_FILL * nearest);
        circles[i].setAttribute("r", radius.toFixed(3));
      }

      frame = requestAnimationFrame(tick);
    };

    const onPointerMove = (e: PointerEvent) => {
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
      cursor = { x: p.x, y: p.y };
    };

    const release = () => {
      cursor = null;
    };

    // Touch has no hover, so let go when the finger lifts.
    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") release();
    };

    const root = document.documentElement;
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", release);
    root.addEventListener("pointerleave", release);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", release);
      root.removeEventListener("pointerleave", release);
    };
  }, [dots, dotRadius]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${cols} ${rows}`}
      className={className}
      overflow="visible"
      fill="currentColor"
      role="img"
      aria-label="Carson Duffy logo"
    >
      {dots.map(([c, r]) => (
        <circle key={`${c}-${r}`} cx={c + 0.5} cy={r + 0.5} r={dotRadius} />
      ))}
    </svg>
  );
}
