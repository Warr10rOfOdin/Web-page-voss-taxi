import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { BookingRule, BookingRulesConfig, DayOfWeek } from '@/types/booking-rules';

export const dynamic = 'force-dynamic';

const RULES_FILE = path.join(process.cwd(), 'data', 'booking-rules.json');

function readRules(): BookingRulesConfig {
  if (!fs.existsSync(RULES_FILE)) {
    return { rules: [], lastUpdated: new Date().toISOString() };
  }
  const data = fs.readFileSync(RULES_FILE, 'utf-8');
  return JSON.parse(data);
}

function getDayOfWeek(date: Date): DayOfWeek {
  const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[date.getDay()];
}

function isTimeInRange(time: string, start: string, end: string): boolean {
  const [timeH, timeM] = time.split(':').map(Number);
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);

  const timeMinutes = timeH * 60 + timeM;
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
}

function checkRuleApplies(rule: BookingRule, pickupTime: Date): boolean {
  if (!rule.active) return false;

  // Check date range
  if (rule.startDate && new Date(pickupTime) < new Date(rule.startDate)) return false;
  if (rule.endDate && new Date(pickupTime) > new Date(rule.endDate)) return false;

  // Check day of week
  if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
    const dayOfWeek = getDayOfWeek(pickupTime);
    if (!rule.daysOfWeek.includes(dayOfWeek)) return false;
  }

  // Check time ranges
  if (rule.timeRanges && rule.timeRanges.length > 0) {
    const timeStr = `${pickupTime.getHours().toString().padStart(2, '0')}:${pickupTime.getMinutes().toString().padStart(2, '0')}`;
    const inAnyRange = rule.timeRanges.some((range) =>
      isTimeInRange(timeStr, range.start, range.end)
    );
    if (!inAnyRange) return false;
  }

  return true;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pickupTimeStr = searchParams.get('pickupTime');

    if (!pickupTimeStr) {
      return NextResponse.json(
        { success: false, error: 'pickupTime parameter is required' },
        { status: 400 }
      );
    }

    const pickupTime = new Date(pickupTimeStr);
    const config = readRules();

    const applicableRules = config.rules.filter((rule) => checkRuleApplies(rule, pickupTime));

    // Separate by type
    const restrictions = applicableRules.filter((r) => r.blockBooking);
    const warnings = applicableRules.filter((r) => !r.blockBooking && r.type === 'warning');
    const disclaimers = applicableRules.filter((r) => !r.blockBooking && r.type === 'disclaimer');

    return NextResponse.json({
      success: true,
      data: {
        hasRestrictions: restrictions.length > 0,
        restrictions,
        warnings,
        disclaimers,
      },
    });
  } catch (error) {
    console.error('Error checking rules:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check rules' },
      { status: 500 }
    );
  }
}
