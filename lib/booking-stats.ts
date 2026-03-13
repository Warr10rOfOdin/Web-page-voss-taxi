import fs from 'fs';
import path from 'path';

export interface BookingLog {
  id: string;
  timestamp: string;
  bookRef?: string;
  internalNo?: string;
  customerName: string;
  fromCity: string;
  toCity?: string;
  pickupTime: string;
  bookingType: 'simple' | 'general';
  success: boolean;
}

export interface BookingStats {
  totalBookings: number;
  successfulBookings: number;
  failedBookings: number;
  bookingsByType: {
    simple: number;
    general: number;
  };
  recentBookings: BookingLog[];
  bookingsByDay: Record<string, number>;
  bookingsByMonth: Record<string, number>;
}

const STATS_FILE = path.join(process.cwd(), 'data', 'booking-stats.json');

interface StatsData {
  logs: BookingLog[];
}

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read stats from file
function readStatsFile(): StatsData {
  ensureDataDir();

  if (!fs.existsSync(STATS_FILE)) {
    return { logs: [] };
  }

  try {
    const data = fs.readFileSync(STATS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading stats file:', error);
    return { logs: [] };
  }
}

// Write stats to file
function writeStatsFile(data: StatsData) {
  ensureDataDir();

  try {
    fs.writeFileSync(STATS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing stats file:', error);
  }
}

// Log a new booking
export function logBooking(booking: Omit<BookingLog, 'id' | 'timestamp'>) {
  const data = readStatsFile();

  const log: BookingLog = {
    ...booking,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  };

  data.logs.push(log);

  // Keep only last 1000 bookings to prevent file from growing too large
  if (data.logs.length > 1000) {
    data.logs = data.logs.slice(-1000);
  }

  writeStatsFile(data);

  return log;
}

// Get booking statistics
export function getBookingStats(): BookingStats {
  const data = readStatsFile();
  const logs = data.logs;

  const stats: BookingStats = {
    totalBookings: logs.length,
    successfulBookings: logs.filter(l => l.success).length,
    failedBookings: logs.filter(l => !l.success).length,
    bookingsByType: {
      simple: logs.filter(l => l.bookingType === 'simple').length,
      general: logs.filter(l => l.bookingType === 'general').length,
    },
    recentBookings: logs.slice(-10).reverse(), // Last 10 bookings, newest first
    bookingsByDay: {},
    bookingsByMonth: {},
  };

  // Calculate bookings by day (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  logs.forEach(log => {
    const logDate = new Date(log.timestamp);

    // By day
    const dayKey = logDate.toISOString().split('T')[0];
    if (logDate >= thirtyDaysAgo) {
      stats.bookingsByDay[dayKey] = (stats.bookingsByDay[dayKey] || 0) + 1;
    }

    // By month
    const monthKey = `${logDate.getFullYear()}-${String(logDate.getMonth() + 1).padStart(2, '0')}`;
    stats.bookingsByMonth[monthKey] = (stats.bookingsByMonth[monthKey] || 0) + 1;
  });

  return stats;
}

// Get detailed logs with optional filters
export function getBookingLogs(options?: {
  limit?: number;
  offset?: number;
  startDate?: string;
  endDate?: string;
  success?: boolean;
}): { logs: BookingLog[]; total: number } {
  const data = readStatsFile();
  let logs = [...data.logs];

  // Filter by date range
  if (options?.startDate) {
    const startDate = new Date(options.startDate);
    logs = logs.filter(log => new Date(log.timestamp) >= startDate);
  }

  if (options?.endDate) {
    const endDate = new Date(options.endDate);
    logs = logs.filter(log => new Date(log.timestamp) <= endDate);
  }

  // Filter by success
  if (options?.success !== undefined) {
    logs = logs.filter(log => log.success === options.success);
  }

  const total = logs.length;

  // Apply pagination
  const offset = options?.offset || 0;
  const limit = options?.limit || 50;
  logs = logs.slice(offset, offset + limit);

  return { logs: logs.reverse(), total }; // Newest first
}
