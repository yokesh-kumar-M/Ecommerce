import Cookies from 'js-cookie';
import { authApi } from './api';
import type { AuthTokens, User } from '@/types';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export function setTokens(tokens: AuthTokens) {
  Cookies.set(ACCESS_TOKEN_KEY, tokens.access, {
    expires: 1 / 24,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  Cookies.set(REFRESH_TOKEN_KEY, tokens.refresh, {
    expires: 7,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
}

export function clearTokens() {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
}

export function getAccessToken() {
  return Cookies.get(ACCESS_TOKEN_KEY);
}

export function isAuthenticated() {
  return !!getAccessToken();
}

export async function login(email: string, password: string): Promise<AuthTokens> {
  const { data } = await authApi.login(email, password);
  setTokens(data);
  return data;
}

export function logout() {
  clearTokens();
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
}

export function decodeJwt(token: string): { user_id: number; exp: number } | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}
