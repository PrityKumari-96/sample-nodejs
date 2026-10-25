import { config } from '../config/env.js';

export class HealthService {
  /**
   * Format process uptime into human-readable duration
   * @param {number} seconds
   * @returns {string}
   */
  static formatUptime(seconds) {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${secs}s`);

    return parts.join(' ');
  }

  /**
   * Get application health and runtime status
   * @returns {object}
   */
  static getHealthStatus() {
    const uptimeInSeconds = process.uptime();
    const memory = process.memoryUsage();

    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: Math.floor(uptimeInSeconds),
        humanReadable: this.formatUptime(uptimeInSeconds),
      },
      environment: config.nodeEnv,
      runtime: {
        nodeVersion: process.version,
        platform: process.platform,
        pid: process.pid,
      },
      memory: {
        rssMb: +(memory.rss / (1024 * 1024)).toFixed(2),
        heapTotalMb: +(memory.heapTotal / (1024 * 1024)).toFixed(2),
        heapUsedMb: +(memory.heapUsed / (1024 * 1024)).toFixed(2),
      },
    };
  }
}
