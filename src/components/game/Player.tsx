"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Station } from "@/lib/types";
import { HALL, STATION_BOX } from "./World";
import type { PlayerPos } from "./GameCanvas";

const EYE = 1.68;
const WALK = 3.6;
const RUN = 6.2;
const RADIUS = 0.4;

export type TouchVector = { x: number; y: number };

export default function Player({
  stations,
  paused,
  spawn,
  moveRef,
  onNearby,
  onInteract,
  lookRef,
  posRef,
}: {
  stations: Station[];
  paused: boolean;
  spawn: [number, number];
  moveRef: React.RefObject<TouchVector>;
  lookRef: React.RefObject<TouchVector>;
  posRef: React.RefObject<PlayerPos>;
  onNearby: (id: string | null) => void;
  onInteract: () => void;
}) {
  const { camera, gl } = useThree();
  const position = useRef(new THREE.Vector3(spawn[0], EYE, spawn[1]));
  const yaw = useRef(0);
  const pitch = useRef(-0.04);
  const keys = useRef<Record<string, boolean>>({});
  const locked = useRef(false);
  const nearby = useRef<string | null>(null);
  const pausedRef = useRef(paused);
  const interactRef = useRef(onInteract);
  const nearbyCb = useRef(onNearby);
  const drag = useRef<{ active: boolean; x: number; y: number }>({
    active: false,
    x: 0,
    y: 0,
  });
  const wheel = useRef(0);

  pausedRef.current = paused;
  interactRef.current = onInteract;
  nearbyCb.current = onNearby;

  useEffect(() => {
    camera.rotation.order = "YXZ";
    camera.position.set(spawn[0], EYE, spawn[1]);
  }, [camera, spawn]);

  useEffect(() => {
    const canvas = gl.domElement;

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      keys.current[event.key.toLowerCase()] = true;
      if (event.key === "E" || event.key === "e") {
        if (!pausedRef.current) interactRef.current();
      }
      if ([" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      keys.current[event.key.toLowerCase()] = false;
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!locked.current) return;
      yaw.current -= event.movementX * 0.0024;
      pitch.current = THREE.MathUtils.clamp(
        pitch.current - event.movementY * 0.0024,
        -1.15,
        1.15,
      );
    };

    const onPointerLockChange = () => {
      locked.current = document.pointerLockElement === canvas;
    };

    const onClick = () => {
      if (pausedRef.current || locked.current) return;
      const anyTouch = window.matchMedia("(pointer: coarse)").matches;
      if (!anyTouch) canvas.requestPointerLock?.();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse") return;
      drag.current = { active: true, x: event.clientX, y: event.clientY };
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!drag.current.active || event.pointerType === "mouse") return;
      const dx = event.clientX - drag.current.x;
      const dy = event.clientY - drag.current.y;
      drag.current.x = event.clientX;
      drag.current.y = event.clientY;
      yaw.current -= dx * 0.006;
      pitch.current = THREE.MathUtils.clamp(pitch.current - dy * 0.006, -1.15, 1.15);
    };
    const onPointerUp = () => {
      drag.current.active = false;
    };

    const onWheel = (event: WheelEvent) => {
      if (pausedRef.current) return;
      event.preventDefault();
      const step = event.deltaMode === 1 ? event.deltaY * 0.6 : event.deltaY * 0.012;
      wheel.current = THREE.MathUtils.clamp(wheel.current - step, -1.6, 1.6);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("pointerlockchange", onPointerLockChange);
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("pointerlockchange", onPointerLockChange);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [gl]);

  useEffect(() => {
    if (paused && document.pointerLockElement) document.exitPointerLock?.();
  }, [paused]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);

    if (!pausedRef.current) {
      const k = keys.current;
      let forward = 0;
      let strafe = 0;
      if (k["w"] || k["arrowup"]) forward += 1;
      if (k["s"] || k["arrowdown"]) forward -= 1;
      if (k["a"] || k["arrowleft"]) strafe -= 1;
      if (k["d"] || k["arrowright"]) strafe += 1;

      if (Math.abs(wheel.current) > 0.001) {
        forward += wheel.current;
        wheel.current = THREE.MathUtils.damp(wheel.current, 0, 5.5, delta);
      } else {
        wheel.current = 0;
      }

      const joystick = moveRef.current;
      if (joystick && (Math.abs(joystick.x) > 0.08 || Math.abs(joystick.y) > 0.08)) {
        forward += -joystick.y;
        strafe += joystick.x;
      }

      const lookPad = lookRef.current;
      if (lookPad && (Math.abs(lookPad.x) > 0.05 || Math.abs(lookPad.y) > 0.05)) {
        yaw.current -= lookPad.x * delta * 2.2;
        pitch.current = THREE.MathUtils.clamp(
          pitch.current - lookPad.y * delta * 1.6,
          -1.15,
          1.15,
        );
      }

      const magnitude = Math.hypot(forward, strafe);
      if (magnitude > 0.001) {
        const speed = (k["shift"] ? RUN : WALK) / Math.max(1, magnitude);
        const sin = Math.sin(yaw.current);
        const cos = Math.cos(yaw.current);
        const dx = (-sin * forward + cos * strafe) * speed * delta;
        const dz = (-cos * forward - sin * strafe) * speed * delta;

        const nextX = position.current.x + dx;
        if (!blocked(nextX, position.current.z, stations)) position.current.x = nextX;
        const nextZ = position.current.z + dz;
        if (!blocked(position.current.x, nextZ, stations)) position.current.z = nextZ;
      }
    }

    camera.position.set(position.current.x, EYE, position.current.z);
    camera.rotation.set(pitch.current, yaw.current, 0);
    posRef.current.x = position.current.x;
    posRef.current.z = position.current.z;
    posRef.current.yaw = yaw.current;

    let closest: string | null = null;
    let best = 4.3;
    for (const station of stations) {
      const d = Math.hypot(
        station.position[0] - position.current.x,
        station.position[1] - position.current.z,
      );
      if (d < best) {
        best = d;
        closest = station.id;
      }
    }
    if (closest !== nearby.current) {
      nearby.current = closest;
      nearbyCb.current(closest);
    }
  });

  return null;
}

function blocked(x: number, z: number, stations: Station[]) {
  if (
    x < HALL.minX + RADIUS ||
    x > HALL.maxX - RADIUS ||
    z < HALL.minZ + RADIUS ||
    z > HALL.maxZ - RADIUS
  ) {
    return true;
  }
  for (const station of stations) {
    if (
      Math.abs(x - station.position[0]) < STATION_BOX.halfX + RADIUS &&
      Math.abs(z - station.position[1]) < STATION_BOX.halfZ + RADIUS
    ) {
      return true;
    }
  }
  if (Math.abs(z - HALL.conveyorZ) < 0.45 + RADIUS && Math.abs(x) < 29) return true;
  return false;
}
