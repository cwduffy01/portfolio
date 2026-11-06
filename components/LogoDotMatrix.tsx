"use client";

import { useEffect, useRef } from "react";
import { LOGO_DOTS } from "@/lib/logoDots";

type Props = {
  className?: string;
  // Dot radius as a fraction of the grid cell (0.5 = neighbouring dots touch).
  dotRadius?: number;
};

// Hover lens, in grid cells. Dots under the cursor scale by (1 + GROW).
// GROW must stay below ~0.6: the lens squeezes the ring around it to 1 - 0.446 * GROW
// of normal spacing, and dots there must still fit (2 * dotRadius).
const GROW = 0.5;
const HOVER_RADIUS = 5;

// Spring per dot: STIFFNESS pulls toward the target, DAMPING < 1 bleeds off velocity.
// Lower damping = more wobble.
const STIFFNESS = 0.12;
const DAMPING = 0.75;
const EPSILON = 1e-3;

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
    const homeX = Float32Array.from(dots, ([c]) => c + 0.5);
    const homeY = Float32Array.from(dots, ([, r]) => r + 0.5);
    const x = Float32Array.from(homeX);
    const y = Float32Array.from(homeY);
    const r = new Float32Array(n).fill(dotRadius);
    const vx = new Float32Array(n);
    const vy = new Float32Array(n);
    const vr = new Float32Array(n);

    let cursor: { x: number; y: number } | null = null;
    let frame = 0;

    const tick = () => {
      let moving = false;

      for (let i = 0; i < n; i++) {
        let tx = homeX[i];
        let ty = homeY[i];
        let tr = dotRadius;

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
            tr *= Math.max(1, 1 + GROW * (1 - 2 * q) * falloff);
          }
        }

        vx[i] = (vx[i] + (tx - x[i]) * STIFFNESS) * DAMPING;
        vy[i] = (vy[i] + (ty - y[i]) * STIFFNESS) * DAMPING;
        vr[i] = (vr[i] + (tr - r[i]) * STIFFNESS) * DAMPING;

        const settled =
          Math.abs(tx - x[i]) + Math.abs(ty - y[i]) + Math.abs(tr - r[i]) < EPSILON &&
          Math.abs(vx[i]) + Math.abs(vy[i]) + Math.abs(vr[i]) < EPSILON;
        if (settled) {
          if (x[i] === tx && y[i] === ty && r[i] === tr) continue;
          x[i] = tx;
          y[i] = ty;
          r[i] = tr;
          vx[i] = vy[i] = vr[i] = 0;
        } else {
          x[i] += vx[i];
          y[i] += vy[i];
          r[i] += vr[i];
          moving = true;
        }

        circles[i].setAttribute("cx", x[i].toFixed(3));
        circles[i].setAttribute("cy", y[i].toFixed(3));
        circles[i].setAttribute("r", r[i].toFixed(3));
      }

      frame = moving ? requestAnimationFrame(tick) : 0;
    };

    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onPointerMove = (e: PointerEvent) => {
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
      cursor = { x: p.x, y: p.y };
      wake();
    };

    const release = () => {
      cursor = null;
      wake();
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
