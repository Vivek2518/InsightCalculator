type InputDef = {
  key: string;
  label: string;
  description: string;
  unit?: string;
  hint?: string;
  defaultValue?: number;
};

export type FormulaProfile = {
  inputDefinitions: InputDef[];
  formulaLatex: string;
  formulaExplanation: string;
  calculationType?: "genericRatio" | "droneRequiredThrust" | "droneThrustToWeightRatio";
  resultLabel?: string;
  resultUnit?: string;
};

const DEFAULT_PROFILE: FormulaProfile = {
  inputDefinitions: [
    { key: "input1", label: "Primary Input", description: "Main driving variable", unit: "SI" },
    { key: "input2", label: "Secondary Input", description: "Supporting variable", unit: "SI" },
    { key: "input3", label: "Scale/Reference", description: "Reference or scaling value", unit: "SI" },
  ],
  formulaLatex: "Result = (Primary Input * Secondary Input) / Scale",
  formulaExplanation: "Generic engineering ratio form used as a fallback when a dedicated formula profile is not defined.",
  calculationType: "genericRatio",
  resultLabel: "Calculated output",
};

type FormulaProfileContext = {
  categoryKey?: string;
  subcategoryKey?: string;
};

export function getAerospaceFormulaProfile(
  calculatorTitle: string,
  context: FormulaProfileContext = {}
): FormulaProfile {
  const t = calculatorTitle.toLowerCase();
  const categoryKey = context.categoryKey?.toLowerCase();
  const subcategoryKey = context.subcategoryKey?.toLowerCase();

  if (categoryKey === "drone" && subcategoryKey === "thrust-to-weight-sizing") {
    if (t === "required thrust") {
      return {
        inputDefinitions: [
          { key: "mass", label: "Mass (m)", description: "Total drone mass", unit: "kg" },
          { key: "gravity", label: "Gravity (g)", description: "Gravitational acceleration, typically 9.81", unit: "m/s^2", defaultValue: 9.81 },
          { key: "thrustFactor", label: "Thrust Factor (k)", description: "Sizing margin for maneuvering and reserve thrust, default 2.5", unit: "-", defaultValue: 2.5 },
          { key: "efficiency", label: "Efficiency (eta)", description: "Overall propulsion efficiency used in sizing, default 0.8", unit: "-", defaultValue: 0.8 },
        ],
        formulaLatex: "T_required = (m × g × k) / η",
        formulaExplanation: "Required thrust is sized from vehicle weight, thrust margin, and overall efficiency.",
        calculationType: "droneRequiredThrust",
        resultLabel: "Required thrust",
        resultUnit: "N",
      };
    }

    if (t === "thrust-to-weight ratio") {
      return {
        inputDefinitions: [
          { key: "totalThrust", label: "Available Thrust (T_available)", description: "Total thrust from all motors", unit: "N" },
          { key: "mass", label: "Mass (m)", description: "Total drone mass", unit: "kg" },
          { key: "gravity", label: "Gravity (g)", description: "Gravitational acceleration, typically 9.81", unit: "m/s^2", defaultValue: 9.81 },
          { key: "efficiency", label: "Efficiency (eta)", description: "Overall propulsion efficiency, default 0.8", unit: "-", defaultValue: 0.8 },
        ],
        formulaLatex: "TWR = (T_available × η) / (m × g)",
        formulaExplanation: "Thrust-to-weight ratio compares efficiency-adjusted available thrust against vehicle weight.",
        calculationType: "droneThrustToWeightRatio",
        resultLabel: "Thrust-to-weight ratio",
      };
    }
  }

  if (t.includes("air density")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Pressure (P)", description: "Static pressure", unit: "Pa" },
        { key: "input2", label: "Temperature (T)", description: "Absolute temperature", unit: "K" },
        { key: "input3", label: "Gas Constant (R)", description: "Specific gas constant for air", unit: "J/kg.K" },
      ],
      formulaLatex: "rho = P / (R * T)",
      formulaExplanation: "Air density is obtained from the ideal gas equation using pressure and absolute temperature.",
    };
  }
  if (t.includes("speed of sound")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Gamma (gamma)", description: "Ratio of specific heats", unit: "-" },
        { key: "input2", label: "Gas Constant (R)", description: "Specific gas constant", unit: "J/kg.K" },
        { key: "input3", label: "Temperature (T)", description: "Absolute temperature", unit: "K" },
      ],
      formulaLatex: "a = sqrt(gamma * R * T)",
      formulaExplanation: "Speed of sound depends on thermodynamic properties and local temperature.",
    };
  }
  if (t.includes("mach number")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Velocity (V)", description: "Flow or aircraft speed", unit: "m/s" },
        { key: "input2", label: "Speed of Sound (a)", description: "Local speed of sound", unit: "m/s" },
        { key: "input3", label: "Reference", description: "Use 1 if unused", unit: "-" },
      ],
      formulaLatex: "M = V / a",
      formulaExplanation: "Mach number is the ratio of local velocity to local speed of sound.",
    };
  }
  if (t.includes("reynolds number")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Density (rho)", description: "Fluid density", unit: "kg/m^3" },
        { key: "input2", label: "Velocity (V)", description: "Characteristic flow speed", unit: "m/s" },
        { key: "input3", label: "mu / L Combined", description: "Set as (mu / L) denominator term", unit: "Pa.s/m" },
      ],
      formulaLatex: "Re = (rho * V * L) / mu",
      formulaExplanation: "Reynolds number compares inertial and viscous effects in a flow.",
    };
  }
  if (t.includes("dynamic pressure")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Density (rho)", description: "Air density", unit: "kg/m^3" },
        { key: "input2", label: "Velocity (V)", description: "Flow speed", unit: "m/s" },
        { key: "input3", label: "Reference", description: "Use 1 if unused", unit: "-" },
      ],
      formulaLatex: "q = 0.5 * rho * V^2",
      formulaExplanation: "Dynamic pressure is the kinetic energy per unit volume of the flow.",
    };
  }
  if (t.includes("lift force")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Dynamic Pressure (q)", description: "0.5*rho*V^2", unit: "Pa" },
        { key: "input2", label: "Wing Area (S)", description: "Reference area", unit: "m^2" },
        { key: "input3", label: "Lift Coefficient (Cl)", description: "Aerodynamic lift coefficient", unit: "-" },
      ],
      formulaLatex: "L = q * S * Cl",
      formulaExplanation: "Lift force is computed using dynamic pressure, area, and lift coefficient.",
    };
  }
  if (t.includes("drag force")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Dynamic Pressure (q)", description: "0.5*rho*V^2", unit: "Pa" },
        { key: "input2", label: "Reference Area (S)", description: "Frontal/wing reference area", unit: "m^2" },
        { key: "input3", label: "Drag Coefficient (Cd)", description: "Aerodynamic drag coefficient", unit: "-" },
      ],
      formulaLatex: "D = q * S * Cd",
      formulaExplanation: "Drag force follows the standard quadratic drag relation.",
    };
  }
  if (t.includes("lift coefficient")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Lift (L)", description: "Measured/target lift force", unit: "N" },
        { key: "input2", label: "Dynamic Pressure (q)", description: "0.5*rho*V^2", unit: "Pa" },
        { key: "input3", label: "Wing Area (S)", description: "Reference area", unit: "m^2" },
      ],
      formulaLatex: "Cl = L / (q * S)",
      formulaExplanation: "Lift coefficient normalizes lift by flow energy and area.",
    };
  }
  if (t.includes("drag coefficient")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Drag (D)", description: "Measured/target drag force", unit: "N" },
        { key: "input2", label: "Dynamic Pressure (q)", description: "0.5*rho*V^2", unit: "Pa" },
        { key: "input3", label: "Reference Area (S)", description: "Area basis", unit: "m^2" },
      ],
      formulaLatex: "Cd = D / (q * S)",
      formulaExplanation: "Drag coefficient normalizes drag by dynamic pressure and area.",
    };
  }
  if (t.includes("lift-to-drag ratio") || t.includes("glide ratio")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Lift (L)", description: "Lift force", unit: "N" },
        { key: "input2", label: "Drag (D)", description: "Drag force", unit: "N" },
        { key: "input3", label: "Reference", description: "Use 1 if unused", unit: "-" },
      ],
      formulaLatex: "L/D = L / D",
      formulaExplanation: "Lift-to-drag ratio indicates aerodynamic efficiency.",
    };
  }
  if (t.includes("aspect ratio")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Wingspan (b)", description: "Total wingspan", unit: "m" },
        { key: "input2", label: "Wing Area (S)", description: "Planform area", unit: "m^2" },
        { key: "input3", label: "Reference", description: "Use 1 if unused", unit: "-" },
      ],
      formulaLatex: "AR = b^2 / S",
      formulaExplanation: "Aspect ratio is a key geometric parameter for wing performance.",
    };
  }
  if (t.includes("wing loading")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Weight (W)", description: "Aircraft weight", unit: "N" },
        { key: "input2", label: "Wing Area (S)", description: "Wing area", unit: "m^2" },
        { key: "input3", label: "Reference", description: "Use 1 if unused", unit: "-" },
      ],
      formulaLatex: "Wing Loading = W / S",
      formulaExplanation: "Wing loading affects stall speed, maneuverability, and performance.",
    };
  }
  if (t.includes("stall speed")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Weight (W)", description: "Aircraft weight", unit: "N" },
        { key: "input2", label: "rho * S Combined", description: "Product of density and wing area", unit: "kg/m" },
        { key: "input3", label: "Cl,max", description: "Maximum lift coefficient", unit: "-" },
      ],
      formulaLatex: "Vs = sqrt((2W)/(rho*S*Cl,max))",
      formulaExplanation: "Stall speed is the minimum speed needed to generate enough lift.",
    };
  }
  if (t.includes("normal stress")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Force (F)", description: "Axial load", unit: "N" },
        { key: "input2", label: "Area (A)", description: "Cross-sectional area", unit: "m^2" },
        { key: "input3", label: "Reference", description: "Use 1 if unused", unit: "-" },
      ],
      formulaLatex: "sigma = F / A",
      formulaExplanation: "Normal stress is axial force distributed over cross-sectional area.",
    };
  }
  if (t.includes("shear stress") && t.includes("torsion")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Torque (T)", description: "Applied torque", unit: "N.m" },
        { key: "input2", label: "Radius (r)", description: "Outer radius", unit: "m" },
        { key: "input3", label: "Polar Moment (J)", description: "Polar second moment", unit: "m^4" },
      ],
      formulaLatex: "tau = (T * r) / J",
      formulaExplanation: "Torsional shear stress varies linearly with radius in circular shafts.",
    };
  }
  if (t.includes("shear stress")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Shear Force (V)", description: "Applied shear", unit: "N" },
        { key: "input2", label: "Area (A)", description: "Shear area", unit: "m^2" },
        { key: "input3", label: "Reference", description: "Use 1 if unused", unit: "-" },
      ],
      formulaLatex: "tau = V / A",
      formulaExplanation: "Average shear stress is shear force divided by area.",
    };
  }
  if (t.includes("strain")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Delta Length", description: "Length change", unit: "m" },
        { key: "input2", label: "Original Length", description: "Initial length", unit: "m" },
        { key: "input3", label: "Reference", description: "Use 1 if unused", unit: "-" },
      ],
      formulaLatex: "epsilon = Delta L / L0",
      formulaExplanation: "Engineering strain is relative elongation or contraction.",
    };
  }
  if (t.includes("young")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Stress (sigma)", description: "Normal stress", unit: "Pa" },
        { key: "input2", label: "Strain (epsilon)", description: "Normal strain", unit: "-" },
        { key: "input3", label: "Reference", description: "Use 1 if unused", unit: "-" },
      ],
      formulaLatex: "E = sigma / epsilon",
      formulaExplanation: "Young's modulus relates stress and strain in linear elastic range.",
    };
  }
  if (t.includes("bending stress")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Moment (M)", description: "Bending moment", unit: "N.m" },
        { key: "input2", label: "Distance (y)", description: "Distance from neutral axis", unit: "m" },
        { key: "input3", label: "Second Moment (I)", description: "Area moment of inertia", unit: "m^4" },
      ],
      formulaLatex: "sigma = (M * y) / I",
      formulaExplanation: "Flexure formula gives normal stress due to bending.",
    };
  }
  if (t.includes("beam deflection")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Load (F)", description: "Point load", unit: "N" },
        { key: "input2", label: "Length (L)", description: "Beam span", unit: "m" },
        { key: "input3", label: "E*I Combined", description: "Flexural rigidity term", unit: "N.m^2" },
      ],
      formulaLatex: "delta = (F * L^3) / (3 * E * I)",
      formulaExplanation: "Cantilever tip deflection formula under point load (simplified case).",
    };
  }
  if (t.includes("angle of twist")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Torque (T)", description: "Applied torque", unit: "N.m" },
        { key: "input2", label: "Length (L)", description: "Shaft length", unit: "m" },
        { key: "input3", label: "G*J Combined", description: "Torsional rigidity term", unit: "N.m^2" },
      ],
      formulaLatex: "theta = (T * L) / (G * J)",
      formulaExplanation: "Angle of twist from classical torsion relation.",
    };
  }
  if (t.includes("euler buckling")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "E", description: "Elastic modulus", unit: "Pa" },
        { key: "input2", label: "I", description: "Area moment of inertia", unit: "m^4" },
        { key: "input3", label: "(K*L)^2", description: "Effective length squared term", unit: "m^2" },
      ],
      formulaLatex: "Pcr = (pi^2 * E * I) / (K*L)^2",
      formulaExplanation: "Euler critical load for ideal column buckling.",
    };
  }
  if (t.includes("thrust") && t.includes("weight ratio")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Thrust (T)", description: "Total thrust", unit: "N" },
        { key: "input2", label: "Weight (W)", description: "Vehicle weight", unit: "N" },
        { key: "input3", label: "Reference", description: "Use 1 if unused", unit: "-" },
      ],
      formulaLatex: "T/W = T / W",
      formulaExplanation: "Thrust-to-weight ratio indicates acceleration/climb capability.",
      calculationType: "genericRatio",
      resultLabel: "Thrust-to-weight ratio",
    };
  }
  if (t.includes("thrust")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Mass Flow (m_dot)", description: "Mass flow rate", unit: "kg/s" },
        { key: "input2", label: "Exit Velocity (Ve)", description: "Exhaust velocity", unit: "m/s" },
        { key: "input3", label: "Pressure Term", description: "(Pe-P0)*Ae equivalent term", unit: "N" },
      ],
      formulaLatex: "T = m_dot*Ve + (Pe - P0)*Ae",
      formulaExplanation: "Total thrust includes momentum thrust and pressure thrust.",
    };
  }
  if (t.includes("isp")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Thrust (T)", description: "Engine thrust", unit: "N" },
        { key: "input2", label: "Mass Flow (m_dot)", description: "Propellant flow", unit: "kg/s" },
        { key: "input3", label: "g0", description: "Standard gravity", unit: "m/s^2" },
      ],
      formulaLatex: "Isp = T / (m_dot * g0)",
      formulaExplanation: "Specific impulse measures propulsion efficiency.",
    };
  }
  if (t.includes("effective exhaust velocity")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Isp", description: "Specific impulse", unit: "s" },
        { key: "input2", label: "g0", description: "Standard gravity", unit: "m/s^2" },
        { key: "input3", label: "Reference", description: "Use 1 if unused", unit: "-" },
      ],
      formulaLatex: "Ve = Isp * g0",
      formulaExplanation: "Effective exhaust velocity is directly linked to specific impulse.",
    };
  }
  if (t.includes("fuel flow")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Thrust (T)", description: "Required thrust", unit: "N" },
        { key: "input2", label: "Isp", description: "Specific impulse", unit: "s" },
        { key: "input3", label: "g0", description: "Standard gravity", unit: "m/s^2" },
      ],
      formulaLatex: "m_dot = T / (Isp * g0)",
      formulaExplanation: "Fuel flow is derived from thrust and propulsion efficiency.",
    };
  }
  if (t.includes("advance ratio")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Velocity (V)", description: "Flight speed", unit: "m/s" },
        { key: "input2", label: "Rotational Speed (n)", description: "Rev/s", unit: "1/s" },
        { key: "input3", label: "Diameter (D)", description: "Propeller diameter", unit: "m" },
      ],
      formulaLatex: "J = V / (n * D)",
      formulaExplanation: "Advance ratio is a non-dimensional propeller operating parameter.",
    };
  }
  if (t.includes("propeller efficiency") || t === "efficiency" || t.includes("propulsive efficiency")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Thrust (T)", description: "Useful thrust", unit: "N" },
        { key: "input2", label: "Velocity (V)", description: "Vehicle speed", unit: "m/s" },
        { key: "input3", label: "Shaft Power", description: "Input power", unit: "W" },
      ],
      formulaLatex: "eta = (T * V) / P",
      formulaExplanation: "Efficiency is useful power out divided by power in.",
    };
  }
  if (t.includes("tsfc")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Fuel Flow", description: "Fuel flow rate", unit: "kg/s" },
        { key: "input2", label: "Thrust", description: "Engine thrust", unit: "N" },
        { key: "input3", label: "Reference", description: "Use 1 if unused", unit: "-" },
      ],
      formulaLatex: "TSFC = m_dot_f / T",
      formulaExplanation: "TSFC measures fuel burned per unit thrust.",
    };
  }
  if (t.includes("exit velocity")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "gamma", description: "Specific heat ratio", unit: "-" },
        { key: "input2", label: "R*T0 Combined", description: "Gas constant times chamber temperature", unit: "J/kg" },
        { key: "input3", label: "Pressure Ratio Term", description: "Isentropic pressure term", unit: "-" },
      ],
      formulaLatex: "Ve = sqrt(2*gamma/(gamma-1) * R*T0 * (1-(Pe/P0)^((gamma-1)/gamma)))",
      formulaExplanation: "Nozzle exit velocity from isentropic flow relations.",
    };
  }
  if (t.includes("mass flow rate")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Density (rho)", description: "Fluid density", unit: "kg/m^3" },
        { key: "input2", label: "Area (A)", description: "Flow area", unit: "m^2" },
        { key: "input3", label: "Velocity (V)", description: "Flow velocity", unit: "m/s" },
      ],
      formulaLatex: "m_dot = rho * A * V",
      formulaExplanation: "Mass flow is density times volumetric flow rate.",
    };
  }
  if (t.includes("rate of climb")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Excess Power", description: "Power available - power required", unit: "W" },
        { key: "input2", label: "Weight (W)", description: "Aircraft weight", unit: "N" },
        { key: "input3", label: "Reference", description: "Use 1 if unused", unit: "-" },
      ],
      formulaLatex: "ROC = (Pavail - Preq) / W",
      formulaExplanation: "Rate of climb comes from excess power per unit weight.",
    };
  }
  if (t.includes("range") && !t.includes("payload")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Velocity (V)", description: "Cruise speed", unit: "m/s" },
        { key: "input2", label: "Fuel Fraction Term", description: "ln(Wi/Wf) or equivalent", unit: "-" },
        { key: "input3", label: "Specific Fuel Term", description: "c/(L/D) equivalent denominator", unit: "1/s" },
      ],
      formulaLatex: "R ~ (V/c) * (L/D) * ln(Wi/Wf)",
      formulaExplanation: "Simplified Breguet-style range relation for cruise performance.",
    };
  }
  if (t.includes("endurance") || t.includes("hover time") || t === "flight time") {
    return {
      inputDefinitions: [
        { key: "input1", label: "Energy Available", description: "Battery/fuel usable energy", unit: "Wh" },
        { key: "input2", label: "Power Required", description: "Average power draw", unit: "W" },
        { key: "input3", label: "Reference", description: "Use 1 if unused", unit: "-" },
      ],
      formulaLatex: "Time = Energy / Power",
      formulaExplanation: "Operating time is available energy divided by average power demand.",
    };
  }
  if (t.includes("takeoff distance") || t.includes("landing distance")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Velocity (V)", description: "Target speed", unit: "m/s" },
        { key: "input2", label: "Acceleration/Deceleration (a)", description: "Longitudinal acceleration", unit: "m/s^2" },
        { key: "input3", label: "Reference", description: "Use 1 if unused", unit: "-" },
      ],
      formulaLatex: "s = V^2 / (2*a)",
      formulaExplanation: "Kinematic estimate of ground distance under constant acceleration.",
    };
  }
  if (t.includes("static margin")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Neutral Point (Xnp)", description: "Aerodynamic neutral point", unit: "m" },
        { key: "input2", label: "CG Position (Xcg)", description: "Center of gravity location", unit: "m" },
        { key: "input3", label: "MAC", description: "Mean aerodynamic chord", unit: "m" },
      ],
      formulaLatex: "SM = (Xnp - Xcg) / MAC",
      formulaExplanation: "Static margin quantifies longitudinal stability reserve.",
    };
  }
  if (t.includes("turn radius")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Velocity (V)", description: "True airspeed", unit: "m/s" },
        { key: "input2", label: "g", description: "Gravity", unit: "m/s^2" },
        { key: "input3", label: "tan(phi)", description: "Tangent of bank angle", unit: "-" },
      ],
      formulaLatex: "R = V^2 / (g * tan(phi))",
      formulaExplanation: "Turn radius decreases with higher bank angle and lower speed.",
    };
  }
  if (t.includes("turn rate")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "g", description: "Gravity", unit: "m/s^2" },
        { key: "input2", label: "tan(phi)", description: "Tangent of bank angle", unit: "-" },
        { key: "input3", label: "Velocity (V)", description: "True airspeed", unit: "m/s" },
      ],
      formulaLatex: "omega = (g * tan(phi)) / V",
      formulaExplanation: "Turn rate rises with bank angle and falls with speed.",
    };
  }
  if (t.includes("orbital period")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Semi-major Axis (a)", description: "Orbit semi-major axis", unit: "m" },
        { key: "input2", label: "mu", description: "Standard gravitational parameter", unit: "m^3/s^2" },
        { key: "input3", label: "Reference", description: "Use 1 if unused", unit: "-" },
      ],
      formulaLatex: "T = 2*pi*sqrt(a^3/mu)",
      formulaExplanation: "Kepler's third law gives orbital period from orbit size.",
    };
  }
  if (t.includes("orbital velocity") || t.includes("circular velocity")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "mu", description: "Gravitational parameter", unit: "m^3/s^2" },
        { key: "input2", label: "Radius (r)", description: "Orbital radius", unit: "m" },
        { key: "input3", label: "Reference", description: "Use 1 if unused", unit: "-" },
      ],
      formulaLatex: "v = sqrt(mu/r)",
      formulaExplanation: "Circular orbital velocity from balance of gravity and centripetal demand.",
    };
  }
  if (t.includes("escape velocity")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "mu", description: "Gravitational parameter", unit: "m^3/s^2" },
        { key: "input2", label: "Radius (r)", description: "Distance from center", unit: "m" },
        { key: "input3", label: "Reference", description: "Use 1 if unused", unit: "-" },
      ],
      formulaLatex: "vesc = sqrt(2*mu/r)",
      formulaExplanation: "Escape velocity is sqrt(2) times circular speed at same radius.",
    };
  }
  if (t.includes("delta-v") || t.includes("tsiolkovsky")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Isp", description: "Specific impulse", unit: "s" },
        { key: "input2", label: "g0", description: "Standard gravity", unit: "m/s^2" },
        { key: "input3", label: "Mass Ratio", description: "m0/mf", unit: "-" },
      ],
      formulaLatex: "DeltaV = Isp * g0 * ln(m0/mf)",
      formulaExplanation: "Tsiolkovsky rocket equation relates delta-v to mass ratio and Isp.",
    };
  }
  if (t.includes("mass ratio")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Initial Mass (m0)", description: "Mass before burn", unit: "kg" },
        { key: "input2", label: "Final Mass (mf)", description: "Mass after burn", unit: "kg" },
        { key: "input3", label: "Reference", description: "Use 1 if unused", unit: "-" },
      ],
      formulaLatex: "Mass Ratio = m0 / mf",
      formulaExplanation: "Mass ratio drives achievable delta-v.",
    };
  }
  if (t.includes("gravitational force")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Mass 1 (m1)", description: "First body mass", unit: "kg" },
        { key: "input2", label: "Mass 2 (m2)", description: "Second body mass", unit: "kg" },
        { key: "input3", label: "Distance^2 (r^2)", description: "Squared separation distance", unit: "m^2" },
      ],
      formulaLatex: "F = G*m1*m2/r^2",
      formulaExplanation: "Newton's law of universal gravitation.",
    };
  }
  if (t.includes("orbital energy")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "mu", description: "Gravitational parameter", unit: "m^3/s^2" },
        { key: "input2", label: "Semi-major Axis (a)", description: "Orbit semi-major axis", unit: "m" },
        { key: "input3", label: "Reference", description: "Use 1 if unused", unit: "-" },
      ],
      formulaLatex: "epsilon = -mu/(2*a)",
      formulaExplanation: "Specific orbital energy for bound Keplerian orbit.",
    };
  }
  if (t.includes("battery capacity")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Current (I)", description: "Average current draw", unit: "A" },
        { key: "input2", label: "Time (t)", description: "Operating time", unit: "h" },
        { key: "input3", label: "Reference", description: "Use 1 if unused", unit: "-" },
      ],
      formulaLatex: "Capacity (Ah) = I * t",
      formulaExplanation: "Battery capacity relates current draw and duration.",
    };
  }
  if (t.includes("power consumption") || t.includes("power required") || t.includes("power available")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Voltage (V)", description: "Supply voltage", unit: "V" },
        { key: "input2", label: "Current (I)", description: "Current draw", unit: "A" },
        { key: "input3", label: "Reference", description: "Use 1 if unused", unit: "-" },
      ],
      formulaLatex: "P = V * I",
      formulaExplanation: "Electrical/mechanical power relation used for quick estimates.",
    };
  }
  if (t.includes("current draw")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Power (P)", description: "Required power", unit: "W" },
        { key: "input2", label: "Voltage (V)", description: "Battery voltage", unit: "V" },
        { key: "input3", label: "Reference", description: "Use 1 if unused", unit: "-" },
      ],
      formulaLatex: "I = P / V",
      formulaExplanation: "Current draw follows from power and voltage.",
    };
  }
  if (t.includes("total thrust") || t.includes("required thrust") || t.includes("max payload")) {
    return {
      inputDefinitions: [
        { key: "input1", label: "Mass (m)", description: "Vehicle mass", unit: "kg" },
        { key: "input2", label: "g", description: "Gravity", unit: "m/s^2" },
        { key: "input3", label: "T/W Target", description: "Desired thrust-to-weight ratio", unit: "-" },
      ],
      formulaLatex: "Trequired = m * g * (T/W)",
      formulaExplanation: "Required total thrust scales with weight and chosen performance margin.",
      calculationType: "genericRatio",
      resultLabel: "Required thrust",
      resultUnit: "N",
    };
  }

  return DEFAULT_PROFILE;
}
