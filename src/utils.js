"use strict";

/** Returns whether number is within bounds */
export function numWithin(
  num, lowerBound, isLowerInclusive, upperBound, isUpperInclusive,
) {
  if(num < lowerBound) return false;
  if(num <= lowerBound && !isLowerInclusive) return false;
  if(num > upperBound) return false;
  if(num >= upperBound && !isUpperInclusive) return false;
  return true;
}
