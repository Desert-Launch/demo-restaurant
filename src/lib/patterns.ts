/**
 * Validation patterns shared by more than one feature. Kept in `lib/` so the
 * reservation, checkout and contact schemas do not have to import each other.
 */

/** Lenient on purpose — this is a restaurant, not a bank. */
export const PHONE_PATTERN = /^[+0-9][0-9\s-]{6,18}$/;
