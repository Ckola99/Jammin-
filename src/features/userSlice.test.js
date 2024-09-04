import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRefreshToken } from './userSlice'; // Adjust the import path as needed


describe('getRefreshToken', () => {
	beforeEach(() => {
		// Clear mocks and localStorage before each test
		vi.clearAllMocks();
		localStorage.clear();
	});

	it('should successfully refresh the access token', async () => {
		// Setup mock response
		const mockResponse = {
			access_token: 'newAccessToken',
			refresh_token: 'newRefreshToken',
			expires_in: 3600
		};

		global.fetch.mockResolvedValue({
			ok: true,
			json: async () => mockResponse
		});

		// Setup localStorage mocks
		localStorage.setItem('refresh_token', 'existingRefreshToken');
		localStorage.setItem('token_expiration_time', (new Date().getTime() + 3600 * 1000).toString());

		// Call the function
		const newAccessToken = await getRefreshToken();

		// Assertions
		expect(newAccessToken).toBe('newAccessToken');
		expect(localStorage.getItem('access_token')).toBe('newAccessToken');
		expect(localStorage.getItem('refresh_token')).toBe('newRefreshToken');
		expect(localStorage.getItem('token_expiration_time')).toBe(
			(new Date().getTime() + mockResponse.expires_in * 1000).toString()
		);
	});

	it('should handle errors when refresh token fails', async () => {
		// Setup mock response for failure
		global.fetch = vi.fn((url, options) => {
			if (url === 'https://accounts.spotify.com/api/token') {
				return Promise.resolve({
					ok: false,
					json: () => Promise.resolve({ error_description: 'Invalid refresh token' }),
				});
			}
			return Promise.reject(new Error('Invalid API URL'));
		});

		// Setup localStorage mocks
		localStorage.setItem('refresh_token', 'existingRefreshToken');

		// Call the function
		const newAccessToken = await getRefreshToken();

		// Assertions
		expect(newAccessToken).toBeUndefined();
		expect(localStorage.getItem('access_token')).not.toBe('newAccessToken');
	});

	it('should not attempt refresh if no refresh token is available', async () => {
		// Clear localStorage
		localStorage.removeItem('refresh_token');

		// Call the function
		const newAccessToken = await getRefreshToken();

		// Assertions
		expect(newAccessToken).toBeUndefined();
		expect(global.fetch).not.toHaveBeenCalled();
	});
});
