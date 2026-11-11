"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MachineKind } from "@/lib/types";

const METAL = "#7d8d9a";
const STEEL = "#57707f";
const DARK = "#28333d";
const BLUE = "#2f6fa8";
const YELLOW = "#ffc53d";
const WATER = "#3aa0e0";
const CLEAN = "#c8d6df";

type Vec = [number, number, number];

function Box({
  p,
  s,
  c = METAL,
  metal = 0.35,
  rough = 0.5,
  e,
}: {
  p: Vec;
  s: Vec;
  c?: string;
  metal?: number;
  rough?: number;
  e?: string;
}) {
  return (
    <mesh position={p}>
      <boxGeometry args={s} />
      <meshStandardMaterial
        color={c}
        metalness={metal}
        roughness={rough}
        emissive={e ?? "#000000"}
        emissiveIntensity={e ? 0.85 : 0}
      />
    </mesh>
  );
}

function Cyl({
  p,
  r,
  h,
  c = METAL,
  axis = "y",
  metal = 0.4,
  rough = 0.45,
  e,
}: {
  p: Vec;
  r: number;
  h: number;
  c?: string;
  axis?: "x" | "y" | "z";
  metal?: number;
  rough?: number;
  e?: string;
}) {
  const rotation: Vec =
    axis === "y" ? [0, 0, 0] : axis === "x" ? [0, 0, Math.PI / 2] : [Math.PI / 2, 0, 0];
  return (
    <mesh position={p} rotation={rotation}>
      <cylinderGeometry args={[r, r, h, 20]} />
      <meshStandardMaterial
        color={c}
        metalness={metal}
        roughness={rough}
        emissive={e ?? "#000000"}
        emissiveIntensity={e ? 0.9 : 0}
      />
    </mesh>
  );
}

function Skid() {
  return (
    <group>
      <Box p={[0, 0.06, 0]} s={[4, 0.12, 3.2]} c={DARK} metal={0.2} rough={0.9} />
      <Box p={[0, 0.16, -1.42]} s={[3.8, 0.2, 0.16]} c={YELLOW} metal={0.1} rough={0.8} />
    </group>
  );
}

function WellMachine() {
  return (
    <group>
      <Skid />
      <Cyl p={[0.6, 0.7, 0]} r={0.62} h={1.2} c={CLEAN} metal={0.15} rough={0.7} />
      <Cyl p={[0.6, 1.55, 0]} r={0.34} h={0.55} c={STEEL} />
      <Cyl p={[0.6, 2.2, 0]} r={0.13} h={1.4} c={YELLOW} metal={0.6} rough={0.35} />
      <Cyl p={[0.6, 2.9, -0.9]} r={0.13} h={1.8} c={YELLOW} axis="z" metal={0.6} rough={0.35} />
      <Box p={[0.6, 3.0, -1.8]} s={[0.35, 0.35, 0.6]} c={STEEL} />
      <Box p={[-1.35, 1.0, 0.2]} s={[0.9, 1.7, 0.4]} c={DARK} metal={0.2} rough={0.8} />
      <Box p={[-1.35, 1.6, 0.42]} s={[0.55, 0.3, 0.05]} c={"#0f1a21"} e={"#35d07f"} />
      <Cyl p={[-0.4, 0.55, 0.2]} r={0.3} h={0.9} c={BLUE} />
      <Box p={[-0.4, 1.08, 0.2]} s={[0.5, 0.18, 0.5]} c={STEEL} />
    </group>
  );
}

function FiltersMachine() {
  return (
    <group>
      <Skid />
      {[-0.85, 0.85].map((x, i) => (
        <group key={x} position={[x, 0, 0]}>
          <Cyl p={[0, 1.45, 0]} r={0.72} h={2.5} c={i === 0 ? BLUE : "#2a5f8f"} />
          <Cyl p={[0, 2.75, 0]} r={0.45} h={0.18} c={STEEL} />
          <Cyl p={[0, 0.95, 0]} r={0.76} h={0.1} c={STEEL} />
          <Box p={[0.78, 1.6, 0]} s={[0.16, 0.3, 0.3]} c={YELLOW} />
        </group>
      ))}
      <Cyl p={[0, 3.05, 0]} r={0.12} h={1.75} c={YELLOW} axis="x" metal={0.6} rough={0.3} />
      <Box p={[-1.5, 0.9, 0.9]} s={[0.7, 1.1, 0.7]} c={DARK} metal={0.2} rough={0.8} />
    </group>
  );
}

