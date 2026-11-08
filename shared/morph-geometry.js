// The authoring tool stores each 192-point contour once, as little-endian x/y pairs.
function decodeMorphGeometry(cache) {
  const binary = atob(cache.coordinates);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < bytes.length; i++) bytes[i] = binary.charCodeAt(i);
  const values = new DataView(bytes.buffer);
  const contours = new Map();
  function contour(offset) {
    if (!contours.has(offset)) {
      const points = Array.from({length: 192}, (_, i) => {
        const x = (offset + 2 * i) * 8;
        return [values.getFloat64(x, true), values.getFloat64(x + 8, true)];
      });
      contours.set(offset, points);
    }
    return contours.get(offset);
  }
  for (const vectors of Object.values(cache.matches)) {
    for (const vector of vectors) {
      for (const part of vector.parts) {
        part.a = contour(part.a);
        part.b = contour(part.b);
      }
    }
  }
  return cache.matches;
}
