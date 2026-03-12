import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { BookingRule, BookingRulesConfig } from '@/types/booking-rules';

export const dynamic = 'force-dynamic';

const RULES_FILE = path.join(process.cwd(), 'data', 'booking-rules.json');

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read rules from file
function readRules(): BookingRulesConfig {
  ensureDataDir();

  if (!fs.existsSync(RULES_FILE)) {
    const defaultConfig: BookingRulesConfig = {
      rules: [],
      lastUpdated: new Date().toISOString(),
    };
    fs.writeFileSync(RULES_FILE, JSON.stringify(defaultConfig, null, 2));
    return defaultConfig;
  }

  const data = fs.readFileSync(RULES_FILE, 'utf-8');
  return JSON.parse(data);
}

// Write rules to file
function writeRules(config: BookingRulesConfig) {
  ensureDataDir();
  config.lastUpdated = new Date().toISOString();
  fs.writeFileSync(RULES_FILE, JSON.stringify(config, null, 2));
}

// GET - Fetch all rules
export async function GET() {
  try {
    const config = readRules();
    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    console.error('Error reading rules:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to read rules' },
      { status: 500 }
    );
  }
}

// POST - Create new rule
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const config = readRules();

    const newRule: BookingRule = {
      id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: body.type,
      name: body.name,
      description: body.description || '',
      active: body.active ?? true,
      timeRanges: body.timeRanges || [],
      daysOfWeek: body.daysOfWeek || [],
      startDate: body.startDate,
      endDate: body.endDate,
      messageNo: body.messageNo,
      messageEn: body.messageEn,
      blockBooking: body.blockBooking ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    config.rules.push(newRule);
    writeRules(config);

    return NextResponse.json({ success: true, data: newRule });
  } catch (error) {
    console.error('Error creating rule:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create rule' },
      { status: 500 }
    );
  }
}

// PUT - Update existing rule
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Rule ID is required' },
        { status: 400 }
      );
    }

    const config = readRules();
    const ruleIndex = config.rules.findIndex((r) => r.id === id);

    if (ruleIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Rule not found' },
        { status: 404 }
      );
    }

    config.rules[ruleIndex] = {
      ...config.rules[ruleIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    writeRules(config);

    return NextResponse.json({ success: true, data: config.rules[ruleIndex] });
  } catch (error) {
    console.error('Error updating rule:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update rule' },
      { status: 500 }
    );
  }
}

// DELETE - Remove rule
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Rule ID is required' },
        { status: 400 }
      );
    }

    const config = readRules();
    const ruleIndex = config.rules.findIndex((r) => r.id === id);

    if (ruleIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Rule not found' },
        { status: 404 }
      );
    }

    config.rules.splice(ruleIndex, 1);
    writeRules(config);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting rule:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete rule' },
      { status: 500 }
    );
  }
}
