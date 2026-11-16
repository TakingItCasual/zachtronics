"use strict";

import { Canvas } from "./canvas.js";
import { NUM, COLOR } from "./consts.js";

type tGridArray = [number, number][];

export class Wires {
  canv: Canvas;
  verticalGrid: tGridArray;
  horizontalGrid: tGridArray;

  constructor(canv: Canvas, vGrid: tGridArray, hGrid: tGridArray) {
    this.canv = canv;

    this.verticalGrid = vGrid;
    this.horizontalGrid = hGrid;
  }

  drawWires() {
    this.canv.ctx.beginPath();
    this.canv.ctx.lineWidth = 21;
    const half = Math.floor(NUM.GRID_CELL_SIZE / 2);
    const extend = Math.floor(this.canv.ctx.lineWidth / 2);
    for(const coord of this.verticalGrid) {
      const posX = this.canv.grid.origin.x + NUM.GRID_CELL_SIZE * coord[0];
      const posY = this.canv.grid.origin.y + NUM.GRID_CELL_SIZE * coord[1]
        + half;

      this.canv.ctx.moveTo(posX - half + 0.5 - extend, posY + 0.5);
      this.canv.ctx.lineTo(posX + half + 0.5 + extend, posY + 0.5);
    }
    for(const coord of this.horizontalGrid) {
      const posX = this.canv.grid.origin.x + NUM.GRID_CELL_SIZE * coord[0]
        + half;
      const posY = this.canv.grid.origin.y + NUM.GRID_CELL_SIZE * coord[1];

      this.canv.ctx.moveTo(posX + 0.5, posY - half + 0.5 - extend);
      this.canv.ctx.lineTo(posX + 0.5, posY + half + 0.5 + extend);
    }
    this.canv.ctx.strokeStyle = COLOR.LIGHT_GRAY;
    this.canv.ctx.stroke();
    this.canv.ctx.lineWidth = 1;
  }
}
