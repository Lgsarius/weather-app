import { Capacitor } from '@capacitor/core';

export const getApiUrl = () => {
  if (Capacitor.isNativePlatform()) {
    return process.env.NEXT_PUBLIC_API_URL || 'https://your-api-domain.com';
  }
  return '/api';
}; 