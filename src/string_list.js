"use strict";

/** Contains and manages list of strings */
class StringList{
  #lineStrs;
  /** Not enforced, but for isValid() */
  #lineW;
  /** Not enforced, but for isValid() */
  #maxLines;

  constructor(lineW, maxLines, lineStrs){
    this.#lineW = lineW;
    this.#maxLines = maxLines;
    this.#lineStrs = lineStrs;
  }
  static constructNew(lineW, maxLines){
    return new StringList(lineW, maxLines, [""]);
  }
  static constructCopy(origin){
    return new StringList(
      origin.lineW, origin.maxLines, origin.linesGet());
  }

  get lineW(){
    return this.#lineW;
  }
  get maxLines(){
    return this.#maxLines;
  }
  lineCount(){
    return this.#lineStrs.length;
  }
  isValid(){
    if(!this.lineCount().within(1, true, this.#maxLines, true)) return false;
    for(const line of this.#lineStrs){
      if(line.length > this.#lineW) return false;
      if(!ALLOWED_CHARS.test(line)) return false;
    }
    return true;
  }
  #isValidLineIndex(lineI){
    return lineI.within(0, true, this.lineCount(), false);
  }

  linesGet(){
    return this.#lineStrs.slice();
  }
  linesSet(lines){
    if(!Array.isArray(lines)) return;
    if(lines.length === 0) return;
    for(const line of lines){
      if(typeof line !== "string") return;
    }

    this.#lineStrs = lines;
  }

  lineAdd(lineI){
    this.#lineStrs.splice(lineI+1, 0, "");
  }
  lineDel(lineI){
    if(!this.#isValidLineIndex(lineI)) return;
    if(this.lineCount() <= 1) return; // Don't want an empty lineStrs
    this.#lineStrs.splice(lineI, 1);
  }

  strGet(lineI){
    if(!this.#isValidLineIndex(lineI)) return "";
    return this.#lineStrs[lineI];
  }
  strSet(lineI, strValue){
    // Expand #lineStrs until lineI
    while(lineI >= this.lineCount())
      this.#lineStrs.push("");
    // The substring crops the strValue to prevent text overflow
    this.#lineStrs[lineI] = strValue.substring(0, this.#lineW);
  }
  strLen(lineI){
    if(!this.#isValidLineIndex(lineI)) return 0;
    return this.#lineStrs[lineI].length;
  }
  strCut(lineI, charI){ // Cuts and returns string charI from end
    if(!this.#isValidLineIndex(lineI)) return "";
    if(charI > this.strLen(lineI)) return "";
    let cutStr = this.#lineStrs[lineI].slice(-charI);
    this.#lineStrs[lineI] = this.#lineStrs[lineI].slice(0, -charI);
    return cutStr;
  }

  charAdd(lineI, charI, charVar){
    if(!this.#isValidLineIndex(lineI)) return;
    charI = Math.min(charI, this.strLen(lineI));
    let str = this.#lineStrs[lineI];
    this.strSet(lineI,
      str.substring(0, charI) + charVar + str.substring(charI));
  }
  charDel(lineI, charI){
    if(!this.#isValidLineIndex(lineI)) return;
    if(charI > this.strLen(lineI)) return;
    let str = this.#lineStrs[lineI];
    this.strSet(lineI, str.substring(0, charI-1) + str.substring(charI));
  }
}
