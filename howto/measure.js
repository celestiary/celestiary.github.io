const magnitudeByAbbrev = {};
const magnitudeByName = {};

class Magnitude {
  constructor(exponent, name, abbrev) {
    this.exponent = exponent;
    this.name = name;
    this.abbrev = abbrev;
    magnitudeByName[name] = this;
    magnitudeByAbbrev[abbrev] = this;
  }


  /**
   * Converts the given scalar in the given magnitude to the
   * equivalent scalar in this magnitude.
   */
  from(scalar, mag) {
    const expDiff = mag.exponent - this.exponent;
    const mult = Math.pow(10, expDiff);
    const result = scalar * mult;
    return result;
  }


  toString() {
    return this.name;
  }
}


// TODO: declare the following as static after Safari adopts:
// https://github.com/tc39/proposal-static-class-features
  Magnitude.lookup = str => {
    const magnitude = magnitudeByAbbrev[str];
    if (magnitude) {
      return magnitude;
    }
    return magnitudeByName[str];
  };


  Magnitude.YOTTA = new Magnitude(24, 'yotta', 'Y');
  Magnitude.ZETTA = new Magnitude(21, 'zetta', 'Z');
  Magnitude.EXA = new Magnitude(18, 'exa', 'E');
  Magnitude.PETA = new Magnitude(15, 'peta', 'P');
  Magnitude.TERA = new Magnitude(12, 'tera', 'T');
  Magnitude.GIGA = new Magnitude(9, 'giga', 'G');
  Magnitude.MEGA = new Magnitude(6, 'mega', 'M');
  Magnitude.KILO = new Magnitude(3, 'kilo', 'k');
  Magnitude.HECTO = new Magnitude(2, 'hecto', 'h');
  Magnitude.DECA = new Magnitude(1, 'deca', 'D');
  Magnitude.UNIT = new Magnitude(0, '', '');
  Magnitude.DECI = new Magnitude(-1, 'deci', 'd');
  Magnitude.CENTI = new Magnitude(-2, 'centi', 'c');
  Magnitude.MILLI = new Magnitude(-3, 'milli', 'm');
  Magnitude.MICRO = new Magnitude(-6, 'micro', '\u03BC');
  Magnitude.NANO = new Magnitude(-9, 'nano', 'n');
  Magnitude.PICO = new Magnitude(-12, 'pico', 'p');
  Magnitude.FEMTO = new Magnitude(-15, 'femto', 'f');
  Magnitude.ATTO = new Magnitude(-18, 'atto', 'a');
  Magnitude.ZETO = new Magnitude(-21, 'zepto', 'z');
  Magnitude.YOCTO = new Magnitude(-24, 'yocto', 'y');

const unitByAbbrev = {};
const unitByName = {};

class Unit {

  constructor(name, abbrev, dimension) {
    this.name = name;
    this.abbrev = abbrev;
    this.dimension = dimension;
    unitByAbbrev[abbrev] = this;
    unitByName[name] = this;
  }


  toString() {
    return this.name;
  }
}


// TODO: declare the following as static after Safari adopts:
// https://github.com/tc39/proposal-static-class-features
  Unit.lookup = str => {
    const unit = unitByAbbrev[str];
    if (unit) {
      return unit;
    }
    return unitByName[str];
  };



  Unit.METER = new Unit('meter', 'm', 'length');
  Unit.GRAM = new Unit('gram', 'g', 'mass');
  Unit.SECOND = new Unit('second', 's', 'time');
  Unit.AMPERE = new Unit('ampere', 'A', 'electric current');
  Unit.KELVIN = new Unit('kelvin', 'K', 'temperature');
  Unit.CANDELA = new Unit('candela', 'cd', 'luminous intensity');
  Unit.MOLE = new Unit('mole', 'mol', 'amount of substance');

/**
 * Measure formatting and conversion utility.  The system of measure
 * used is a a slight variation of the System International (SI)
 * system (http://scienceworld.wolfram.com/physics/SI.html).  There
 * are two particular variations.
 *
 * This first variation is that no unit has an implicit magnitude.
 * This is in contrast to the MKS or Meters, Kilograms, Seconds system
 * which has the "kilo" magnitude for its mass unit, or the CGS or
 * Centimeters, Grams, Seconds which has the "centi" magnitude for its
 * length unit.
 *
 * The second variation is that the "deca" magnitude's abbreviation is
 * defined as "D" instead of "da" so that a decagram can be
 * represented as "Dg" instead of "dag" or "da gram", which is
 * congruent with the usage of the other unit abbreviations.
 */
class Measure {
  constructor(scalar, magnitude, unit) {
    if (typeof scalar != 'number') {
      throw 'Invalid scalar given: ' + scalar;
    }
    if (typeof magnitude != 'object' || magnitude.constructor.name != 'Magnitude') {
      throw 'Invalid magnitude given: ' + magnitude;
    }
    if (typeof unit != 'object' || unit.constructor.name != 'Unit') {
      throw 'Invalid unit given: ' + unit;
    }
    this.scalar = scalar;
    this.magnitude = magnitude || Magnitude.UNIT;
    this.unit = unit;
  }


  identical(other) {
    return this.scalar === other.scalar
      && this.magnitude === other.magnitude
      && this.unit === other.unit;
  }


  equals(other) {
    const thisUnit = this.convertToUnit();
    const otherUnit = other.convertToUnit();
    return thisUnit.scalar === otherUnit.scalar
      && thisUnit.magnitude === otherUnit.magnitude
      && thisUnit.unit === otherUnit.unit;
  }


  convertTo(mag) {
    return new Measure(mag.from(this.scalar, this.magnitude), mag, this.unit);
  }


  convertToUnit() {
    return this.convertTo(Magnitude.UNIT);
  }


  toString() {
    let s = '';
    s += this.scalar;
    s += this.magnitude.abbrev;
    s += this.unit.abbrev;
    return s;
  }
}


// TODO: declare the following as static after Safari adopts:
// https://github.com/tc39/proposal-static-class-features

Measure.Magnitude = Magnitude;
Measure.Unit = Unit;

/**
 * @throws If the string does not contain a parsable measure.
 */
Measure.parse = s => {
  if (typeof s != 'string') {
    throw 'Given string is null or not string: ' + s;
  }
  //var MEASURE_PATTERN = new RegExp(/(-?\\d+(?:.\\d+)?(?:E\\d+)?)\\s*([khdnmgtpfaezy\u03BC]|(?:yotta|zetta|exa|peta|tera|giga|mega|kilo|hecto|deca|deci|centi|milli|micro|nano|pico|femto|atto|zepto|yocto))?\\s*([mgsAKLn]|(?:meter|gram|second|Ampere|Kelvin|candela|mole))/);
  const m = s.match(/(-?\d+(?:.\d+)?(?:[eE]\d+)?)\s*([khdnmgtpfaezy\u03BC])?\s*([mgsAKLn])/);
  if (!m) {
    throw 'Could not parse measure from given string: ' + s;
  }
  const scalar = parseFloat(m[1]);
  if (m.length == 2) {
    const unit = m[2];
    const ul = Unit.lookup(unit);
    return new Measure(parseFloat(scalar), Magnitude.UNIT, ul);
  }
  const magnitude = m[2] || null;
  const unit = m[3];
  const ml = magnitude == null ? Magnitude.UNIT : Magnitude.lookup(magnitude);
  const ul = Unit.lookup(unit);
  return new Measure(scalar == null ? 0.0 : parseFloat(scalar), ml, ul);
};

export default Measure;
