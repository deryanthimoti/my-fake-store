const COOKIE_NAME = 'auth_token';

export function setAuthToken(token: string, days = 7): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; expires=${expires}; path=/; Secure; SameSite=Strict`;
};

export function getAuthToken(): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + COOKIE_NAME + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

export function deleteAuthToken(): void {
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; Secure; SameSite=Strict`;
};
