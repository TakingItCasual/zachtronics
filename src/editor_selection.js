"use strict";

/** Handles user cursor and text selection/highlighting */
class EditorSelection{
  constructor(){
    /** Index of ComputeNode being focused */
    this.nodeI = null;
    /** Position of cursor within focused codeBox */
    this.cursor = {
      _lineI: 0,
      _charI: 0,
    };
    /** Holds time data/functions for scheduling cursor blinking */
    this.cursorBlink = { time: Date.now() };
    /** Holds selection range data/functions */
    this.range = {
      start: { lineI: 0, charI: 0 },
      current: { lineI: 0, charI: 0 },
      initTo(lineI, charI){
        this.start.lineI = this.current.lineI = lineI;
        this.start.charI = this.current.charI = charI;
      },
      get lowerLineI(){
        return Math.min(this.start.lineI, this.current.lineI);
      },
      get lowerCharI(){
        if(this.start.lineI < this.current.lineI)
          return this.start.charI;
        if(this.start.lineI > this.current.lineI)
          return this.current.charI;
        return Math.min(this.start.charI, this.current.charI);
      },
      get upperLineI(){
        return Math.max(this.start.lineI, this.current.lineI);
      },
      get upperCharI(){
        if(this.start.lineI > this.current.lineI)
          return this.start.charI;
        if(this.start.lineI < this.current.lineI)
          return this.current.charI;
        return Math.max(this.start.charI, this.current.charI);
      },
      get lineCount(){
        if(this.isNull) return 0;
        return this.upperLineI - this.lowerLineI + 1;
      },
      get isNull(){
        return (
          this.start.lineI === this.current.lineI &&
          this.start.charI === this.current.charI
        );
      },
      isLineSelected(lineI){
        if(this.isNull) return false;
        return lineI.within(this.lowerLineI, true, this.upperLineI, true);
      },
    };

    // Don't know how to create objects with self-referencing, so set here
    Object.defineProperties(this.cursorBlink, {
      reset: {
        value: () => { this.cursorBlink.time = Date.now() },
      },
      isActive: {
        value: () => {
          let timeRemainder =
            (Date.now() - this.cursorBlink.time) % NUM.CURSOR_PERIOD;
          return timeRemainder < Math.floor(NUM.CURSOR_PERIOD/2);
        },
      },
    });
    let blinkReset = this.cursorBlink.reset;
    Object.defineProperties(this.cursor, {
      lineI: {
        get: function() { return this._lineI },
        set: function(val) {
          this._lineI = val;
          blinkReset();
        },
      },
      charI: {
        get: function() { return this._charI },
        set: function(val) {
          this._charI = val;
          blinkReset();
        },
      },
    });
  }

  focusLost(){
    this.nodeI = null;
    this.cursor.lineI = this.cursor.charI = 0;
    this.range.initTo(0, 0);
  }
}