function OsmosisMachine() {
  return (
    <group>
      <Skid />
      {[-1.05, 0, 1.05].map((x) => (
        <group key={x}>
          <Cyl p={[x, 1.65, 0]} r={0.26} h={2.5} c={CLEAN} axis="z" metal={0.5} rough={0.3} />
          <Box p={[x, 1.65, 1.3]} s={[0.5, 0.5, 0.12]} c={STEEL} />
          <Box p={[x, 1.65, -1.3]} s={[0.5, 0.5, 0.12]} c={STEEL} />
        </group>
      ))}
      <Box p={[-1.6, 0.85, 0.7]} s={[0.75, 1.35, 0.7]} c={"#345061"} metal={0.3} rough={0.6} />
      <Cyl p={[1.55, 1.1, 0.9]} r={0.22} h={0.9} c={YELLOW} axis="y" />
      <Cyl p={[0, 2.55, 0]} r={0.1} h={2.6} c={WATER} axis="x" metal={0.3} rough={0.4} />
    </group>
  );
}

function UvMachine() {
  return (
    <group>
      <Skid />
      <Cyl p={[-0.6, 1.25, 0]} r={0.42} h={2.5} c={CLEAN} axis="z" metal={0.5} rough={0.3} />
      {[-0.75, -0.25, 0.25, 0.75].map((z) => (
        <Cyl
          key={z}
          p={[-0.6, 1.25, z]}
          r={0.45}
          h={0.08}
          c={"#7fe3ff"}
          axis="z"
          metal={0.1}
          rough={0.2}
          e={"#2ec8ff"}
        />
      ))}
      <Cyl p={[1.15, 1.05, 0.2]} r={0.72} h={1.9} c={BLUE} />
      <Box p={[-1.5, 0.85, 0.9]} s={[0.8, 1.3, 0.6]} c={DARK} metal={0.2} rough={0.8} />
      <Box p={[-1.5, 1.15, 1.21]} s={[0.4, 0.24, 0.04]} c={"#0f1a21"} e={"#56a8ff"} />
      <Cyl p={[0.3, 2.35, 0]} r={0.1} h={1.9} c={STEEL} axis="x" metal={0.6} rough={0.3} />
    </group>
  );
}

function FillerMachine() {
  const carousel = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (carousel.current) carousel.current.rotation.y += delta * 0.7;
  });
  return (
    <group>
      <Skid />
      <Cyl p={[0, 0.5, 0]} r={1.55} h={0.8} c={STEEL} />
      <Cyl p={[0, 3.05, 0]} r={1.25} h={1.0} c={CLEAN} metal={0.55} rough={0.28} />
      <Cyl p={[0, 3.65, 0]} r={0.55} h={0.5} c={STEEL} />
      <group ref={carousel} position={[0, 1.1, 0]}>
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const x = Math.cos(angle) * 1.05;
          const z = Math.sin(angle) * 1.05;
          return (
            <group key={i} position={[x, 0, z]}>
              <Cyl p={[0, 0.55, 0]} r={0.14} h={1.1} c={"#9fe0f5"} metal={0.1} rough={0.15} />
              <Cyl p={[0, 2.15, 0]} r={0.09} h={0.4} c={METAL} />
            </group>
          );
        })}
      </group>
      <Box p={[1.85, 0.85, 0]} s={[0.5, 0.16, 0.9]} c={DARK} />
      <Box p={[-1.85, 0.85, 0]} s={[0.5, 0.16, 0.9]} c={DARK} />
    </group>
  );
}

function CapperMachine() {
  const head = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (head.current) {
      head.current.position.y = 2.15 + Math.sin(clock.elapsedTime * 2.4) * 0.18;
    }
  });
  return (
    <group>
      <Skid />
      <Cyl p={[0, 0.5, 0]} r={1.3} h={0.8} c={STEEL} />
      <Cyl p={[0, 3.3, 0]} r={0.7} h={0.9} c={CLEAN} metal={0.4} rough={0.5} />
      <Cyl p={[0, 2.75, 0]} r={0.12} h={1.0} c={METAL} />
      <group ref={head}>
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <Cyl
              key={i}
              p={[Math.cos(angle) * 0.9, 0, Math.sin(angle) * 0.9]}
              r={0.16}
              h={0.32}
              c={YELLOW}
              metal={0.5}
              rough={0.3}
            />
          );
        })}
      </group>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <Cyl
            key={i}
            p={[Math.cos(angle) * 1.0, 1.05, Math.sin(angle) * 1.0]}
            r={0.13}
            h={0.85}
            c={"#9fe0f5"}
            metal={0.1}
            rough={0.15}
          />
        );
      })}
      <Box p={[1.7, 1.6, 0]} s={[0.5, 0.5, 0.5]} c={STEEL} />
    </group>
  );
}

