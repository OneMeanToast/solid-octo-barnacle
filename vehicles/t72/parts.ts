import type { Part } from '@/lib/types';

export const T72_PARTS: Part[] = [
  {
    id: 'hull',
    index: 0,
    name: 'Hull',
    short: 'Welded steel hull, sloped glacis.',
    category: 'Armor',
    description:
      'The T-72 hull is a welded rolled-steel construction with a sharply sloped upper glacis plate. Composite armor inserts and bolted reactive blocks supplement the base RHA, giving frontal protection comparable to far heavier Western tanks of the same era.',
    role: 'Primary structural body that mounts the powerpack, suspension, turret race and crew compartment.',
    specs: [
      { label: 'Length (gun fwd)', value: '9.53 m' },
      { label: 'Width', value: '3.59 m' },
      { label: 'Combat weight', value: '~44.5 t' },
      { label: 'Glacis slope', value: '68° from vertical' },
      { label: 'Glacis composite', value: 'RHA + textolite + RHA' },
    ],
  },
  {
    id: 'turret',
    index: 1,
    name: 'Turret',
    short: 'Cast/welded composite turret.',
    category: 'Armor',
    description:
      'Low-profile turret derived from the T-64 lineage. Early A models used a cast turret with sand-rod composite filler; B models adopted a thicker cast or welded turret with reflective inserts behind the front cheeks for improved KE and HEAT resistance.',
    role: 'Houses the gun, autoloader carousel, commander and gunner. Provides 360° powered traverse.',
    specs: [
      { label: 'Traverse', value: '360° electric / hydraulic' },
      { label: 'Max traverse rate', value: '~24°/s' },
      { label: 'Front (B variant, est.)', value: '~520 mm RHAe vs KE' },
      { label: 'Operators', value: 'Commander + Gunner' },
    ],
  },
  {
    id: 'main-gun',
    index: 2,
    name: '125 mm Smoothbore Gun',
    short: '2A46 series smoothbore.',
    category: 'Armament',
    description:
      'The 2A46 (and later 2A46M) is a 125 mm smoothbore cannon firing separately-loaded ammunition. It launches APFSDS, HEAT-FS and HE-Frag rounds, plus the 9M119 Svir / Refleks gun-launched ATGM.',
    role: 'Primary weapon. Engages armored vehicles, fortifications and (with Refleks) low-flying helicopters.',
    specs: [
      { label: 'Caliber', value: '125 mm smoothbore' },
      { label: 'Elevation', value: '−6° to +14°' },
      { label: 'Rate of fire', value: '6–8 rpm (autoloader)' },
      { label: 'Muzzle velocity (APFSDS)', value: '~1715 m/s' },
      { label: 'ATGM range (Refleks)', value: 'up to 5000 m' },
    ],
  },
  {
    id: 'autoloader',
    index: 3,
    name: 'Autoloader (Korzina)',
    short: 'Carousel autoloader, 22 ready rounds.',
    category: 'Armament',
    description:
      'A horizontally-stowed carousel beneath the turret floor holds 22 two-piece rounds (projectile + propellant charge). A hydraulic rammer chambers them sequentially, allowing a 3-man crew and a lower turret silhouette than Western 4-man designs.',
    role: 'Mechanically loads the 125 mm gun, removing the need for a human loader.',
    specs: [
      { label: 'Ready rounds', value: '22' },
      { label: 'Cycle time', value: '6.5 – 8 s' },
      { label: 'Stowage', value: 'Horizontal carousel under turret' },
    ],
  },
  {
    id: 'era',
    index: 4,
    name: 'Reactive Armor (ERA)',
    short: 'Kontakt-1 / Kontakt-5 blocks.',
    category: 'Armor',
    description:
      'Explosive reactive armor tiles bolted to hull glacis, turret cheeks and side skirts. Kontakt-1 disrupts shaped-charge jets; Kontakt-5 (heavy ERA) also defeats kinetic long-rod penetrators by shearing them on detonation.',
    role: 'Add-on protection layer that defeats incoming HEAT and KE threats before they reach the base armor.',
    specs: [
      { label: 'Type', value: 'Kontakt-1 / Kontakt-5' },
      { label: 'Filler', value: '4S20 / 4S22 plastic explosive' },
      { label: 'Effect vs HEAT', value: '+250–400 mm RHAe' },
      { label: 'Effect vs KE (K-5)', value: '+120–200 mm RHAe' },
    ],
  },
  {
    id: 'tracks',
    index: 5,
    name: 'Tracks & Road Wheels',
    short: 'Torsion bar, 6 road wheels per side.',
    category: 'Mobility',
    description:
      'Torsion-bar suspension with six rubber-tired steel road wheels per side, three return rollers, front idler and rear drive sprocket. Tracks are RMSh single-pin steel with optional rubber pads.',
    role: 'Provides ground propulsion, shock damping and load distribution across soft terrain.',
    specs: [
      { label: 'Suspension', value: 'Torsion bar' },
      { label: 'Road wheels', value: '6 per side' },
      { label: 'Track type', value: 'RMSh, single-pin' },
      { label: 'Track width', value: '580 mm' },
      { label: 'Ground pressure', value: '~0.90 kg/cm²' },
    ],
  },
  {
    id: 'engine',
    index: 6,
    name: 'Engine Compartment',
    short: 'V-46 / V-84 multi-fuel diesel.',
    category: 'Mobility',
    description:
      'Rear-mounted V-shaped 12-cylinder multi-fuel diesel. Early T-72 used the 780 hp V-46; B-series received the 840 hp V-84MS. The pack is transversely mounted with a planetary gearbox each side.',
    role: 'Generates motive power and drives the auxiliary systems and the rear sprockets.',
    specs: [
      { label: 'Engine', value: 'V-46-6 / V-84MS diesel' },
      { label: 'Power', value: '780 – 840 hp' },
      { label: 'Top speed (road)', value: '60 km/h' },
      { label: 'Range (internal)', value: '~500 km' },
      { label: 'Fuel', value: 'Diesel, kerosene, gasoline (multi-fuel)' },
    ],
  },
  {
    id: 'driver',
    index: 7,
    name: "Driver's Station",
    short: 'Centerline driver position.',
    category: 'Crew',
    description:
      'Driver sits centrally on the hull floor behind the glacis. Reclined seat, lever steering (T-bar on later vehicles), and a TVN-2 / TVN-5 IR or passive periscope for night driving.',
    role: 'Controls vehicle motion, gear selection, steering and basic monitoring of the powerpack.',
    specs: [
      { label: 'Position', value: 'Hull centerline, front' },
      { label: 'Vision', value: 'TNPO-168 day, TVN-2/5 night' },
      { label: 'Hatch', value: 'Single-piece, swing-up' },
    ],
  },
  {
    id: 'cupola',
    index: 8,
    name: "Commander's Cupola",
    short: 'TKN-3 sight, AA mount.',
    category: 'Crew',
    description:
      "The commander's cupola sits on the right of the turret roof and rotates independently. It carries the TKN-3 binocular day/night sight and on most variants the NSVT 12.7 mm AA machine gun mount.",
    role: 'Commander observation, target hand-off to the gunner, and short-range air defense.',
    specs: [
      { label: 'Sight', value: 'TKN-3 day/IR, ~5×' },
      { label: 'AA weapon', value: 'NSVT 12.7 mm (most variants)' },
      { label: 'Hatch', value: 'Single-piece, hinged' },
    ],
  },
  {
    id: 'mg',
    index: 9,
    name: 'Coaxial / AA Machine Gun',
    short: 'PKT 7.62 mm coax + NSVT 12.7 mm AA.',
    category: 'Armament',
    description:
      'A PKT 7.62 mm machine gun is mounted coaxially with the main gun for soft targets. A 12.7 mm NSVT (or DShK on early vehicles) is fitted to the commander\'s cupola against helicopters and infantry.',
    role: 'Engages light vehicles, infantry, and low-flying aircraft.',
    specs: [
      { label: 'Coaxial', value: 'PKT 7.62 × 54 mmR' },
      { label: 'AA', value: 'NSVT 12.7 × 108 mm' },
      { label: 'Coax ammo', value: '2000 rounds' },
      { label: 'AA ammo', value: '300 rounds' },
    ],
  },
  {
    id: 'smoke-launchers',
    index: 10,
    name: 'Smoke Grenade Launchers',
    short: '902B "Tucha" 81 mm dischargers.',
    category: 'Defense',
    description:
      "Two banks of 81 mm electrically-fired dischargers on the turret cheeks. They launch smoke grenades that obscure the tank's signature in visible and (with later munitions) thermal/IR bands.",
    role: 'Concealment and breaking enemy lock-on during withdrawal or maneuver.',
    specs: [
      { label: 'System', value: '902B "Tucha"' },
      { label: 'Caliber', value: '81 mm' },
      { label: 'Tubes', value: '8 – 12 (variant dependent)' },
      { label: 'Effective screen', value: '~10 s deploy, 1–2 min duration' },
    ],
  },
  {
    id: 'optics',
    index: 11,
    name: 'Optics & Sights',
    short: 'TPD-K1 / 1A40 gunner sight.',
    category: 'Electronics',
    description:
      "Gunner uses the TPD-K1 (early) or 1A40 / 1A40-1 (B variants) coincidence/laser rangefinder day sight, with a TPN-1-49 or TPN-3-49 night channel. Later upgrades include thermal sights such as Buran-Catherine or Sosna-U.",
    role: 'Target acquisition, ranging and ballistic solution input to the fire control system.',
    specs: [
      { label: 'Day sight', value: 'TPD-K1 / 1A40' },
      { label: 'Magnification', value: '3.5× / 8×' },
      { label: 'Laser range', value: '400 – 4000 m' },
      { label: 'Night sight', value: 'TPN-1/3-49 (IR/passive)' },
    ],
  },
  {
    id: 'ammo',
    index: 12,
    name: 'Ammunition Storage',
    short: '~45 rounds, mixed load.',
    category: 'Armament',
    description:
      'Total ammunition stowage of ~39–45 rounds depending on variant: 22 in the autoloader carousel and the remainder distributed in hull and turret racks. Typical mix is APFSDS, HEAT-FS, HE-Frag, with a small number of guided projectiles.',
    role: 'Provides the ready and reserve munitions consumed by the main gun.',
    specs: [
      { label: 'Total rounds', value: '~39 – 45' },
      { label: 'Ready (carousel)', value: '22' },
      { label: 'Types', value: 'APFSDS · HEAT-FS · HE-Frag · ATGM' },
    ],
  },
  {
    id: 'fcs',
    index: 13,
    name: 'Fire Control System',
    short: '1A40-1 ballistic computer.',
    category: 'Electronics',
    description:
      'The 1A40-series FCS combines a laser rangefinder, ballistic computer and crosswind sensor. It computes a lead and superelevation solution, drives the gun in two axes via stabilizer 2E28M / 2E42, and supports gun-launched ATGM guidance.',
    role: 'Closes the loop between sighting, ranging and gun pointing for first-round hit probability.',
    specs: [
      { label: 'Computer', value: '1A40 / 1A40-1 ballistic' },
      { label: 'Stabilizer', value: '2E28M / 2E42 two-axis' },
      { label: 'First-round hit (2 km)', value: '~60% (B variant)' },
      { label: 'ATGM channel', value: '9K120 Svir / Refleks' },
    ],
  },
];

export const T72_CATEGORY_COLORS: Record<string, string> = {
  Armor: '#7be3ff',
  Armament: '#ff8a6b',
  Mobility: '#ffd66b',
  Crew: '#a4ff8a',
  Electronics: '#c08bff',
  Defense: '#ff6b9c',
};
