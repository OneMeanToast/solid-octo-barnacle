'use client';

import { useExplorer } from '@/lib/store';
import { CATEGORY_COLORS, PART_BY_ID, type PartId } from '@/lib/parts';
import { PartDiagram } from './PartDiagram';

export function DetailPanel() {
  const selectedPart = useExplorer((s) => s.selectedPart);
  const setSelectedPart = useExplorer((s) => s.setSelectedPart);

  if (!selectedPart) return null;
  const part = PART_BY_ID[selectedPart as PartId];
  if (!part) return null;
  const color = CATEGORY_COLORS[part.category];

  return (
    <aside className="absolute right-4 top-20 bottom-32 z-20 w-[360px] panel rounded-md flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-bg-border">
        <div className="flex items-center gap-3">
          <span
            className="w-2 h-2 rounded-full pulse-soft"
            style={{ background: color, boxShadow: `0 0 10px ${color}` }}
          />
          <div className="leading-tight">
            <div
              className="text-[10px] font-mono uppercase tracking-[0.25em]"
              style={{ color }}
            >
              {part.category}
            </div>
            <div className="text-base font-semibold text-slate-100 tracking-wide">
              {part.name}
            </div>
          </div>
        </div>
        <button
          onClick={() => setSelectedPart(null)}
          className="text-slate-500 hover:text-slate-100 text-lg leading-none px-1"
          title="Close"
        >
          ×
        </button>
      </div>

      <div className="overflow-y-auto scroll-thin flex-1 px-4 pb-4 pt-3 space-y-4">
        {/* Diagram */}
        <div className="rounded panel-flat p-3 bg-dotgrid">
          <PartDiagram id={part.id} color={color} />
          <div className="mt-2 text-[9px] font-mono uppercase tracking-widest text-slate-500">
            Schematic — {part.name}
          </div>
        </div>

        {/* Description */}
        <section>
          <SectionHeading>Overview</SectionHeading>
          <p className="text-[12.5px] leading-relaxed text-slate-300">
            {part.description}
          </p>
        </section>

        {/* Role */}
        <section>
          <SectionHeading>Role</SectionHeading>
          <p className="text-[12.5px] leading-relaxed text-slate-300">{part.role}</p>
        </section>

        {/* Specs */}
        <section>
          <SectionHeading>Specifications</SectionHeading>
          <ul className="divide-y divide-bg-border rounded panel-flat overflow-hidden">
            {part.specs.map((s) => (
              <li
                key={s.label}
                className="flex items-baseline justify-between gap-3 px-3 py-2 text-[12px]"
              >
                <span className="text-slate-500 font-mono uppercase tracking-wider text-[10px]">
                  {s.label}
                </span>
                <span className="text-slate-100 text-right">{s.value}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Index footer */}
        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 pt-2">
          Subsystem {String(part.index + 1).padStart(2, '0')} / 14
        </div>
      </div>
    </aside>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500 mb-1.5">
      {children}
    </div>
  );
}