function LabelerMachine() {
  const bottle = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (bottle.current) bottle.current.rotation.y += delta * 1.6;
  });
  return (
    <group>
      <Skid />
      <Box p={[0, 0.95, 0]} s={[3.4, 0.14, 0.8]} c={DARK} metal={0.3} rough={0.7} />
      <Box p={[0, 1.02, 0.32]} s={[3.4, 0.08, 0.06]} c={YELLOW} metal={0.2} rough={0.6} />
      <Box p={[0, 1.02, -0.32]} s={[3.4, 0.08, 0.06]} c={YELLOW} metal={0.2} rough={0.6} />
      <group ref={bottle} position={[0, 1.05, 0]}>
        <Cyl p={[0, 0.45, 0]} r={0.2} h={0.9} c={"#9fe0f5"} metal={0.1} rough={0.12} />
        <Cyl p={[0, 0.95, 0]} r={0.1} h={0.12} c={YELLOW} />
      </group>
      <Box p={[-1.35, 1.85, 0]} s={[0.7, 1.5, 0.7]} c={BLUE} metal={0.2} rough={0.7} />
      <Box p={[-1.35, 2.65, 0]} s={[0.55, 0.32, 0.55]} c={DARK} />
      <Box p={[1.0, 2.5, 0.55]} s={[0.35, 0.45, 0.35]} c={DARK} metal={0.3} rough={0.6} />
      <Cyl p={[1.0, 2.1, 0.55]} r={0.07} h={0.7} c={STEEL} />
      <Box p={[1.0, 1.55, 0.2]} s={[0.3, 0.6, 0.3]} c={STEEL} />
    </group>
  );
}

function PalletizerMachine() {
  const gantry = useRef<THREE.Group>(null);
  const claw = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (gantry.current) gantry.current.position.x = Math.sin(t * 0.8) * 1.1;
    if (claw.current) claw.current.position.y = 2.3 + Math.sin(t * 1.6) * 0.55;
  });
  return (
    <group>
      <Skid />
      {[
        [-1.5, -1.2],
        [1.5, -1.2],
        [-1.5, 1.2],
        [1.5, 1.2],
      ].map(([x, z]) => (
        <Box key={`${x}-${z}`} p={[x, 1.9, z]} s={[0.18, 3.8, 0.18]} c={STEEL} />
      ))}
      <Box p={[0, 3.85, -1.2]} s={[3.3, 0.18, 0.18]} c={STEEL} />
      <Box p={[0, 3.85, 1.2]} s={[3.3, 0.18, 0.18]} c={STEEL} />
      <Box p={[0, 3.85, 0]} s={[0.18, 0.18, 2.6]} c={STEEL} />
      <group ref={gantry}>
        <Box p={[0, 3.55, 0]} s={[0.5, 0.35, 2.7]} c={YELLOW} metal={0.5} rough={0.35} />
        <group ref={claw}>
          <Cyl p={[0, 0, 0]} r={0.06} h={1.0} c={METAL} />
          <Box p={[0, -0.75, 0]} s={[0.9, 0.12, 0.9]} c={DARK} />
        </group>
      </group>
      <group position={[0, 0.28, 0]}>
        <Box p={[0, 0, 0]} s={[1.3, 0.12, 1.1]} c={"#8b6b45"} metal={0.05} rough={0.95} />
        {[0, 1, 2].map((layer) => (
          <group key={layer} position={[0, 0.3 + layer * 0.42, 0]}>
            <Box p={[-0.3, 0, 0]} s={[0.52, 0.38, 0.9]} c={"#b9d8e6"} metal={0.1} rough={0.5} />
            <Box p={[0.3, 0, 0]} s={[0.52, 0.38, 0.9]} c={"#b9d8e6"} metal={0.1} rough={0.5} />
          </group>
        ))}
      </group>
    </group>
  );
}

export function Machine({ kind }: { kind: MachineKind }) {
  const content = useMemo(() => {
    switch (kind) {
      case "well":
        return <WellMachine />;
      case "filters":
        return <FiltersMachine />;
      case "osmosis":
        return <OsmosisMachine />;
      case "uv":
        return <UvMachine />;
      case "filler":
        return <FillerMachine />;
      case "capper":
        return <CapperMachine />;
      case "labeler":
        return <LabelerMachine />;
      case "palletizer":
        return <PalletizerMachine />;
      default:
        return null;
    }
  }, [kind]);

  return <group>{content}</group>;
}
