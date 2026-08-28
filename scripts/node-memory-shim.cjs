const originalMemoryUsage = process.memoryUsage.bind(process);

try {
  originalMemoryUsage();
} catch {
  const fallbackMemoryUsage = () => ({
    rss: 0,
    heapTotal: 0,
    heapUsed: 0,
    external: 0,
    arrayBuffers: 0,
  });

  fallbackMemoryUsage.rss = () => 0;
  process.memoryUsage = fallbackMemoryUsage;
}
