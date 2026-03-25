export type CalculatorCategory = "aerospace";

export type Calculator = {
  slug: string;
  name: string;
  description: string;
  category: CalculatorCategory;
  popular?: boolean;
  added: string; // ISO date
  tags?: string[];
};

export const calculators: Calculator[] = [
  // Aerospace Calculators
  {
    slug: "mach-number",
    name: "Mach Number Calculator",
    description: "Calculate Mach number as the ratio of speed to the speed of sound.",
    category: "aerospace",
    added: "2026-03-17",
    tags: ["mach", "speed", "aerodynamics"],
  },
  {
    slug: "speed-of-sound",
    name: "Speed of Sound Calculator",
    description: "Estimate the speed of sound based on air temperature.",
    category: "aerospace",
    added: "2026-03-17",
    tags: ["speed of sound", "temperature", "aerodynamics"],
  },
  {
    slug: "air-density",
    name: "Air Density Calculator",
    description: "Calculate air density from pressure and temperature.",
    category: "aerospace",
    added: "2026-03-17",
    tags: ["air density", "pressure", "temperature"],
  },
  {
    slug: "pressure-vs-altitude",
    name: "Pressure vs Altitude Calculator",
    description: "Estimate atmospheric pressure at a given altitude.",
    category: "aerospace",
    added: "2026-03-17",
    tags: ["pressure", "altitude", "atmosphere"],
  },
  {
    slug: "temperature-lapse-rate",
    name: "Temperature Lapse Rate Calculator",
    description: "Estimate standard atmosphere temperature change with altitude.",
    category: "aerospace",
    added: "2026-03-17",
    tags: ["temperature", "lapse rate", "atmosphere"],
  },
  {
    slug: "lift-force",
    name: "Lift Force Calculator",
    description: "Calculate aerodynamic lift force for a wing using basic flight mechanics.",
    category: "aerospace",
    added: "2026-03-17",
    tags: ["lift", "aerodynamics", "wing"],
  },
  {
    slug: "drag-force",
    name: "Drag Force Calculator",
    description: "Calculate aerodynamic drag force based on speed, area, and coefficient.",
    category: "aerospace",
    added: "2026-03-17",
    tags: ["drag", "aerodynamics", "aircraft"],
  },
  {
    slug: "lift-to-drag-ratio",
    name: "Lift-to-Drag Ratio Calculator",
    description: "Compute the aerodynamic efficiency of a wing using lift and drag.",
    category: "aerospace",
    added: "2026-03-17",
    tags: ["lift", "drag", "efficiency"],
  },
  {
    slug: "stall-speed",
    name: "Stall Speed Calculator",
    description: "Estimate the minimum flight speed at which an aircraft wing generates lift.",
    category: "aerospace",
    added: "2026-03-17",
    tags: ["stall speed", "lift", "wing"],
  },
  {
    slug: "wing-loading",
    name: "Wing Loading Calculator",
    description: "Calculate wing loading based on aircraft weight and wing area.",
    category: "aerospace",
    added: "2026-03-17",
    tags: ["wing loading", "weight", "aerodynamics"],
  },
  {
    slug: "glide-ratio",
    name: "Glide Ratio Calculator",
    description: "Compute the glide ratio from lift and drag forces.",
    category: "aerospace",
    added: "2026-03-17",
    tags: ["glide", "lift", "drag"],
  },
  {
    slug: "thrust",
    name: "Thrust Calculator",
    description: "Calculate thrust produced by a rocket engine using mass flow rate and exhaust velocity.",
    category: "aerospace",
    added: "2026-03-17",
    tags: ["thrust", "rocket", "propulsion"],
  },
  {
    slug: "thrust-to-weight",
    name: "Thrust-to-Weight Ratio Calculator",
    description: "Compute the thrust-to-weight ratio for a rocket or aircraft.",
    category: "aerospace",
    added: "2026-03-17",
    tags: ["thrust", "weight", "ratio"],
  },
  {
    slug: "fuel-consumption",
    name: "Fuel Consumption Calculator",
    description: "Estimate fuel mass flow rate from thrust and specific impulse.",
    category: "aerospace",
    added: "2026-03-17",
    tags: ["fuel", "consumption", "isp"],
  },
  {
    slug: "specific-impulse",
    name: "Specific Impulse (Isp) Calculator",
    description: "Calculate specific impulse based on thrust and mass flow rate.",
    category: "aerospace",
    added: "2026-03-17",
    tags: ["isp", "thrust", "rocket"],
  },
  {
    slug: "escape-velocity",
    name: "Escape Velocity Calculator",
    description: "Calculate the escape velocity for a body based on its mass and radius.",
    category: "aerospace",
    added: "2026-03-17",
    tags: ["escape velocity", "orbit", "gravity"],
  },
  {
    slug: "orbital-velocity",
    name: "Orbital Velocity Calculator",
    description: "Compute the orbital velocity for a circular orbit around a body.",
    category: "aerospace",
    added: "2026-03-17",
    tags: ["orbital velocity", "orbit", "space"],
  },
  {
    slug: "orbital-period",
    name: "Orbital Period Calculator",
    description: "Calculate the time it takes for one orbit around a body.",
    category: "aerospace",
    added: "2026-03-17",
    tags: ["orbital period", "orbit", "space"],
  },
  {
    slug: "circular-orbit-speed",
    name: "Circular Orbit Speed Calculator",
    description: "Calculate orbital speed for a circular orbit at a given altitude.",
    category: "aerospace",
    added: "2026-03-17",
    tags: ["orbit", "speed", "space"],
  },
];

export const categories: { name: CalculatorCategory; description: string }[] = [
  {
    name: "loans",
    description: "Loan calculators for EMIs, eligibility, and interest.",
  },
  {
    name: "investment",
    description: "Tools to model and forecast investment returns.",
  },
  {
    name: "savings",
    description: "Calculate savings growth and inflation impact.",
  },
  {
    name: "tax",
    description: "Tax planning and compliance calculators.",
  },
  {
    name: "government",
    description: "Government scheme and retirement planning tools.",
  },
  {
    name: "aerospace",
    description: "Aerospace and flight calculators for aircraft and orbital mechanics.",
  },
  {
    name: "drone",
    description: "Drone calculators for flight time, power, energy, and battery management.",
  },
  {
    name: "creator",
    description: "Creator economy tools for earnings and engagement.",
  },
  {
    name: "business",
    description: "Business planning tools for startups and freelancers.",
  },
  {
    name: "utility",
    description: "Everyday utility calculators for quick checks.",
  },
  {
    name: "income",
    description: "Salary and income calculators for payroll and paychecks.",
  },
  {
    name: "health",
    description: "Health and wellness calculators.",
  },
];

// NOTE: Calculator loading and discovery now uses:
// - @/lib/loadCalculator (for JSON config loading)
// - @/lib/getRelatedCalculators (for related/popular/search queries)
//
// The helper functions below operate on the static calculators array
// and are used by components for basic metadata lookup.

export function getCalculatorBySlug(slug: string) {
  return calculators.find((calculator) => calculator.slug === slug);
}

export function getRecentCalculators(limit = 6) {
  return calculators
    .slice()
    .sort((a, b) => new Date(b.added).getTime() - new Date(a.added).getTime())
    .slice(0, limit);
}
aerospace",
    description: "Aerospace and flight calculators for aircraft and orbital mechanic