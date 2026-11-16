"use strict";

import { ALLOWED_CHARS } from "./consts.js";
import { numWithin } from "./utils.js";

/** Contains and manages list of strings */
export class StringList {
  /** Not enforced, but for isValid() */
  readonly #lineW: number;
  /** Not enforced, but for isValid() */
  readonly #maxLines: number;
  #lineStrs: string[];

  constructor(lineW: number, maxLines: number, lineStrs: string[]) {
    this.#lineW = lineW;
    this.#maxLines = maxLines;
    this.#lineStrs = lineStrs;
  }
  static constructNew(lineW: number, maxLines: number): StringList {
    return new StringList(lineW, maxLines, [""]);
  }
  static constructCopy(origin: StringList): StringList {
    return new StringList(origin.lineW, origin.maxLines, origin.linesGet());
  }

  get lineW(): number {
    return this.#lineW;
  }
  get maxLines(): number {
    return this.#maxLines;
  }
  lineCount(): number {
    return this.#lineStrs.length;
  }
  isValid(): boolean {
    if(!numWithin(this.lineCount(), 1, true, this.#maxLines, true))
      return false;
    for(const line of this.#lineStrs) {
      if(line.length > this.#lineW) return false;
      if(!ALLOWED_CHARS.test(line)) return false;
    }
    return true;
  }
  #isValidLineIndex(lineI: number): boolean {
    return numWithin(lineI, 0, true, this.lineCount(), false);
  }

  linesGet(): string[] {
    return this.#lineStrs.slice();
  }
  linesSet(lines: string[]): void {
    if(!Array.isArray(lines)) return;
    if(lines.length === 0) return;
    for(const line of lines) {
      if(typeof line !== "string") return;
    }

    this.#lineStrs = lines;
  }

  lineAdd(lineI: number): void {
    this.#lineStrs.splice(lineI + 1, 0, "");
  }
  lineDel(lineI: number): void {
    if(!this.#isValidLineIndex(lineI)) return;
    if(this.lineCount() <= 1) return; // Don't want an empty lineStrs
    this.#lineStrs.splice(lineI, 1);
  }

  strGet(lineI: number): string {
    if(!this.#isValidLineIndex(lineI)) return "";
    return this.#lineStrs[lineI];
  }
  strSet(lineI: number, strValue: string): void {
    // Expand #lineStrs until lineI
    while(lineI >= this.lineCount())
      this.#lineStrs.push("");
    // The substring crops the strValue to prevent text overflow
    this.#lineStrs[lineI] = strValue.substring(0, this.#lineW);
  }
  strLen(lineI: number): number {
    if(!this.#isValidLineIndex(lineI)) return 0;
    return this.#lineStrs[lineI].length;
  }
  /** Cuts and returns string charI characters from end */
  strCut(lineI: number, charI: number): string {
    if(!this.#isValidLineIndex(lineI)) return "";
    if(charI > this.strLen(lineI)) return "";
    const cutStr = this.#lineStrs[lineI].slice(-charI);
    this.#lineStrs[lineI] = this.#lineStrs[lineI].slice(0, -charI);
    return cutStr;
  }

  charAdd(lineI: number, charI: number, charVar: string): void {
    if(!this.#isValidLineIndex(lineI)) return;
    charI = Math.min(charI, this.strLen(lineI));
    const str = this.#lineStrs[lineI];
    this.strSet(lineI,
      str.substring(0, charI) + charVar + str.substring(charI));
  }
  charDel(lineI: number, charI: number): void {
    if(!this.#isValidLineIndex(lineI)) return;
    if(charI > this.strLen(lineI)) return;
    const str = this.#lineStrs[lineI];
    this.strSet(lineI, str.substring(0, charI - 1) + str.substring(charI));
  }
}
