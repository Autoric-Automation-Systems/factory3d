"use client";

import { useRef } from "react";
import type { TouchVector } from "./Player";

export default function Joystick({
  moveRef,
}: {
  moveRef: React.RefObject<TouchVector>;
}) {
  const knob = useRef<HTMLDivElement>(null);
  const base = useRef<HTMLDivElement>(null);
  const active = useRef(false);

  const update = (clientX: number, clientY: number) => {
    const el = base.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const max = rect.width / 2 - 24;
    const dist = Math.hypot(dx, dy);
    const clamp = dist > max ? max / dist : 1;
    const x = dx * clamp;
    const y = dy * clamp;
    moveRef.current.x = x / max;
    moveRef.current.y = y / max;
    if (knob.current) knob.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  const reset = () => {
    active.current = false;
    moveRef.current.x = 0;
    moveRef.current.y = 0;
    if (knob.current) knob.current.style.transform = "translate(0px, 0px)";
  };

  return (
    <div
      ref={base}
      className="joystick"
      onPointerDown={(event) => {
        event.stopPropagation();
        active.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        update(event.clientX, event.clientY);
      }}
      onPointerMove={(event) => {
        if (!active.current) return;
        event.stopPropagation();
        update(event.clientX, event.clientY);
      }}
      onPointerUp={reset}
      onPointerCancel={reset}
      onPointerLeave={reset}
    >
      <div ref={knob} className="knob" style={{ transform: "translate(0px, 0px)" }} />
    </div>
  );
}
