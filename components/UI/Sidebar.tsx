'use client';

import { useState } from 'react';
import { useExplorer } from '@/lib/store';
import { PARTS, CATEGORY_COLORS, type Part } from '@/lib/parts';

const CATS = ['All', 'Armor', 'Armament', 'Mobility', 'Crew', 'Electronics', 'Defense'] as const;

export function Sidebar() {
  const [filter, setFilter] = useState<(typeof CATS)[number]>('All');
  const selectedPart = useExplorer((s) => s.selectedPart);
  const setSelectedPart = useExplorer((s) => s.setSelectedPart);
  const setHovered = useExplorer((s) => s.setHoveredPart);

  const visible = filter === 'All' ? PARTS : PARTS.filter((p) => p.category === filter);

  return (
    <aside className="absolute left-4 top-20 bottom-32 z-20 w-[280px] flex flex-col panel rounded-md overflow-hidden">
      {/* Header */}
      <div className="px-3.5 pt-3 pb-2 border-b border-bg-border">
        <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500">
          Components
        </div>
        <div className="text-sm font-semibold text-slate-100 tracking-wide mt-0.5">
          14 Major Subsystems
        </div>
      </div>

      {/* Category tabs */}
      <div className="px-2 pt-2 pb-1 flex flex-wrap gap-1 border-b border-bg-border bg-black/20">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-2 py-1 rounded text-[9px] font-mono uppercase tracking-widest transition-colors ${
              filter === c
                ? 'bg-accent/15 text-accent'
                : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Part list */}
      <ul className="overflow-y-auto scroll-thin flex-1 py-1">
        {visible.map((p) => (
          <PartRow
            key={p.id}
            part={p}
            active={selectedPart === p.id}
            onClick={() => setSelectedPart(p.id)}
            onHover={(v) => setHovered(v ? p.id : null, null)}
          />
        ))}
      </ul>

      {/* Footer hint */}
      <div className="px-3 py-2 border-t border-bg-border text-[10px] font-mono text-slate-500 leading-snug">
        Click a part to fly the camera.
        <br />
        <span className="text-slate-400">SCROLL</span> to zoom ·{' '}
        <span className="text-slate-400">DRAG</span> to orbit
      </div>
    </aside>
  );
}

function PartRow({
  part,
  active,
  onClick,
  onHover,
}: {
  part: Part;
  active: boolean;
  onClick: () => void;
  onHover: (v: boolean) => void;
}) {
  const color = CATEGORY_COLORS[part.category];
  return (
    <li>
      <button
        onClick={onClick}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        className={`w-full text-left flex items-center gap-3 px-3 py-2 transition-colors group ${
          active ? 'bg-accent/10 text-slate-100' : 'hover:bg-white/5 text-slate-300'
        }`}
      >
        <span
          className="w-1 h-7 rounded-full"
          style={{
            background: active ? color : 'rgba(255,255,255,0.06)',
            boxShadow: active ? `0 0 8px ${color}99` : 'none',
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[10px] text-slate-500">
              {String(part.index).padStart(2, '0')}
            </span>
            <span className="text-[13px] font-medium truncate">{part.name}</span>
          </div>
          <div className="text-[10px] text-slate-500 truncate">{part.short}</div>
        </div>
        <span
          className="text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded"
          style={{ color, background: `${color}1a` }}
        >
          {part.category}
        </span>
      </button>
    </li>
  );
}
