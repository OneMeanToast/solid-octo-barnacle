'use client';

/** Lightweight inline SVG schematic per part. Acts as a stand-in for a 2D diagram. */
export function PartDiagram({ id, color }: { id: string; color: string }) {
  return (
    <svg
      viewBox="0 0 320 130"
      className="w-full h-auto block"
      style={{ color }}
    >
      <defs>
        <pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <path
            d="M 16 0 L 0 0 0 16"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.08"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="320" height="130" fill="url(#grid)" />
      {DIAGRAMS[id]?.(color) ?? DefaultDiagram(color)}
    </svg>
  );
}

const DIAGRAMS: Record<string, (c: string) => React.ReactElement> = {
  // ---- T-72 ----
  hull: (c) => (
    <g stroke={c} strokeWidth="1" fill="none">
      <path d="M40,80 L70,55 L240,55 L270,80 L270,95 L40,95 Z" />
      <line x1="40" y1="95" x2="270" y2="95" strokeWidth="2" />
      <text x="60" y="50" fontSize="8" fill={c}>GLACIS 68°</text>
      <line x1="70" y1="55" x2="60" y2="40" />
    </g>
  ),
  turret: (c) => (
    <g stroke={c} strokeWidth="1" fill="none">
      <ellipse cx="160" cy="78" rx="80" ry="22" />
      <line x1="240" y1="78" x2="300" y2="78" strokeWidth="3" />
      <circle cx="180" cy="60" r="6" />
      <text x="190" y="50" fontSize="8" fill={c}>CUPOLA</text>
      <text x="245" y="72" fontSize="8" fill={c}>2A46</text>
    </g>
  ),
  'main-gun': (c) => (
    <g stroke={c} strokeWidth="1" fill="none">
      <rect x="60" y="60" width="40" height="20" />
      <line x1="100" y1="70" x2="280" y2="70" strokeWidth="3" />
      <circle cx="180" cy="70" r="8" />
      <text x="170" y="55" fontSize="8" fill={c}>BORE EVAC.</text>
      <text x="60" y="55" fontSize="8" fill={c}>MANTLET</text>
      <text x="240" y="92" fontSize="8" fill={c}>125 mm</text>
    </g>
  ),
  autoloader: (c) => (
    <g stroke={c} strokeWidth="1" fill="none">
      <circle cx="160" cy="70" r="40" />
      <circle cx="160" cy="70" r="20" />
      {Array.from({ length: 22 }).map((_, i) => {
        const a = (i / 22) * Math.PI * 2;
        const x1 = 160 + Math.cos(a) * 30;
        const y1 = 70 + Math.sin(a) * 30;
        const x2 = 160 + Math.cos(a) * 38;
        const y2 = 70 + Math.sin(a) * 38;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
      <text x="120" y="20" fontSize="8" fill={c}>22 ROUNDS · CAROUSEL</text>
    </g>
  ),
  era: (c) => (
    <g stroke={c} strokeWidth="1" fill="none">
      {Array.from({ length: 6 }).map((_, i) =>
        Array.from({ length: 4 }).map((__, j) => (
          <rect
            key={`${i}-${j}`}
            x={60 + i * 30}
            y={40 + j * 18}
            width="24"
            height="14"
          />
        )),
      )}
      <text x="60" y="120" fontSize="8" fill={c}>KONTAKT-5</text>
    </g>
  ),
  tracks: (c) => (
    <g stroke={c} strokeWidth="1" fill="none">
      <ellipse cx="160" cy="80" rx="120" ry="20" />
      {[60, 100, 140, 180, 220, 260].map((x) => (
        <circle key={x} cx={x} cy={88} r="10" />
      ))}
      <circle cx="40" cy="72" r="8" />
      <circle cx="280" cy="72" r="8" />
      <text x="60" y="40" fontSize="8" fill={c}>TORSION BAR · 6 ROAD WHEELS</text>
    </g>
  ),
  engine: (c) => (
    <g stroke={c} strokeWidth="1" fill="none">
      <rect x="50" y="40" width="220" height="60" />
      {Array.from({ length: 6 }).map((_, i) => (
        <line
          key={i}
          x1={70 + i * 32}
          y1={50}
          x2={70 + i * 32}
          y2={90}
        />
      ))}
      <text x="80" y="120" fontSize="8" fill={c}>V-84MS · 840 HP DIESEL</text>
    </g>
  ),
  driver: (c) => (
    <g stroke={c} strokeWidth="1" fill="none">
      <circle cx="160" cy="70" r="28" />
      <line x1="135" y1="55" x2="185" y2="55" strokeWidth="2" />
      <rect x="148" y="45" width="24" height="6" />
      <text x="100" y="115" fontSize="8" fill={c}>HATCH · TVN-5 PERISCOPE</text>
    </g>
  ),
  cupola: (c) => (
    <g stroke={c} strokeWidth="1" fill="none">
      <circle cx="160" cy="70" r="32" />
      <circle cx="160" cy="70" r="20" />
      {Array.from({ length: 5 }).map((_, i) => {
        const a = -Math.PI / 2 + (i / 4) * Math.PI;
        const x = 160 + Math.cos(a) * 32;
        const y = 70 + Math.sin(a) * 32;
        return <rect key={i} x={x - 4} y={y - 2} width="8" height="4" />;
      })}
      <text x="110" y="115" fontSize="8" fill={c}>TKN-3 + NSVT MOUNT</text>
    </g>
  ),
  mg: (c) => (
    <g stroke={c} strokeWidth="1" fill="none">
      <rect x="80" y="60" width="60" height="14" />
      <line x1="140" y1="67" x2="240" y2="67" strokeWidth="2" />
      <rect x="60" y="78" width="40" height="22" />
      <text x="120" y="115" fontSize="8" fill={c}>NSVT 12.7 mm</text>
    </g>
  ),
  'smoke-launchers': (c) => (
    <g stroke={c} strokeWidth="1" fill="none">
      {[0, 1, 2].map((i) =>
        [0, 1].map((j) => (
          <ellipse
            key={`${i}-${j}`}
            cx={100 + i * 18}
            cy={50 + j * 24}
            rx="6"
            ry="4"
          />
        )),
      )}
      {[0, 1, 2].map((i) =>
        [0, 1].map((j) => (
          <ellipse
            key={`r${i}-${j}`}
            cx={210 + i * 18}
            cy={50 + j * 24}
            rx="6"
            ry="4"
          />
        )),
      )}
      <text x="105" y="110" fontSize="8" fill={c}>902B "TUCHA"</text>
    </g>
  ),
  optics: (c) => (
    <g stroke={c} strokeWidth="1" fill="none">
      <rect x="100" y="50" width="120" height="40" />
      <circle cx="220" cy="70" r="14" />
      <circle cx="220" cy="70" r="6" />
      <line x1="100" y1="60" x2="60" y2="40" />
      <text x="40" y="35" fontSize="8" fill={c}>1A40 LRF</text>
    </g>
  ),
  ammo: (c) => (
    <g stroke={c} strokeWidth="1" fill="none">
      {Array.from({ length: 6 }).map((_, i) =>
        Array.from({ length: 3 }).map((__, j) => (
          <rect
            key={`${i}-${j}`}
            x={60 + i * 32}
            y={45 + j * 18}
            width="24"
            height="12"
          />
        )),
      )}
      <text x="80" y="115" fontSize="8" fill={c}>HULL RACK · 18 RESERVE</text>
    </g>
  ),
  fcs: (c) => (
    <g stroke={c} strokeWidth="1" fill="none">
      <rect x="60" y="60" width="60" height="40" />
      <line x1="120" y1="80" x2="200" y2="80" />
      <rect x="200" y="60" width="60" height="40" />
      <line x1="160" y1="80" x2="160" y2="40" />
      <circle cx="160" cy="34" r="6" />
      <text x="55" y="115" fontSize="8" fill={c}>BC ⇄ STAB ⇄ LRF</text>
    </g>
  ),

  // ---- Su-57 ----
  airframe: (c) => (
    <g stroke={c} strokeWidth="1" fill="none">
      <path d="M40,68 L120,55 L200,55 L260,65 L290,68 L260,75 L200,80 L120,80 L40,68 Z" />
      <path d="M120,55 L100,30 L150,55" />
      <path d="M120,80 L100,105 L150,80" />
      <text x="60" y="115" fontSize="8" fill={c}>BLENDED-WING-BODY</text>
    </g>
  ),
  cockpit: (c) => (
    <g stroke={c} strokeWidth="1" fill="none">
      <path d="M120,80 Q160,30 220,80" />
      <line x1="120" y1="80" x2="220" y2="80" />
      <rect x="148" y="60" width="14" height="20" />
      <text x="100" y="105" fontSize="8" fill={c}>HUD · MFD · K-36D-5</text>
    </g>
  ),
  canopy: (c) => (
    <g stroke={c} strokeWidth="1" fill="none">
      <path d="M100,80 Q160,20 240,80" />
      <line x1="100" y1="80" x2="240" y2="80" />
      <text x="100" y="105" fontSize="8" fill={c}>ITO RAM FILM</text>
    </g>
  ),
  radar: (c) => (
    <g stroke={c} strokeWidth="1" fill="none">
      <circle cx="160" cy="70" r="40" />
      {Array.from({ length: 8 }).map((_, i) =>
        Array.from({ length: 8 }).map((__, j) => (
          <rect
            key={`${i}-${j}`}
            x={130 + i * 7}
            y={40 + j * 7}
            width="5"
            height="5"
          />
        )),
      )}
      <text x="115" y="115" fontSize="8" fill={c}>N036 BYELKA AESA</text>
    </g>
  ),
  irst: (c) => (
    <g stroke={c} strokeWidth="1" fill="none">
      <circle cx="160" cy="70" r="22" />
      <circle cx="160" cy="70" r="10" />
      <line x1="160" y1="70" x2="220" y2="40" />
      <text x="100" y="115" fontSize="8" fill={c}>OLS-50M IRST</text>
    </g>
  ),
  wings: (c) => (
    <g stroke={c} strokeWidth="1" fill="none">
      <path d="M160,68 L40,40 L60,55 L160,72 Z" />
      <path d="M160,68 L280,40 L260,55 L160,72 Z" />
      <text x="100" y="110" fontSize="8" fill={c}>TRAPEZOIDAL · LEVCONs</text>
    </g>
  ),
  tail: (c) => (
    <g stroke={c} strokeWidth="1" fill="none">
      <path d="M160,80 L120,40 L138,80 Z" />
      <path d="M160,80 L200,40 L182,80 Z" />
      <path d="M160,80 L100,75 L100,82 Z" />
      <path d="M160,80 L220,75 L220,82 Z" />
      <text x="100" y="105" fontSize="8" fill={c}>CANTED V-TAIL</text>
    </g>
  ),
  engines: (c) => (
    <g stroke={c} strokeWidth="1" fill="none">
      <rect x="60" y="50" width="200" height="20" />
      <rect x="60" y="78" width="200" height="20" />
      <text x="100" y="115" fontSize="8" fill={c}>2 × AL-41F1 / izd. 30</text>
    </g>
  ),
  nozzles: (c) => (
    <g stroke={c} strokeWidth="1" fill="none">
      <ellipse cx="120" cy="60" rx="22" ry="12" />
      <ellipse cx="120" cy="88" rx="22" ry="12" />
      <line x1="142" y1="60" x2="180" y2="50" />
      <line x1="142" y1="88" x2="180" y2="98" />
      <text x="100" y="115" fontSize="8" fill={c}>3D TVC</text>
    </g>
  ),
  'main-bay': (c) => (
    <g stroke={c} strokeWidth="1" fill="none">
      <rect x="60" y="50" width="200" height="50" />
      <line x1="60" y1="75" x2="260" y2="75" strokeDasharray="4,3" />
      <line x1="80" y1="60" x2="240" y2="60" strokeWidth="2" />
      <line x1="80" y1="90" x2="240" y2="90" strokeWidth="2" />
      <text x="100" y="115" fontSize="8" fill={c}>R-77M · KAB-250</text>
    </g>
  ),
  'side-bays': (c) => (
    <g stroke={c} strokeWidth="1" fill="none">
      <path d="M60,60 L120,55 L120,90 L60,80 Z" />
      <path d="M260,60 L200,55 L200,90 L260,80 Z" />
      <text x="100" y="110" fontSize="8" fill={c}>R-74M2 (SRAAM)</text>
    </g>
  ),
  gear: (c) => (
    <g stroke={c} strokeWidth="1" fill="none">
      <line x1="80" y1="40" x2="80" y2="90" />
      <ellipse cx="80" cy="100" rx="10" ry="6" />
      <line x1="160" y1="40" x2="160" y2="90" />
      <ellipse cx="160" cy="100" rx="14" ry="7" />
      <line x1="240" y1="40" x2="240" y2="90" />
      <ellipse cx="240" cy="100" rx="14" ry="7" />
      <text x="80" y="125" fontSize="8" fill={c}>TRICYCLE · UNPAVED OK</text>
    </g>
  ),
  ew: (c) => (
    <g stroke={c} strokeWidth="1" fill="none">
      <circle cx="60" cy="65" r="6" />
      <circle cx="260" cy="65" r="6" />
      <circle cx="160" cy="35" r="6" />
      <circle cx="160" cy="100" r="6" />
      <line x1="60" y1="65" x2="160" y2="65" strokeDasharray="3,2" />
      <line x1="260" y1="65" x2="160" y2="65" strokeDasharray="3,2" />
      <line x1="160" y1="35" x2="160" y2="100" strokeDasharray="3,2" />
      <text x="100" y="120" fontSize="8" fill={c}>L402 HIMALAYAS</text>
    </g>
  ),
};

function DefaultDiagram(c: string) {
  return (
    <g stroke={c} strokeWidth="1" fill="none">
      <rect x="40" y="40" width="240" height="50" />
      <line x1="40" y1="65" x2="280" y2="65" strokeDasharray="3,3" />
    </g>
  );
}
