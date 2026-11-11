"use client";

import { useEffect, useState } from "react";

export default function ControlsHints({ isTouch }: { isTouch: boolean }) {
  const [dim, setDim] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const wake = () => {
      setDim(false);
      clearTimeout(timer);
      timer = setTimeout(() => setDim(true), 9000);
    };
    wake();
    window.addEventListener("keydown", wake);
    window.addEventListener("wheel", wake, { passive: true });
    window.addEventListener("pointerdown", wake);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", wake);
      window.removeEventListener("wheel", wake);
      window.removeEventListener("pointerdown", wake);
    };
  }, []);

  if (isTouch) {
    return (
      <div className={`controls${dim ? " is-dim" : ""}`}>
        <div className="controls-legend">
          <span>
            <span className="kbd">joystick</span> andar
          </span>
          <span>
            <span className="kbd">arraste</span> olhar
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`controls${dim ? " is-dim" : ""}`} aria-hidden="true">
      <div className="keyset">
        <span className="kbd">W</span>
        <div className="keyset-row">
          <span className="kbd">A</span>
          <span className="kbd">S</span>
          <span className="kbd">D</span>
        </div>
      </div>
      <div className="controls-legend">
        <span>
          <span className="kbd">scroll</span> andar
        </span>
        <span>
          <span className="kbd">E</span> examinar
        </span>
        <span>
          <span className="kbd">Shift</span> correr
        </span>
        <span>
          <span className="kbd">Esc</span> menu
        </span>
      </div>
    </div>
  );
}
