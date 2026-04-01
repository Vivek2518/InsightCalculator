export type AerospaceCategoryKey =
  | "aerodynamics"
  | "structures"
  | "propulsion"
  | "flight-mechanics"
  | "space"
  | "drone";

export type AerospaceSubcategory = {
  key: string; // url-safe slug
  title: string;
  calculators: string[];
};

export type AerospaceCalculator = {
  key: string; // url-safe slug
  title: string;
};

export type AerospaceCategory = {
  key: AerospaceCategoryKey;
  title: string;
  subcategories: AerospaceSubcategory[];
};

const toKey = (value: string): string =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const AEROSPACE_CATEGORIES: AerospaceCategory[] = [
  {
    key: "aerodynamics",
    title: "Aerodynamics",
    subcategories: [
      {
        key: "flow-properties",
        title: "Flow Properties",
        calculators: [
          "Air Density (ISA vs altitude)",
          "Speed of Sound",
          "Mach Number",
          "Reynolds Number",
          "Dynamic Pressure",
          "Velocity Conversion (IAS/EAS/TAS)",
        ],
      },
      {
        key: "fundamental-forces",
        title: "Fundamental Forces",
        calculators: ["Lift Force", "Drag Force", "Lift Coefficient (Cl)", "Drag Coefficient (Cd)", "Lift-to-Drag Ratio (L/D)"],
      },
      {
        key: "drag-breakdown",
        title: "Drag Breakdown",
        calculators: ["Parasite Drag", "Skin Friction Drag", "Form Drag", "Induced Drag", "Total Drag Estimation", "Drag Polar (Cd vs Cl)"],
      },
      {
        key: "airfoil-analysis",
        title: "Airfoil Analysis",
        calculators: ["Lift Curve Slope (Cl vs AoA)", "Angle of Attack to Lift", "Zero-Lift Angle", "Camber Effect Calculator", "Thickness Ratio Effects"],
      },
      {
        key: "wing-geometry",
        title: "Wing Geometry",
        calculators: ["Wing Area", "Aspect Ratio", "Wing Loading", "Mean Aerodynamic Chord (MAC)", "Taper Ratio"],
      },
      {
        key: "boundary-layer-viscous-effects",
        title: "Boundary Layer & Viscous Effects",
        calculators: ["Boundary Layer Thickness", "Laminar vs Turbulent (Re-based)", "Skin Friction Coefficient", "Transition Point Estimation"],
      },
      {
        key: "compressible-flow",
        title: "Compressible Flow",
        calculators: ["Mach Number (alt method)", "Stagnation Pressure", "Stagnation Temperature", "Isentropic Flow Relations", "Area-Mach Relation"],
      },
      {
        key: "stability-related-aerodynamics",
        title: "Stability-Related Aerodynamics",
        calculators: ["Center of Pressure", "Aerodynamic Center", "Moment Coefficient", "Pitching Moment"],
      },
      {
        key: "aerodynamic-performance-metrics",
        title: "Aerodynamic Performance Metrics",
        calculators: ["Lift-to-Drag Ratio (detailed)", "Stall Speed", "Glide Ratio", "Minimum Drag Speed"],
      },
    ],
  },
  {
    key: "structures",
    title: "Structures",
    subcategories: [
      { key: "stress-strain", title: "Stress & Strain", calculators: ["Normal Stress", "Shear Stress", "Strain", "Young's Modulus"] },
      { key: "beam-bending-deflection", title: "Beam Bending & Deflection", calculators: ["Bending Stress", "Beam Deflection", "Shear Force", "Bending Moment"] },
      { key: "torsion", title: "Torsion", calculators: ["Shear Stress (torsion)", "Angle of Twist", "Torque Capacity"] },
      { key: "buckling", title: "Buckling", calculators: ["Euler Buckling Load", "Critical Stress", "Slenderness Ratio"] },
      { key: "fatigue", title: "Fatigue", calculators: ["Fatigue Life (S-N)", "Cycles to Failure", "Safety Factor"] },
      { key: "material-properties", title: "Material Properties", calculators: ["Density", "Elastic Modulus", "Poisson's Ratio"] },
      { key: "structural-loads", title: "Structural Loads", calculators: ["Point Load", "Distributed Load", "Load Factor (g-load)"] },
    ],
  },
  {
    key: "propulsion",
    title: "Propulsion",
    subcategories: [
      { key: "thrust-calculations", title: "Thrust Calculations", calculators: ["Thrust (basic)", "Thrust-to-Weight Ratio"] },
      { key: "specific-impulse-isp", title: "Specific Impulse (Isp)", calculators: ["Isp Calculation", "Effective Exhaust Velocity"] },
      { key: "fuel-flow-consumption", title: "Fuel Flow & Consumption", calculators: ["Fuel Flow Rate", "Fuel Consumption (range-based)"] },
      { key: "propeller-aerodynamics", title: "Propeller Aerodynamics", calculators: ["Propeller Thrust", "Advance Ratio", "Propeller Efficiency"] },
      { key: "jet-engine-performance", title: "Jet Engine Performance", calculators: ["Thrust (jet)", "TSFC (Thrust Specific Fuel Consumption)"] },
      { key: "nozzle-flow", title: "Nozzle Flow", calculators: ["Exit Velocity", "Mass Flow Rate", "Choked Flow"] },
      { key: "power-efficiency", title: "Power & Efficiency", calculators: ["Power Required", "Power Available", "Propulsive Efficiency"] },
    ],
  },
  {
    key: "flight-mechanics",
    title: "Flight Mechanics",
    subcategories: [
      { key: "aircraft-forces-moments", title: "Aircraft Forces & Moments", calculators: ["Net Force", "Moment Calculation"] },
      { key: "climb-descent-performance", title: "Climb & Descent Performance", calculators: ["Rate of Climb", "Climb Angle"] },
      { key: "cruise-performance", title: "Cruise Performance", calculators: ["Range", "Endurance"] },
      { key: "takeoff-landing", title: "Takeoff & Landing", calculators: ["Takeoff Distance", "Landing Distance"] },
      { key: "stability-control", title: "Stability & Control", calculators: ["Static Margin", "Neutral Point"] },
      { key: "maneuvering-performance", title: "Maneuvering Performance", calculators: ["Turn Radius", "Turn Rate", "Load Factor"] },
      { key: "flight-envelope", title: "Flight Envelope", calculators: ["Stall Speed", "V-n Diagram Limits"] },
    ],
  },
  {
    key: "space",
    title: "Space",
    subcategories: [
      { key: "orbital-mechanics", title: "Orbital Mechanics", calculators: ["Orbital Period", "Orbital Velocity"] },
      { key: "escape-orbital-velocity", title: "Escape & Orbital Velocity", calculators: ["Escape Velocity", "Circular Velocity"] },
      { key: "hohmann-transfers", title: "Hohmann Transfers", calculators: ["Transfer Delta-V", "Transfer Time"] },
      { key: "rocket-equation", title: "Rocket Equation", calculators: ["Delta-V (Tsiolkovsky)", "Mass Ratio"] },
      { key: "gravity-two-body-motion", title: "Gravity & Two-Body Motion", calculators: ["Gravitational Force", "Orbital Energy"] },
      { key: "re-entry-dynamics", title: "Re-entry Dynamics", calculators: ["Re-entry Velocity", "Heating Rate (simplified)"] },
    ],
  },
  {
    key: "drone",
    title: "Drones (UAVs)",
    subcategories: [
      { key: "thrust-to-weight-sizing", title: "Thrust-to-Weight & Sizing", calculators: ["Required Thrust", "Thrust-to-Weight Ratio"] },
      { key: "flight-time-estimation", title: "Flight Time Estimation", calculators: ["Flight Time", "Hover Time"] },
      { key: "battery-power-systems", title: "Battery & Power Systems", calculators: ["Battery Capacity", "Power Consumption"] },
      { key: "motor-propeller-matching", title: "Motor & Propeller Matching", calculators: ["Motor KV vs Prop Match", "Current Draw"] },
      { key: "payload-capacity", title: "Payload Capacity", calculators: ["Max Payload", "Payload vs Flight Time"] },
      { key: "efficiency-power-consumption", title: "Efficiency & Power Consumption", calculators: ["Efficiency", "Power Required"] },
      { key: "multirotor-dynamics", title: "Multirotor Dynamics", calculators: ["Total Thrust", "Stability Margin"] },
    ],
  },
];

