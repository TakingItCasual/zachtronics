"use strict";

/** Contains and manages list of strings */
class StringList{
  #lineW;
  #maxLines;
  #lineStrs;

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
      origin.lineW, origin.maxLines, origin.linesGet().slice());
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

  linesGet(){
    return this.#lineStrs;
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
    if(lineI >= this.lineCount()) return;
    if(this.lineCount() <= 1) return; // Don't want an empty lineStrs
    this.#lineStrs.splice(lineI, 1);
  }

  strGet(lineI){
    if(lineI >= this.lineCount()) return "";
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
    if(lineI >= this.lineCount()) return 0;
    return this.#lineStrs[lineI].length;
  }
  strCut(lineI, charI){ // Cuts string charI from end
    if(lineI >= this.lineCount()) return "";
    if(charI > this.strLen(lineI)) return "";
    let cutStr = this.#lineStrs[lineI].slice(-charI);
    this.#lineStrs[lineI] = this.#lineStrs[lineI].slice(0, -charI);
    return cutStr;
  }

  charAdd(lineI, charI, charVar){
    if(lineI >= this.lineCount()) return;
    if(charI > this.strLen(lineI))
      charI = this.strLen(lineI);
    let str = this.#lineStrs[lineI];
    this.strSet(lineI,
      str.substring(0, charI) + charVar + str.substring(charI));
  }
  charDel(lineI, charI){
    if(lineI >= this.lineCount()) return;
    if(charI > this.strLen(lineI)) return;
    let str = this.#lineStrs[lineI];
    this.strSet(lineI, str.substring(0, charI-1) + str.substring(charI));
  }
}
