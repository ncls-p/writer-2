/**
 * Result type for handling expected errors without throwing.
 * Use this for business logic failures, validation errors, and expected error conditions.
 */
export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

/**
 * Creates a successful Result.
 */
export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

/**
 * Creates a failed Result.
 */
export function fail<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

/**
 * Wraps an async function to catch errors and return a Result.
 */
export async function tryCatch<T, E = Error>(
  fn: () => Promise<T>,
  mapError?: (error: unknown) => E,
): Promise<Result<T, E>> {
  try {
    const value = await fn();
    return ok(value);
  } catch (error) {
    if (mapError) {
      return fail(mapError(error));
    }
    return fail(error as E);
  }
}

/**
 * Unwraps a Result, throwing if it's a failure.
 * Use sparingly - prefer pattern matching on the Result.
 */
export function unwrap<T, E>(result: Result<T, E>): T {
  if (result.ok) {
    return result.value;
  }
  throw result.error;
}

/**
 * Unwraps a Result, returning a default value if it's a failure.
 */
export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  if (result.ok) {
    return result.value;
  }
  return defaultValue;
}

/**
 * Maps the value of a successful Result.
 */
export function map<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U,
): Result<U, E> {
  if (result.ok) {
    return ok(fn(result.value));
  }
  return result;
}

/**
 * Maps the error of a failed Result.
 */
export function mapError<T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => F,
): Result<T, F> {
  if (!result.ok) {
    return fail(fn(result.error));
  }
  return result;
}

/**
 * Chains Results together (flatMap).
 */
export function andThen<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>,
): Result<U, E> {
  if (result.ok) {
    return fn(result.value);
  }
  return result;
}
