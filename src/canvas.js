"use strict";

export class Canvas {
  constructor() {
    /** HTML canvas of game screen */
    this.canvas = document.getElementById("game");
    /** HTML canvas context */
    this.ctx = this.canvas.getContext("2d", { alpha: false });
    /** Scaling of canvas */
    this.canvasScale = 1;
    this.ctx.scale(this.canvasScale, this.canvasScale);
  }
}
