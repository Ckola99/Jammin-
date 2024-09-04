import { vi } from 'vitest';

const mockStorage = {};

const localStorageMock = {
	getItem: (key) => {
		return mockStorage[key] || null;
	},
	setItem: (key, value) => {
		mockStorage[key] = value;
	},
	removeItem: (key) => {
		delete mockStorage[key];
	},
	clear: () => {
		for (let key in mockStorage) {
			delete mockStorage[key];
		}
	}
};

Object.defineProperty(global, 'localStorage', {
	value: localStorageMock,
	writable: true,
});

// Mock fetch globally
global.fetch = vi.fn((url, options) => {
  if (url === 'https://accounts.spotify.com/api/token') {
    // Check request method and payload to validate
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        access_token: 'newAccessToken',
        refresh_token: 'newRefreshToken',
        expires_in: 3600,
      }),
    });
  }
  return Promise.reject(new Error('Invalid API URL'));
});
