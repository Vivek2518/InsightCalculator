const ISA_STANDARD_GRAVITY = 9.80665;
const ISA_SPECIFIC_GAS_CONSTANT = 287.05;
const ISA_SEA_LEVEL_TEMPERATURE = 288.15;
const ISA_SEA_LEVEL_PRESSURE = 101325;
const SUTHERLAND_REFERENCE_TEMPERATURE = 273.15;
const SUTHERLAND_REFERENCE_VISCOSITY = 1.716e-5;
const SUTHERLAND_CONSTANT = 110.4;

export const ISA_MAX_ALTITUDE_METERS = 86000;

type IsaLayerDefinition = {
  label: string;
  baseAltitude: number;
  topAltitude: number;
  lapseRate: number;
};

type IsaLayer = IsaLayerDefinition & {
  baseTemperature: number;
  basePressure: number;
};

const ISA_LAYER_DEFINITIONS: IsaLayerDefinition[] = [
  { label: "Troposphere", baseAltitude: 0, topAltitude: 11000, lapseRate: -0.0065 },
  { label: "Lower Stratosphere", baseAltitude: 11000, topAltitude: 20000, lapseRate: 0 },
  { label: "Mid Stratosphere", baseAltitude: 20000, topAltitude: 32000, lapseRate: 0.001 },
  { label: "Upper Stratosphere", baseAltitude: 32000, topAltitude: 47000, lapseRate: 0.0028 },
  { label: "Stratopause", baseAltitude: 47000, topAltitude: 51000, lapseRate: 0 },
  { label: "Mesosphere", baseAltitude: 51000, topAltitude: 71000, lapseRate: -0.0028 },
  { label: "Upper Mesosphere", baseAltitude: 71000, topAltitude: ISA_MAX_ALTITUDE_METERS, lapseRate: -0.002 },
];

function getIsaPressure(
  basePressure: number,
  baseTemperature: number,
  lapseRate: number,
  altitudeDelta: number,
  temperature: number
): number {
  if (lapseRate === 0) {
    return (
      basePressure *
      Math.exp(
        (-ISA_STANDARD_GRAVITY * altitudeDelta) /
          (ISA_SPECIFIC_GAS_CONSTANT * baseTemperature)
      )
    );
  }

  return (
    basePressure *
    Math.pow(
      temperature / baseTemperature,
      -ISA_STANDARD_GRAVITY / (ISA_SPECIFIC_GAS_CONSTANT * lapseRate)
    )
  );
}

function buildIsaLayers(): IsaLayer[] {
  let baseTemperature = ISA_SEA_LEVEL_TEMPERATURE;
  let basePressure = ISA_SEA_LEVEL_PRESSURE;

  return ISA_LAYER_DEFINITIONS.map((definition) => {
    const layer: IsaLayer = {
      ...definition,
      baseTemperature,
      basePressure,
    };

    const topTemperature =
      layer.baseTemperature +
      layer.lapseRate * (layer.topAltitude - layer.baseAltitude);
    const topPressure = getIsaPressure(
      layer.basePressure,
      layer.baseTemperature,
      layer.lapseRate,
      layer.topAltitude - layer.baseAltitude,
      topTemperature
    );

    baseTemperature = topTemperature;
    basePressure = topPressure;

    return layer;
  });
}

const ISA_LAYERS = buildIsaLayers();

export type IsaAirDensityResult = {
  altitude: number;
  density: number;
  pressure: number;
  temperature: number;
  layer: string;
};

export function calculateIsaAirDensity(
  altitudeMeters: number
): IsaAirDensityResult | null {
  if (
    !Number.isFinite(altitudeMeters) ||
    altitudeMeters < 0 ||
    altitudeMeters > ISA_MAX_ALTITUDE_METERS
  ) {
    return null;
  }

  const layer = ISA_LAYERS.find((item, index) => {
    const isLastLayer = index === ISA_LAYERS.length - 1;
    const isWithinTop = isLastLayer
      ? altitudeMeters <= item.topAltitude
      : altitudeMeters < item.topAltitude;

    return altitudeMeters >= item.baseAltitude && isWithinTop;
  });

  if (!layer) {
    return null;
  }

  const altitudeDelta = altitudeMeters - layer.baseAltitude;
  const temperature = layer.baseTemperature + layer.lapseRate * altitudeDelta;
  const pressure = getIsaPressure(
    layer.basePressure,
    layer.baseTemperature,
    layer.lapseRate,
    altitudeDelta,
    temperature
  );

  return {
    altitude: altitudeMeters,
    density: pressure / (ISA_SPECIFIC_GAS_CONSTANT * temperature),
    pressure,
    temperature,
    layer: layer.label,
  };
}

export function calculateSutherlandDynamicViscosity(
  temperatureKelvin: number
): number | null {
  if (!Number.isFinite(temperatureKelvin) || temperatureKelvin <= 0) {
    return null;
  }

  return (
    SUTHERLAND_REFERENCE_VISCOSITY *
    Math.pow(
      temperatureKelvin / SUTHERLAND_REFERENCE_TEMPERATURE,
      1.5
    ) *
    ((SUTHERLAND_REFERENCE_TEMPERATURE + SUTHERLAND_CONSTANT) /
      (temperatureKelvin + SUTHERLAND_CONSTANT))
  );
}

type ReynoldsNumberInput = {
  density: number;
  velocity: number;
  characteristicLength: number;
  dynamicViscosity: number;
};

export function calculateReynoldsNumber({
  density,
  velocity,
  characteristicLength,
  dynamicViscosity,
}: ReynoldsNumberInput): number | null {
  if (
    !Number.isFinite(density) ||
    !Number.isFinite(velocity) ||
    !Number.isFinite(characteristicLength) ||
    !Number.isFinite(dynamicViscosity) ||
    density <= 0 ||
    velocity < 0 ||
    characteristicLength <= 0 ||
    dynamicViscosity <= 0
  ) {
    return null;
  }

  return (density * velocity * characteristicLength) / dynamicViscosity;
}
