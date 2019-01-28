//n.b.: string values for imp and risk are coerced to numeric

function togglesToFill (impVal, riskVal) {
  const hue = impVal ? String(120 * impVal) : '0';
  const sat = hue==='0' ? '0' : '100';
  const lig = riskVal ? String(parseInt((1-riskVal) * 100)) : '50';

  return 'hsl('+hue+','+sat+'%,'+lig+'%)';
}

function togglesToStroke (impVal) {
  const hue = impVal ? String(0 * impVal) : '0';
  const sat = hue==='0' ? '0' : '0';
  const lig = '15';

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

export { togglesToFill, togglesToStroke, randomRGB };
