export type UnitValue = number | {
  toBase: (val: number) => number;
  fromBase: (val: number) => number;
};

export interface ConverterCategory {
  base: string;
  defaultFrom: string;
  defaultTo: string;
  units: Record<string, UnitValue>;
}

export const CONVERTER_DATA: Record<string, ConverterCategory> = {
  Length: {
    base: 'Meter',
    defaultFrom: 'Meter',
    defaultTo: 'Centimeter',
    units: {
      'Millimeter': 0.001,
      'Centimeter': 0.01,
      'Meter': 1,
      'Kilometer': 1000,
      'Inch': 0.0254,
      'Foot': 0.3048,
      'Yard': 0.9144,
      'Mile': 1609.344,
      'Nautical Mile': 1852,
      'Micrometer': 1e-6,
      'Nanometer': 1e-9,
      'Picometer': 1e-12,
      'Light Year': 9.4607304725808e15,
      'Astronomical Unit': 149597870700,
      'Parsec': 3.08567758149137e16,
      'Furlong': 201.168,
      'Chain': 20.1168,
      'Rod': 5.0292,
      'Hand': 0.1016,
      'Angstrom': 1e-10,
    }
  },
  Temperature: {
    base: 'Kelvin',
    defaultFrom: 'Celsius',
    defaultTo: 'Fahrenheit',
    units: {
      'Kelvin': 1,
      'Celsius': { toBase: c => c + 273.15, fromBase: k => k - 273.15 },
      'Fahrenheit': { toBase: f => (f - 32) * 5/9 + 273.15, fromBase: k => (k - 273.15) * 9/5 + 32 },
      'Rankine': { toBase: r => r * 5/9, fromBase: k => k * 9/5 },
      'Réaumur': { toBase: r => r * 1.25 + 273.15, fromBase: k => (k - 273.15) * 0.8 },
    }
  },
  Weight: {
    base: 'Kilogram',
    defaultFrom: 'Kilogram',
    defaultTo: 'Gram',
    units: {
      'Milligram': 1e-6,
      'Gram': 1e-3,
      'Kilogram': 1,
      'Metric Ton': 1000,
      'Pound': 0.45359237,
      'Ounce': 0.028349523125,
      'Stone': 6.35029318,
      'Carat': 0.0002,
      'Atomic Mass Unit': 1.66053906660e-27,
      'Ton (US)': 907.18474,
      'Ton (UK)': 1016.0469088,
    }
  },
  Volume: {
    base: 'Liter',
    defaultFrom: 'Liter',
    defaultTo: 'Milliliter',
    units: {
      'Milliliter': 0.001,
      'Liter': 1,
      'Cubic Meter': 1000,
      'Cubic Centimeter': 0.001,
      'Gallon (US)': 3.785411784,
      'Gallon (UK)': 4.54609,
      'Pint': 0.473176473,
      'Quart': 0.946352946,
      'Cup': 0.2365882365,
      'Tablespoon': 0.0147867648,
      'Teaspoon': 0.00492892159,
      'Fluid Ounce': 0.0295735296,
      'Barrel': 119.240471,
    }
  },
  Speed: {
    base: 'm/s',
    defaultFrom: 'km/h',
    defaultTo: 'mph',
    units: {
      'm/s': 1,
      'km/h': 0.2777777778,
      'mph': 0.44704,
      'knot': 0.514444,
      'Mach': 340.29,
      'Speed of Light': 299792458,
      'ft/s': 0.3048,
    }
  },
  Area: {
    base: 'Square meter',
    defaultFrom: 'Square meter',
    defaultTo: 'Square foot',
    units: {
      'Square meter': 1,
      'Square kilometer': 1e6,
      'Square mile': 2589988.110336,
      'Square foot': 0.09290304,
      'Square inch': 0.00064516,
      'Acre': 4046.8564224,
      'Hectare': 10000,
      'Square yard': 0.83612736,
    }
  },
  Energy: {
    base: 'Joule',
    defaultFrom: 'Joule',
    defaultTo: 'Kilocalorie',
    units: {
      'Joule': 1,
      'Kilojoule': 1000,
      'Calorie': 4.184,
      'Kilocalorie': 4184,
      'Watt-hour': 3600,
      'Kilowatt-hour': 3600000,
      'Electronvolt': 1.602176634e-19,
      'BTU': 1055.05585262,
    }
  },
  Power: {
    base: 'Watt',
    defaultFrom: 'Watt',
    defaultTo: 'Kilowatt',
    units: {
      'Watt': 1,
      'Kilowatt': 1000,
      'Megawatt': 1000000,
      'Horsepower': 745.699872,
      'BTU/hour': 0.29307107,
      'dBm': { 
        toBase: dbm => Math.pow(10, (dbm - 30) / 10), 
        fromBase: w => w <= 0 ? -Infinity : 10 * Math.log10(w * 1000) 
      }
    }
  },
  Time: {
    base: 'Second',
    defaultFrom: 'Hour',
    defaultTo: 'Minute',
    units: {
      'Nanosecond': 1e-9,
      'Microsecond': 1e-6,
      'Millisecond': 1e-3,
      'Second': 1,
      'Minute': 60,
      'Hour': 3600,
      'Day': 86400,
      'Week': 604800,
      'Month': 2629800,
      'Year': 31557600,
      'Decade': 315576000,
      'Century': 3155760000,
    }
  },
  Data: {
    base: 'Byte',
    defaultFrom: 'Gigabyte',
    defaultTo: 'Megabyte',
    units: {
      'Bit': 0.125,
      'Byte': 1,
      'Kilobyte': 1000,
      'Megabyte': 1e6,
      'Gigabyte': 1e9,
      'Terabyte': 1e12,
      'Petabyte': 1e15,
      'Kibibyte': 1024,
      'Mebibyte': 1048576,
      'Gibibyte': 1073741824,
    }
  },
  Currency: {
    base: 'USD',
    defaultFrom: 'USD',
    defaultTo: 'INR',
    units: {
      'USD': 1,
      'INR': 0.012,
      'EUR': 1.08,
      'GBP': 1.25,
      'JPY': 0.0067,
      'CNY': 0.14,
      'AUD': 0.65,
      'CAD': 0.74,
      'SGD': 0.74,
      'AED': 0.27,
      'CHF': 1.11,
      'RUB': 0.011,
      'KRW': 0.00075,
      'BRL': 0.20,
      'ZAR': 0.053,
    }
  }
}
