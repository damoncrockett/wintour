//n.b.: string values for imp and risk are coerced to numeric

function togglesToFill (impVal, riskVal) {
  const hue = impVal ? String(120 * impVal) : '0';
  const sat = hue==='0' ? '0' : '100';
  const lig = riskVal ? String(parseInt(riskVal * 100)) : '50'; // white = risky

  return 'hsl('+hue+','+sat+'%,'+lig+'%)';
}

function randomChannel () {
  const popArray = Array.from(Array(256).keys());
  return Math.floor(Math.random() * popArray.length);
}

function randomRGB () {
  return [
    randomChannel(),
    randomChannel(),
    randomChannel(),
  ];
}

export { togglesToFill, randomRGB };
