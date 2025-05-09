import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node',
		globals: true,
		include: ['tests/**/*.spec.ts'],
		setupFiles: ['tests/setup.ts']
	}
});