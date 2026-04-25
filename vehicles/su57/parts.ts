import type { Part } from '@/lib/types';

export const SU57_PARTS: Part[] = [
  {
    id: 'airframe',
    index: 0,
    name: 'Airframe',
    short: 'Blended-wing-body, composite-heavy.',
    category: 'Airframe',
    description:
      'The Su-57 (NATO: Felon) is a twin-engine, blended-wing-body fifth-generation multi-role fighter. The structure is roughly 25% composite by mass, with internal weapons bays and faceted leading edges to manage radar cross-section.',
    role: 'Carries the engines, sensors, weapons bays, fuel and crew across all flight regimes.',
    specs: [
      { label: 'Length', value: '20.1 m' },
      { label: 'Wingspan', value: '14.1 m' },
      { label: 'Empty weight', value: '~18,500 kg' },
      { label: 'MTOW', value: '~35,000 kg' },
    ],
  },
  {
    id: 'cockpit',
    index: 1,
    name: 'Cockpit',
    short: 'Single-seat glass cockpit.',
    category: 'Crew',
    description:
      'Single-seat glass cockpit with two large MFDs and a wide-angle HUD. NPP Zvezda K-36D-5 ejection seat. HOTAS, voice warning system "Rita", and helmet-mounted display fed by the OLS-50M IRST.',
    role: 'Pilot work-station for flight, fire-control and sensor management.',
    specs: [
      { label: 'Crew', value: '1' },
      { label: 'Seat', value: 'NPP Zvezda K-36D-5' },
      { label: 'Displays', value: '2 × MFD + wide HUD' },
      { label: 'HMD', value: 'Sura-K compatible' },
    ],
  },
  {
    id: 'canopy',
    index: 2,
    name: 'Canopy',
    short: 'One-piece bubble, gold-coated.',
    category: 'Crew',
    description:
      'One-piece teardrop canopy with a thin gold (indium-tin-oxide) film to attenuate radar return through the cockpit cavity. Hinged at the rear and pneumatically jettisoned.',
    role: 'Protects the pilot and contributes to overall stealth shaping.',
    specs: [
      { label: 'Type', value: 'One-piece bubble' },
      { label: 'Coating', value: 'ITO RAM film' },
      { label: 'Jettison', value: 'Pneumatic, 0–60,000 ft' },
    ],
  },
  {
    id: 'radar',
    index: 3,
    name: 'N036 Byelka Radar',
    short: 'X-band AESA, 5 antennas.',
    category: 'Avionics',
    description:
      'The Sh121 sensor suite centers on the N036-1-01 X-band AESA in the nose, supplemented by two cheek-mounted N036B-1-01 X-band side arrays and two L-band N036L-1-01 leading-edge arrays in the wings for IFF and counter-stealth detection.',
    role: 'Long-range air search, ground/sea mapping, multi-target track and weapon guidance.',
    specs: [
      { label: 'Type', value: 'AESA, X-band + L-band' },
      { label: 'Front T/R modules', value: '~1500' },
      { label: 'Detection (5 m² tgt)', value: '~400 km' },
      { label: 'Track', value: '60+ targets' },
    ],
  },
  {
    id: 'irst',
    index: 4,
    name: 'OLS-50M IRST',
    short: 'Forward-quadrant IR + laser.',
    category: 'Avionics',
    description:
      'OLS-50M is an electro-optical sensor mounted slightly offset on the upper forward fuselage. It provides passive infrared search and track, day/TV imaging and a laser rangefinder/designator — useful for engagements where radar emissions are undesirable.',
    role: 'Passive air-to-air detection and air-to-ground targeting without emissions.',
    specs: [
      { label: 'Sensors', value: 'IRST + TV + LRF/Designator' },
      { label: 'IRST range (rear asp.)', value: '~50 km' },
      { label: 'Laser range', value: '~10–15 km' },
    ],
  },
  {
    id: 'wings',
    index: 5,
    name: 'Wings',
    short: 'Trapezoidal blended wings.',
    category: 'Aerodynamic',
    description:
      'High mid-mounted trapezoidal wings blended into the fuselage. All-moving leading-edge root extensions (LEVCONs) at the wing root improve high-AoA control and add lift for short-field performance.',
    role: 'Primary lifting surface and store-carriage; LEVCONs add direct lift / pitch authority.',
    specs: [
      { label: 'Span', value: '14.1 m' },
      { label: 'Area', value: '~78.8 m²' },
      { label: 'Leading-edge sweep', value: '48°' },
      { label: 'LEVCONs', value: 'Yes (all-moving)' },
    ],
  },
  {
    id: 'tail',
    index: 6,
    name: 'Empennage',
    short: 'Canted V-tail + stabilators.',
    category: 'Aerodynamic',
    description:
      'Two outward-canted all-moving vertical stabilizers reduce side-on RCS while still providing yaw authority. A pair of all-moving horizontal stabilators handles pitch.',
    role: 'Yaw and pitch control; canting trades pure yaw efficiency for reduced radar cross-section.',
    specs: [
      { label: 'Vertical stabs', value: '2 × all-moving, canted' },
      { label: 'Horizontal stabs', value: '2 × all-moving' },
      { label: 'Cant angle', value: '~26°' },
    ],
  },
  {
    id: 'engines',
    index: 7,
    name: 'Engines',
    short: 'AL-41F1 / izdeliye 30.',
    category: 'Propulsion',
    description:
      'Production Su-57s use the Saturn AL-41F1 (≈14,500 kgf wet) on initial airframes, with the new izdeliye 30 (Saturn AL-51F-1, ≈18,000 kgf wet) intended for full series. Both feature digital FADEC and 3D thrust-vector nozzles.',
    role: 'Generate thrust for the full envelope including supercruise on izdeliye 30 airframes.',
    specs: [
      { label: 'Engine (current)', value: 'Saturn AL-41F1' },
      { label: 'Thrust (afterburner)', value: '~14,500 kgf each' },
      { label: 'Engine (target)', value: 'izdeliye 30 / AL-51F-1' },
      { label: 'Thrust (target, AB)', value: '~18,000 kgf each' },
    ],
  },
  {
    id: 'nozzles',
    index: 8,
    name: 'TVC Nozzles',
    short: 'Fully-vectoring 3D nozzles.',
    category: 'Propulsion',
    description:
      'Both engines have axisymmetric thrust-vectoring nozzles articulated independently in pitch and yaw. Combined with the LEVCONs and all-moving stabs, this gives the Su-57 supermaneuverability across the envelope.',
    role: 'Direct thrust for supermaneuver, post-stall control, and short-field performance.',
    specs: [
      { label: 'Articulation', value: '3D, ±20° pitch/yaw' },
      { label: 'Independence', value: 'Per-engine' },
      { label: 'Effect', value: 'Supermaneuverability + STOL' },
    ],
  },
  {
    id: 'main-bay',
    index: 9,
    name: 'Main Weapons Bays',
    short: 'Tandem central bays.',
    category: 'Armament',
    description:
      "Two large central tandem bays between the engine nacelles carry beyond-visual-range air-to-air missiles (R-77M / izd. 180) and air-to-ground stores (Kh-59MK2, KAB-250/500). Doors are paneled for stealth.",
    role: 'Internal carriage of primary BVR and strike munitions to preserve low-observable signature.',
    specs: [
      { label: 'Bays', value: '2 × tandem central' },
      { label: 'Typical AAM', value: 'R-77M (izd. 180)' },
      { label: 'Typical AGM', value: 'Kh-59MK2, Kh-58UShKE' },
      { label: 'Capacity (AAM)', value: '4 × R-77M' },
    ],
  },
  {
    id: 'side-bays',
    index: 10,
    name: 'Side Weapons Bays',
    short: 'Cheek bays for SRAAM.',
    category: 'Armament',
    description:
      'Two triangular side bays at the wing roots, each carrying a single short-range air-to-air missile (R-74M2 / izd. 760) on a swing-out launcher.',
    role: 'Internal carriage of WVR missiles for stealth-mode dogfighting.',
    specs: [
      { label: 'Bays', value: '2 × cheek (one per side)' },
      { label: 'Typical SRAAM', value: 'R-74M2 (izd. 760)' },
      { label: 'Launcher', value: 'Swing-out rail' },
    ],
  },
  {
    id: 'gear',
    index: 11,
    name: 'Landing Gear',
    short: 'Tricycle, single-wheel.',
    category: 'Mobility',
    description:
      'Tricycle gear: single-wheel nose strut and single-wheel main struts that retract forward into the inlet trunks. Designed for unprepared airfields with relatively long stroke and large tires.',
    role: 'Ground handling, takeoff and landing.',
    specs: [
      { label: 'Configuration', value: 'Tricycle, single wheel' },
      { label: 'Mains retract', value: 'Forward into inlet trunks' },
      { label: 'Surface', value: 'Suitable for unpaved' },
    ],
  },
  {
    id: 'ew',
    index: 12,
    name: 'L402 Himalayas EW',
    short: 'Integrated EW suite.',
    category: 'Avionics',
    description:
      'L402 "Himalayas" provides radar warning, jamming, and decoy management. Antennas are distributed across the airframe (wing tips, fin caps, fuselage sides) for spherical coverage.',
    role: 'Detect, classify and counter hostile RF threats; cue countermeasures.',
    specs: [
      { label: 'System', value: 'L402 Himalayas' },
      { label: 'Coverage', value: 'Spherical, distributed antennas' },
      { label: 'Outputs', value: 'Jamming + decoys + cue' },
    ],
  },
];

export const SU57_CATEGORY_COLORS: Record<string, string> = {
  Airframe: '#7be3ff',
  Aerodynamic: '#9bd6ff',
  Propulsion: '#ff8a6b',
  Armament: '#ffd66b',
  Avionics: '#c08bff',
  Crew: '#a4ff8a',
  Mobility: '#ff6b9c',
};
