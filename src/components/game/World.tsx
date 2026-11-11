"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Station } from "@/lib/types";
import { Machine } from "./machines";
import { labelTexture } from "./labels";

export const HALL = {
  minX: -32,
  maxX: 32,
  minZ: -12.5,
  maxZ: 12.5,
  conveyorZ: -4.4,
  stationZ: -8,
};

export const STATION_BOX = { halfX: 2.1, halfZ: 1.7 };

function FloorRing({ color }: { color: string }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <ringGeometry args={[2.15, 2.45, 40]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Label({
  title,
  subtitle,
  accent,
  scale = 1,
  position,
}: {
  title: string;
  subtitle: string;
  accent: string;
  scale?: number;
  position: [number, number, number];
}) {
  const texture = useMemo(() => labelTexture(title, subtitle, accent), [title, subtitle, accent]);
  return (
    <sprite position={position} scale={[3.6 * scale, 1.05 * scale, 1]}>
      <spriteMaterial map={texture} transparent depthWrite={false} />
    </sprite>
  );
}

function StationNode({
  station,
  percent,
  highlighted,
  index,
}: {
  station: Station;
  percent: number;
  highlighted: boolean;
  index: number;
}) {
  const color = percent === 100 ? "#35d07f" : percent > 0 ? "#ffc53d" : "#4c6272";
  const accent = highlighted ? "#ffc53d" : percent === 100 ? "#35d07f" : "#7f94a2";

  return (
    <group position={[station.position[0], 0, station.position[1]]}>
      <FloorRing color={color} />
      <group position={[0, 0.12, 0]}>
        <Machine kind={station.machine} />
      </group>
      <Label
        title={station.name}
        subtitle={percent === 100 ? "concluída" : percent > 0 ? `${percent}% concluído` : `estação ${index + 1}`}
        accent={accent}
        position={[0, 4.15, 0]}
      />
    </group>
  );
}

function Conveyor() {
  const bottles = useRef<THREE.Group>(null);
  const count = 44;
  const spacing = 1.35;
  const total = count * spacing;

  useFrame((_, delta) => {
    if (!bottles.current) return;
    bottles.current.position.x += delta * 0.85;
    if (bottles.current.position.x > total) bottles.current.position.x = 0;
  });

  return (
    <group position={[0, 0, HALL.conveyorZ]}>
      <mesh position={[0, 0.82, 0]}>
        <boxGeometry args={[58, 0.12, 0.86]} />
        <meshStandardMaterial color="#39424b" metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.88, 0.41]}>
        <boxGeometry args={[58, 0.1, 0.05]} />
        <meshStandardMaterial color="#ffc53d" metalness={0.2} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.88, -0.41]}>
        <boxGeometry args={[58, 0.1, 0.05]} />
        <meshStandardMaterial color="#ffc53d" metalness={0.2} roughness={0.5} />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[-28 + i * 8, 0.45, 0]}>
          <boxGeometry args={[0.2, 0.75, 0.7]} />
          <meshStandardMaterial color="#2b353e" metalness={0.3} roughness={0.7} />
        </mesh>
      ))}
      <group ref={bottles} position={[-29, 0, 0]}>
        {Array.from({ length: count }).map((_, i) => (
          <mesh key={i} position={[i * spacing, 1.13, 0]}>
            <cylinderGeometry args={[0.17, 0.17, 0.5, 12]} />
            <meshStandardMaterial
              color="#a9dcef"
              metalness={0.1}
              roughness={0.15}
              transparent
              opacity={0.85}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Hall() {
  const pillars = useMemo(() => {
    const list: number[] = [];
    for (let x = -30; x <= 30; x += 12) list.push(x);
    return list;
  }, []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[66, 26]} />
        <meshStandardMaterial color="#2b3843" metalness={0.1} roughness={0.92} />
      </mesh>
      <gridHelper args={[66, 33, "#28353f", "#1f2932"]} position={[0, 0.012, 0]} />

      {/* piso de circulacao com faixa de seguranca */}
      <mesh position={[0, 0.015, 3.4]}>
        <boxGeometry args={[66, 0.01, 12]} />
        <meshStandardMaterial color="#33414d" metalness={0.1} roughness={0.9} />
      </mesh>

      {/* paredes */}
      <mesh position={[0, 4, -13]}>
        <boxGeometry args={[66, 8, 0.4]} />
        <meshStandardMaterial color="#243039" metalness={0.1} roughness={0.9} />
      </mesh>
      <mesh position={[-33, 4, 0]}>
        <boxGeometry args={[0.4, 8, 26]} />
        <meshStandardMaterial color="#202b34" metalness={0.1} roughness={0.9} />
      </mesh>
      <mesh position={[33, 4, 0]}>
        <boxGeometry args={[0.4, 8, 26]} />
        <meshStandardMaterial color="#202b34" metalness={0.1} roughness={0.9} />
      </mesh>

      {/* janelas na parede do fundo */}
      {[-24, -16, -8, 0, 8, 16, 24].map((x) => (
        <mesh key={x} position={[x, 5.2, -12.78]}>
          <planeGeometry args={[5, 2.2]} />
          <meshStandardMaterial
            color="#9fd3ff"
            emissive="#5aa9e8"
            emissiveIntensity={0.45}
            metalness={0}
            roughness={1}
          />
        </mesh>
      ))}

      {/* pilares */}
      {pillars.map((x) => (
        <mesh key={x} position={[x, 4, -11.6]}>
          <boxGeometry args={[0.5, 8, 0.5]} />
          <meshStandardMaterial color="#2c3a45" metalness={0.25} roughness={0.8} />
        </mesh>
      ))}

      {/* treliças de cobertura */}
      {pillars.map((x) => (
        <mesh key={`t-${x}`} position={[x, 7.6, 0]}>
          <boxGeometry args={[0.3, 0.3, 26]} />
          <meshStandardMaterial color="#2c3a45" metalness={0.3} roughness={0.8} />
        </mesh>
      ))}

      {/* luminarias */}
      {[-24, -12, 0, 12, 24].map((x) =>
        [-2, 7].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 7.2, z]}>
            <boxGeometry args={[3.2, 0.12, 0.5]} />
            <meshStandardMaterial
              color="#fff7e0"
              emissive="#ffe9b0"
              emissiveIntensity={1.4}
              metalness={0}
              roughness={1}
            />
          </mesh>
        )),
      )}
    </group>
  );
}

