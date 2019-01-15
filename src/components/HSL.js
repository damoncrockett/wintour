function score2hsl(score) {
  return 'hsl(0,0%,'+String(parseInt((1-score)*100))+'%)'
}

export { score2hsl };
