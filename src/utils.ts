"use strict";

/** Returns whether number is within bounds */
export function numWithin(
  num: number,
  lowerBound: number,
  isLowerInclusive: boolean,
  upperBound: number,
  isUpperInclusive: boolean,
): boolean {
  if(num < lowerBound) return false;
  if(num <= lowerBound && !isLowerInclusive) return false;
  if(num > upperBound) return false;
  if(num >= upperBound && !isUpperInclusive) return false;
  return true;
}
