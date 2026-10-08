"use strict";

import { NUM } from "./consts.js";

export class Canvas {
  constructor() {
    /** HTML canvas of game screen */
    this.canvas = document.getElementById("game");
    /** HTML canvas context */
    this.ctx = this.canvas.getContext("2d", { alpha: false });
    this.ctx.font = Math.floor(NUM.CHAR_HEIGHT * 4 / 3) + "pt tis-100-copy";
    this.setScale(1);

    this.grid = {
      origin: {
        x: Math.floor(this.canvas.width / 2),
        y: Math.floor(this.canvas.height / 2),
      },
    };
  }

  setScale(scaleNum) {
    this.canvasScale = scaleNum;
    this.ctx.scale(this.canvasScale, this.canvasScale);
  }
}