export const AEROSPACE_CATEGORY_KEYS: AerospaceCategoryKey[] = AEROSPACE_CATEGORIES.map(
  (c) => c.key
);

export function isAerospaceCategoryKey(value: string): value is AerospaceCategoryKey {
  return AEROSPACE_CATEGORY_KEYS.includes(value as AerospaceCategoryKey);
}

export function getAerospaceCategory(key: string): AerospaceCategory | undefined {
  return AEROSPACE_CATEGORIES.find((c) => c.key === key);
}

export function getAerospaceSubcategory(
  categoryKey: string,
  subcategoryKey: string
): AerospaceSubcategory | undefined {
  const category = getAerospaceCategory(categoryKey);
  return category?.subcategories.find((s) => s.key === subcategoryKey);
}

export function getAerospaceCalculators(
  categoryKey: string,
  subcategoryKey: string
): AerospaceCalculator[] {
  const subcategory = getAerospaceSubcategory(categoryKey, subcategoryKey);
  if (!subcategory) {
    return [];
  }

  return subcategory.calculators.map((title) => ({
    title,
    key: toKey(title),
  }));
}

export function getAerospaceCalculator(
  categoryKey: string,
  subcategoryKey: string,
  calculatorKey: string
): AerospaceCalculator | undefined {
  return getAerospaceCalculators(categoryKey, subcategoryKey).find(
    (calculator) => calculator.key === calculatorKey
  );
}

export function getAerospaceCategoryPath(categoryKey: AerospaceCategoryKey): string {
  return `/aerospace/${categoryKey}`;
}

export function getAerospaceSubcategoryPath(
  categoryKey: AerospaceCategoryKey,
  subcategoryKey: string
): string {
  return `/aerospace/${categoryKey}/${subcategoryKey}`;
}

export function getAerospaceCalculatorPath(
  categoryKey: AerospaceCategoryKey,
  subcategoryKey: string,
  calculatorKey: string
): string {
  return `/aerospace/${categoryKey}/${subcategoryKey}/${calculatorKey}`;
}

