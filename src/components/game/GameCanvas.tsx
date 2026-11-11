"use client";

import { Canvas } from "@react-three/fiber";
import type { Station } from "@/lib/types";
import { World } from "./World";
import Player, { type TouchVector } from "./Player";

export type PlayerPos = { x: number; z: number; yaw: number };

export default function GameCanvas({
  stations,
  percents,
  nearbyId,
  paused,
  spawn,
  moveRef,
  lookRef,
  posRef,
  onNearby,
  onInteract,
}: {
  stations: Station[];
  percents: Record<string, number>;
  nearbyId: string | null;
  paused: boolean;
  spawn: [number, number];
  moveRef: React.RefObject<TouchVector>;
  lookRef: React.RefObject<TouchVector>;
  posRef: React.RefObject<PlayerPos>;
  onNearby: (id: string | null) => void;
  onInteract: () => void;
}) {
  return (
    <Canvas
      className="game-canvas"
      dpr={[1, 1.7]}
      camera={{ fov: 74, near: 0.1, far: 220, position: [spawn[0], 1.68, spawn[1]] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <World stations={stations} percents={percents} nearbyId={nearbyId} />
      <Player
        stations={stations}
        paused={paused}
        spawn={spawn}
        moveRef={moveRef}
        lookRef={lookRef}
        posRef={posRef}
        onNearby={onNearby}
        onInteract={onInteract}
      />
    </Canvas>
  );
}
