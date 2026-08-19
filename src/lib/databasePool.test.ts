import { afterEach, describe, expect, it, vi } from 'vitest';
import { getDatabasePoolConfig } from './databasePool';

describe('getDatabasePoolConfig', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses serverless-safe defaults', () => {
    vi.stubEnv('DATABASE_POOL_MAX', undefined);
    vi.stubEnv('DATABASE_POOL_CONNECTION_TIMEOUT_MS', undefined);

    expect(getDatabasePoolConfig('postgresql://localhost/umami')).toEqual({
      connectionString: 'postgresql://localhost/umami',
      max: 1,
      connectionTimeoutMillis: 10_000,
    });
  });

  it('allows the pool settings to be tuned', () => {
    vi.stubEnv('DATABASE_POOL_MAX', '3');
    vi.stubEnv('DATABASE_POOL_CONNECTION_TIMEOUT_MS', '5000');

    expect(getDatabasePoolConfig('postgresql://localhost/umami')).toEqual({
      connectionString: 'postgresql://localhost/umami',
      max: 3,
      connectionTimeoutMillis: 5000,
    });
  });

  it.each([
    ['DATABASE_POOL_MAX', '0'],
    ['DATABASE_POOL_MAX', '1.5'],
    ['DATABASE_POOL_CONNECTION_TIMEOUT_MS', '-1'],
    ['DATABASE_POOL_CONNECTION_TIMEOUT_MS', 'invalid'],
  ])('rejects invalid %s values', (name, value) => {
    vi.stubEnv(name, value);

    expect(() => getDatabasePoolConfig('postgresql://localhost/umami')).toThrow(
      `${name} must be a positive integer.`,
    );
  });
});
