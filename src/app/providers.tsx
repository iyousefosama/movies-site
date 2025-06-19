"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig transition={{ duration: 0.3, ease: "easeInOut" }}>
      {children}
    </MotionConfig>
  );
}
