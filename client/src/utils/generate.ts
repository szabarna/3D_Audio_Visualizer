function computeCacheKey(data: any): string {
    const str = JSON.stringify(data);
    let hash = 0, i, chr;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return 'key_' + hash;
  }

  export { computeCacheKey };