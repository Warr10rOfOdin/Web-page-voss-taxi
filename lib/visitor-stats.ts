import fs from 'fs';
import path from 'path';

export interface VisitorLog {
  id: string;
  timestamp: string;
  path: string;
  locale: string;
  userAgent?: string;
  referrer?: string;
  ip?: string;
}

export interface VisitorStats {
  totalVisits: number;
  uniquePaths: number;
  visitsByLocale: {
    no: number;
    en: number;
  };
  visitsByPath: Record<string, number>;
  visitsByDay: Record<string, number>;
  visitsByMonth: Record<string, number>;
  recentVisits: VisitorLog[];
  topPages: Array<{ path: string; count: number }>;
}

const STATS_FILE = path.join(process.cwd(), 'data', 'visitor-stats.json');

interface StatsData {
  visits: VisitorLog[];
}

// Check if we're in a writable environment (not Vercel serverless)
function isWritableEnvironment(): boolean {
  try {
    const testDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    return true;
  } catch (error) {
    // Running on read-only file system (e.g., Vercel)
    return false;
  }
}

// Ensure data directory exists
function ensureDataDir() {
  if (!isWritableEnvironment()) {
    return;
  }
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read stats from file
function readStatsFile(): StatsData {
  if (!isWritableEnvironment()) {
    console.log('Read-only environment detected, returning empty visitor stats');
    return { visits: [] };
  }

  ensureDataDir();

  if (!fs.existsSync(STATS_FILE)) {
    return { visits: [] };
  }

  try {
    const data = fs.readFileSync(STATS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading visitor stats file:', error);
    return { visits: [] };
  }
}

// Write stats to file
function writeStatsFile(data: StatsData) {
  if (!isWritableEnvironment()) {
    console.log('Skipping visitor stats write in read-only environment (Vercel serverless)');
    return;
  }

  ensureDataDir();

  try {
    fs.writeFileSync(STATS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('ERROR writing visitor stats file (non-fatal):', error);
    console.warn('Visitor stats logging is disabled due to read-only file system');
  }
}

// Log a new visit
export function logVisit(visit: Omit<VisitorLog, 'id' | 'timestamp'>) {
  const data = readStatsFile();

  const log: VisitorLog = {
    ...visit,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  };

  data.visits.push(log);

  // Keep only last 5000 visits to prevent file from growing too large
  if (data.visits.length > 5000) {
    data.visits = data.visits.slice(-5000);
  }

  writeStatsFile(data);

  return log;
}

// Get visitor statistics
export function getVisitorStats(): VisitorStats {
  const data = readStatsFile();
  const visits = data.visits;

  const visitsByPath: Record<string, number> = {};
  const visitsByDay: Record<string, number> = {};
  const visitsByMonth: Record<string, number> = {};
  let noCount = 0;
  let enCount = 0;

  // Calculate statistics
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  visits.forEach(visit => {
    const visitDate = new Date(visit.timestamp);

    // Count by path
    visitsByPath[visit.path] = (visitsByPath[visit.path] || 0) + 1;

    // Count by locale
    if (visit.locale === 'no') noCount++;
    else if (visit.locale === 'en') enCount++;

    // By day (last 30 days)
    const dayKey = visitDate.toISOString().split('T')[0];
    if (visitDate >= thirtyDaysAgo) {
      visitsByDay[dayKey] = (visitsByDay[dayKey] || 0) + 1;
    }

    // By month
    const monthKey = `${visitDate.getFullYear()}-${String(visitDate.getMonth() + 1).padStart(2, '0')}`;
    visitsByMonth[monthKey] = (visitsByMonth[monthKey] || 0) + 1;
  });

  // Get top pages
  const topPages = Object.entries(visitsByPath)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const stats: VisitorStats = {
    totalVisits: visits.length,
    uniquePaths: Object.keys(visitsByPath).length,
    visitsByLocale: {
      no: noCount,
      en: enCount,
    },
    visitsByPath,
    visitsByDay,
    visitsByMonth,
    recentVisits: visits.slice(-20).reverse(), // Last 20 visits, newest first
    topPages,
  };

  return stats;
}

// Get detailed logs with optional filters
export function getVisitorLogs(options?: {
  limit?: number;
  offset?: number;
  startDate?: string;
  endDate?: string;
  path?: string;
  locale?: string;
}): { visits: VisitorLog[]; total: number } {
  const data = readStatsFile();
  let visits = [...data.visits];

  // Filter by date range
  if (options?.startDate) {
    const startDate = new Date(options.startDate);
    visits = visits.filter(visit => new Date(visit.timestamp) >= startDate);
  }

  if (options?.endDate) {
    const endDate = new Date(options.endDate);
    visits = visits.filter(visit => new Date(visit.timestamp) <= endDate);
  }

  // Filter by path
  if (options?.path) {
    visits = visits.filter(visit => visit.path.includes(options.path!));
  }

  // Filter by locale
  if (options?.locale) {
    visits = visits.filter(visit => visit.locale === options.locale);
  }

  const total = visits.length;

  // Apply pagination
  const offset = options?.offset || 0;
  const limit = options?.limit || 50;
  visits = visits.slice(offset, offset + limit);

  return { visits: visits.reverse(), total }; // Newest first
}
