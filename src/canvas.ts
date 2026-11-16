"use strict";

import { NUM } from "./consts.js";

interface iGrid {
  origin: {
    x: number;
    y: number;
  };
}

export class Canvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  canvasScale: number;
  grid: iGrid;

  constructor() {
    /** HTML canvas of game screen */
    this.canvas = document.getElementById("game") as HTMLCanvasElement;
    /** HTML canvas context */
    this.ctx = this.canvas.getContext("2d",
      { alpha: false }) as CanvasRenderingContext2D;
    this.ctx.font = Math.round(NUM.CHAR_HEIGHT * 4 / 3) + "pt tis-100-copy";
    this.canvasScale = this._setScale(1);

    this.grid = {
      origin: {
        x: Math.floor(this.canvas.width / 2),
        y: Math.floor(this.canvas.height / 2),
      },
    };
  }

  private _setScale(scaleNum: number): number {
    this.ctx.scale(scaleNum, scaleNum);
    return scaleNum;
  }
  public setScale(scaleNum: number): void {
    this.canvasScale = this._setScale(scaleNum);
  }
}