export function World({
  stations,
  percents,
  nearbyId,
}: {
  stations: Station[];
  percents: Record<string, number>;
  nearbyId: string | null;
}) {
  return (
    <group>
      <color attach="background" args={["#0a1017"]} />
      <fog attach="fog" args={["#0a1017", 34, 88]} />

      <ambientLight intensity={0.95} />
      <hemisphereLight args={["#d6e9f8", "#222d36", 1.25]} />
      <directionalLight position={[14, 18, 10]} intensity={2.4} color="#ffffff" />
      <directionalLight position={[-18, 10, -6]} intensity={0.9} color="#8cc0e8" />
      {[-20, 0, 20].map((x) => (
        <pointLight
          key={x}
          position={[x, 6.6, 2]}
          intensity={28}
          distance={26}
          decay={2}
          color="#ffe6b8"
        />
      ))}

      <Hall />
      <Conveyor />

      <Label
        title="LINHA DE ENVASE"
        subtitle="Água mineral · 8 estações · caminhe com WASD"
        accent="#ffc53d"
        scale={2}
        position={[0, 5.4, 11]}
      />

      {stations.map((station, index) => (
        <StationNode
          key={station.id}
          station={station}
          index={index}
          percent={percents[station.id] ?? 0}
          highlighted={nearbyId === station.id}
        />
      ))}
    </group>
  );
}
