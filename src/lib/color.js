function togglesToColor (impVal, riskVal) {
  const hue = impVal ? String(impVal * 120) : '0'; // assumes 0/1 imp coding
  const sat = hue==='0' ? '0' : '50';
  const lig = riskVal ? String(parseInt((1-riskVal) * 100)) : '50';

  return 'hsl('+hue+','+sat+'%,'+lig+'%)';
}

export { togglesToColor };
