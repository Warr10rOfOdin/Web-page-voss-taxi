/**
 * Taxi4U API Authentication Manager
 * Handles login, token caching, and automatic refresh
 */

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  userId: string;
  expiresAt: number; // timestamp
}

let cachedTokens: AuthTokens | null = null;

/**
 * Login to Taxi4U API and get access token
 */
async function login(): Promise<AuthTokens> {
  const userId = process.env.TAXI4U_USER_ID;
  const password = process.env.TAXI4U_PASSWORD;

  if (!userId || !password) {
    throw new Error('TAXI4U_USER_ID and TAXI4U_PASSWORD must be set in environment variables');
  }

  const response = await fetch('https://api.taxi4u.cab/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, password }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Login failed: ${error}`);
  }

  const data = await response.json();

  // Cache tokens with 55-minute expiry (tokens typically last 1 hour)
  cachedTokens = {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    userId: data.userId,
    expiresAt: Date.now() + 55 * 60 * 1000, // 55 minutes
  };

  return cachedTokens;
}

/**
 * Refresh the access token using refresh token
 */
async function refreshAccessToken(): Promise<AuthTokens> {
  if (!cachedTokens) {
    return login();
  }

  const response = await fetch('https://api.taxi4u.cab/api/auth/refresh-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: cachedTokens.userId,
      refreshToken: cachedTokens.refreshToken,
    }),
  });

  if (!response.ok) {
    // If refresh fails, try logging in again
    return login();
  }

  const data = await response.json();

  cachedTokens = {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    userId: data.userId,
    expiresAt: Date.now() + 55 * 60 * 1000,
  };

  return cachedTokens;
}

/**
 * Get valid access token (login or refresh if needed)
 */
export async function getAccessToken(): Promise<string> {
  // If no cached token or expired, get new one
  if (!cachedTokens || Date.now() >= cachedTokens.expiresAt) {
    if (cachedTokens) {
      // Try refresh first
      await refreshAccessToken();
    } else {
      // Fresh login
      await login();
    }
  }

  return cachedTokens!.accessToken;
}

/**
 * Make authenticated request to Taxi4U API
 */
export async function taxi4uFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAccessToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });

  // If 401, try refreshing token and retry once
  if (response.status === 401) {
    await refreshAccessToken();
    const newToken = cachedTokens!.accessToken;

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${newToken}`,
      },
    });
  }

  return response;
}
