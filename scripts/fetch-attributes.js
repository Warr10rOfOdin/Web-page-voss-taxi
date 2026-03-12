#!/usr/bin/env node

/**
 * Fetch available attributes from Taxi4U API
 * This helps us understand what passenger count attributes are available
 */

const https = require('https');

async function getAuthToken() {
  const username = process.env.TAXI4U_USERNAME;
  const password = process.env.TAXI4U_PASSWORD;

  if (!username || !password) {
    throw new Error('TAXI4U_USERNAME and TAXI4U_PASSWORD must be set');
  }

  const authData = JSON.stringify({ username, password });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.taxi4u.cab',
      path: '/api/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': authData.length,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          const json = JSON.parse(data);
          resolve(json.token);
        } else {
          reject(new Error(`Auth failed: ${res.statusCode} ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(authData);
    req.end();
  });
}

async function getAttributes(token) {
  const centralCode = process.env.TAXI4U_CENTRAL_CODE || 'VS';

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.taxi4u.cab',
      path: `/api/attribute?centralCode=${centralCode}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Attributes fetch failed: ${res.statusCode} ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function main() {
  try {
    console.log('🔐 Authenticating with Taxi4U API...');
    const token = await getAuthToken();
    console.log('✅ Authentication successful\n');

    console.log('📋 Fetching available attributes...');
    const attributes = await getAttributes(token);
    console.log('✅ Attributes fetched\n');

    console.log('📊 Available Attributes:');
    console.log('='.repeat(80));
    console.log(JSON.stringify(attributes, null, 2));
    console.log('='.repeat(80));

    // Look for passenger-related attributes
    console.log('\n🔍 Passenger-related attributes:');
    const passengerAttrs = attributes.filter(attr =>
      attr.name && (
        attr.name.includes('PERSON') ||
        attr.name.includes('SETER') ||
        attr.name.includes('SEAT')
      )
    );

    if (passengerAttrs.length > 0) {
      passengerAttrs.forEach(attr => {
        console.log(`  ID: ${attr.id} - Name: ${attr.name}`);
      });
    } else {
      console.log('  No obvious passenger count attributes found');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
