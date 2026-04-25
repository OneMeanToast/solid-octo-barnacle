'use client';

import dynamic from 'next/dynamic';
import { TopBar } from '@/components/UI/TopBar';
import { Sidebar } from '@/components/UI/Sidebar';
import { DetailPanel } from '@/components/UI/DetailPanel';
import { Timeline } from '@/components/UI/Timeline';
import { AboutModal } from '@/components/UI/AboutModal';
import { CornerHud } from '@/components/UI/CornerHud';
import { useExplorer } from '@/lib/store';

// Three.js code is browser-only — load with SSR off
const Scene = dynamic(() => import('@/components/Scene').then((m) => m.Scene), {
  ssr: false,
  loading: () => <SceneLoading />,
});

export default function HomePage() {
  const theme = useExplorer((s) => s.theme);
  return (
    <main
      className={`relative w-screen h-screen overflow-hidden theme-fade ${
        theme === 'cinematic' ? 'scanlines' : ''
      }`}
    >
      {/* Background canvas */}
      <div className="absolute inset-0">
        <Scene />
      </div>

      {/* Subtle frame corners */}
      <FrameCorners />

      {/* HUD overlay */}
      <TopBar />
      <Sidebar />
      <DetailPanel />
      <Timeline />
      <CornerHud />
      <AboutModal />
    </main>
  );
}

function FrameCorners() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {[
        'top-2 left-2 border-t border-l',
        'top-2 right-2 border-t border-r',
        'bottom-2 left-2 border-b border-l',
        'bottom-2 right-2 border-b border-r',
      ].map((cls, i) => (
        <div
          key={i}
          className={`absolute w-5 h-5 ${cls} border-accent/40`}
        />
      ))}
    </div>
  );
}

function SceneLoading() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="font-mono text-xs text-slate-400 tracking-widest uppercase">
        <span className="text-accent">›</span> Loading 3D systems…
      </div>
    </div>
  );
}
