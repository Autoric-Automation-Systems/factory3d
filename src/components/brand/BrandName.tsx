"use client";

import { useState } from "react";

export default function BrandName({
  src,
  fallback = "Fábrica 3D",
}: {
  src?: string | null;
  fallback?: string;
}) {
  const [missing, setMissing] = useState(false);

  if (!src || missing) return <span>{fallback}</span>;

  return (
    <img
      className="brand-name"
      src={src}
      alt={fallback}
      onError={() => setMissing(true)}
    />
  );
}
