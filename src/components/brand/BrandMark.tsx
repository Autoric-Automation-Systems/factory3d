"use client";

import { useState } from "react";

export default function BrandMark({
  src,
  className = "mark",
}: {
  src?: string | null;
  className?: string;
}) {
  const [missing, setMissing] = useState(false);

  if (!src || missing) return <span className={className}>F3</span>;

  return (
    <img
      className="brand-logo"
      src={src}
      alt=""
      width={34}
      height={34}
      onError={() => setMissing(true)}
    />
  );
}
