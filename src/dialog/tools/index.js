export function colorString(str, keywords) {
  return str.replace(
    new RegExp(keywords.join('|'), 'gi'),
    x => `<span style="color: #FFE074; background-color: #614E1A">${x}</span>`
  );
}
