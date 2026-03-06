import { NextRequest, NextResponse } from 'next/server';

/**
 * Health check endpoint for monitoring and uptime checks
 *
 * GET /api/health
 *
 * Returns:
 * - 200 OK if service is healthy
 * - 503 Service Unavailable if any critical dependency is down
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Check environment variables
    const envVarsCheck = checkEnvironmentVariables();

    // Check external API connectivity (optional, can be slow)
    const apiCheck = await checkExternalAPIs();

    const responseTime = Date.now() - startTime;

    // Determine overall health status
    const isHealthy = envVarsCheck.status === 'ok' && apiCheck.status === 'ok';
    const status = isHealthy ? 200 : 503;

    return NextResponse.json(
      {
        status: isHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`,
        version: process.env.npm_package_version || 'unknown',
        environment: process.env.NODE_ENV || 'production',
        checks: {
          environment: envVarsCheck,
          externalAPIs: apiCheck,
        },
      },
      { status }
    );
  } catch (error) {
    const responseTime = Date.now() - startTime;

    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Check if required environment variables are set
 */
function checkEnvironmentVariables() {
  const requiredVars = [
    'TAXI4U_API_BASE',
    'TAXI4U_CENTRAL_CODE',
    'TAXI4U_USER_ID',
    'TAXI4U_PASSWORD',
  ];

  const missing: string[] = [];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    return {
      status: 'error',
      message: `Missing environment variables: ${missing.join(', ')}`,
    };
  }

  return {
    status: 'ok',
    message: 'All required environment variables are set',
  };
}

/**
 * Check connectivity to external APIs
 * Note: This is optional and may slow down health checks
 */
async function checkExternalAPIs() {
  const checks = {
    kartverket: 'unknown',
    taxi4u: 'unknown',
  };

  try {
    // Check Kartverket API (quick HEAD request)
    const kartverketResponse = await fetch('https://ws.geonorge.no/adresser/v1/sok?sok=test&treffPerSide=1', {
      method: 'HEAD',
      signal: AbortSignal.timeout(3000), // 3 second timeout
    });
    checks.kartverket = kartverketResponse.ok ? 'ok' : 'error';
  } catch {
    checks.kartverket = 'error';
  }

  // Note: We're not checking Taxi4U API here as it requires authentication
  // and we don't want to spam their API with health checks
  checks.taxi4u = 'not_checked';

  const overallStatus = checks.kartverket === 'ok' ? 'ok' : 'degraded';

  return {
    status: overallStatus,
    message: overallStatus === 'ok'
      ? 'External APIs are accessible'
      : 'Some external APIs may be unavailable',
    details: checks,
  };
}
