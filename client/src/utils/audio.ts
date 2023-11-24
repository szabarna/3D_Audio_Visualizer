
function getAverageAmplitudeForFrequencyRange(
    freqArray: Uint8Array,
    sampleRate: number,
    fftSize: number,
    minFrequency: number,
    maxFrequency: number
  ) {
    const indexMin = Math.round(minFrequency * (fftSize / sampleRate));
    const indexMax = Math.round(maxFrequency * (fftSize / sampleRate));
    const valuesInFrequencyRange = freqArray.slice(indexMin, indexMax);
  
    const sum = valuesInFrequencyRange.reduce((acc, val) => acc + val, 0);
    return sum / valuesInFrequencyRange.length / 255;
  }

export { getAverageAmplitudeForFrequencyRange };  