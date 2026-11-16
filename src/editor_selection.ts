"use strict";

import { NUM } from "./consts.js";
import { numWithin } from "./utils.js";

interface iTextPos {
  lineI: number;
  charI: number;
}

class SelectionRange {
  start: iTextPos;
  current: iTextPos;

  constructor() {
    this.start = { lineI: 0, charI: 0 };
    this.current = { lineI: 0, charI: 0 };
  }

  initTo(lineI: number, charI: number): void {
    this.start.lineI = this.current.lineI = lineI;
    this.start.charI = this.current.charI = charI;
  }
  get lowerLineI(): number {
    return Math.min(this.start.lineI, this.current.lineI);
  }
  get lowerCharI(): number {
    if(this.start.lineI < this.current.lineI)
      return this.start.charI;
    if(this.start.lineI > this.current.lineI)
      return this.current.charI;
    return Math.min(this.start.charI, this.current.charI);
  }
  get upperLineI(): number {
    return Math.max(this.start.lineI, this.current.lineI);
  }
  get upperCharI(): number {
    if(this.start.lineI > this.current.lineI)
      return this.start.charI;
    if(this.start.lineI < this.current.lineI)
      return this.current.charI;
    return Math.max(this.start.charI, this.current.charI);
  }
  get lineCount(): number {
    if(this.isNull) return 0;
    return this.upperLineI - this.lowerLineI + 1;
  }
  get isNull(): boolean {
    return (
      this.start.lineI === this.current.lineI &&
      this.start.charI === this.current.charI
    );
  }
  isLineSelected(lineI: number): boolean {
    if(this.isNull) return false;
    return numWithin(lineI, this.lowerLineI, true, this.upperLineI, true);
  }
}

class Cursor {
  private _lineI: number;
  private _charI: number;
  private _blinkTime: number;

  constructor() {
    this._lineI = 0;
    this._charI = 0;
    this._blinkTime = Date.now();
  }

  get lineI(): number { return this._lineI; }
  get charI(): number { return this._charI; }

  set lineI(val: number) {
    this._lineI = val;
    this.blinkReset();
  }
  set charI(val: number) {
    this._charI = val;
    this.blinkReset();
  }

  blinkReset(): void {
    this._blinkTime = Date.now();
  }
  isBlinkActive(): boolean {
    const timeRemainder = (Date.now() - this._blinkTime) % NUM.CURSOR_PERIOD;
    return timeRemainder < Math.floor(NUM.CURSOR_PERIOD / 2);
  }
}

/** Handles user cursor and text selection/highlighting */
export class EditorSelection {
  nodeI: number | null;
  cursor: Cursor;
  range: SelectionRange;

  constructor() {
    /** Index of ComputeNode being focused (null if N/A) */
    this.nodeI = null;
    /** Holds data/functions for cursor within focused codeBox */
    this.cursor = new Cursor();
    /** Holds selection range data/functions */
    this.range = new SelectionRange();
  }

  focusLost(): void {
    this.nodeI = null;
    this.cursor.lineI = this.cursor.charI = 0;
    this.range.initTo(0, 0);
  }
}
