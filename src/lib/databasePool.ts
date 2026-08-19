const DEFAULT_DATABASE_POOL_MAX = 1;
const DEFAULT_DATABASE_POOL_CONNECTION_TIMEOUT_MS = 10_000;

function getPositiveInteger(value: string | undefined, fallback: number, name: string) {
  if (value === undefined) {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${name} must be a positive integer.`);
  }

  return parsed;
}

export function getDatabasePoolConfig(connectionString: string) {
  return {
    connectionString,
    max: getPositiveInteger(
      process.env.DATABASE_POOL_MAX,
      DEFAULT_DATABASE_POOL_MAX,
      'DATABASE_POOL_MAX',
    ),
    connectionTimeoutMillis: getPositiveInteger(
      process.env.DATABASE_POOL_CONNECTION_TIMEOUT_MS,
      DEFAULT_DATABASE_POOL_CONNECTION_TIMEOUT_MS,
      'DATABASE_POOL_CONNECTION_TIMEOUT_MS',
    ),
  };
}
