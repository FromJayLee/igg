'use client';

import React, { useEffect, useRef, useLayoutEffect, useState } from 'react';
import { Planet } from '@/types/universe';
import { PreviewCardManager } from '@/lib/universe-utils';
import * as PIXI from 'pixi.js';

interface PreviewCardPortalProps {
  app: PIXI.Application;
}

export function PreviewCardPortal({ app }: PreviewCardPortalProps) {
  const [data, setData] = useState<Planet | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOpen = (e: CustomEvent<Planet>) => setData(e.detail);
    const onClose = () => setData(null);
    
    window.addEventListener('preview:open', onOpen as EventListener);
    window.addEventListener('preview:close', onClose);
    
    return () => {
      window.removeEventListener('preview:open', onOpen as EventListener);
      window.removeEventListener('preview:close', onClose);
    };
  }, []);

  useEffect(() => {
    if (ref.current) {
      PreviewCardManager.mount(ref.current, app);
    }
  }, [app]);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    PreviewCardManager.measure(rect.width, rect.height);
  }, [data]);

  if (!data) return null;

  return (
    <div
      ref={ref}
      role="tooltip"
      aria-label={`${data.name} ${data.genre} ${data.tagline}`}
      className="pointer-events-none fixed z-50 rounded-lg border border-cyan-400/60 bg-slate-900/80 text-cyan-100 shadow-[0_0_16px_#22d3ee] backdrop-blur-md p-3 w-[280px] transition-opacity duration-75"
    >
      <div className="flex gap-3">
        <img
          src={data.thumbnailUrl}
          alt="thumbnail"
          className="size-16 rounded-sm border border-cyan-300/40"
          style={{ imageRendering: 'pixelated' }}
        />
        <div className="min-w-0">
          <div className="text-cyan-200 font-semibold truncate">{data.name}</div>
          <div className="text-cyan-300/80 text-xs">{data.genre}</div>
          <div className="text-slate-200/90 text-sm line-clamp-2">{data.tagline}</div>
        </div>
      </div>
    </div>
  );
}
