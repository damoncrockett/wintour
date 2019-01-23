//n.b.: string values for imp and risk are coerced to numeric

function togglesToColor (impVal, riskVal) {
  const hue = impVal ? String(120 * impVal) : '0';
  const sat = hue==='0' ? '0' : '50';
  const lig = riskVal ? String(parseInt((1-riskVal) * 100)) : '50';

  return 'hsl('+hue+','+sat+'%,'+lig+'%)';
}

export { togglesToColor };
