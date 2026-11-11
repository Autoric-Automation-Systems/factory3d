"use client";

import { useEffect, useRef } from "react";
import type { Station } from "@/lib/types";
import { HALL } from "./World";
import type { PlayerPos } from "./GameCanvas";

export default function Minimap({
  stations,
  percents,
  posRef,
}: {
  stations: Station[];
  percents: Record<string, number>;
  posRef: React.RefObject<PlayerPos>;
}) {
  const marker = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      const el = marker.current;
      if (el) {
        const { x, z, yaw } = posRef.current;
        const left = ((x - HALL.minX) / (HALL.maxX - HALL.minX)) * 100;
        const top = ((z - HALL.minZ) / (HALL.maxZ - HALL.minZ)) * 100;
        el.style.left = `${left}%`;
        el.style.top = `${top}%`;
        el.style.transform = `translate(-50%, -50%) rotate(${(-yaw * 180) / Math.PI}deg)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [posRef]);

  return (
    <div className="minimap" aria-hidden>
      <div style={{ position: "absolute", inset: 0 }}>
        {stations.map((station) => {
          const percent = percents[station.id] ?? 0;
          return (
            <div
              key={station.id}
              className="dot"
              data-state={percent === 100 ? "done" : percent > 0 ? "visited" : "none"}
              style={{
                left: `${((station.position[0] - HALL.minX) / (HALL.maxX - HALL.minX)) * 100}%`,
                top: `${((station.position[1] - HALL.minZ) / (HALL.maxZ - HALL.minZ)) * 100}%`,
              }}
            />
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "50%",
            height: 1,
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <div ref={marker} className="player" style={{ left: "50%", top: "80%" }} />
      </div>
    </div>
  );
}
