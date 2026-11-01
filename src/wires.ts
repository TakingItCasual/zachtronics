"use strict";

import { NUM, COLOR } from "./consts.js";

export class Wires {
  constructor(canv, vGrid, hGrid) {
    this.canv = canv;

    this.verticalGrid = vGrid;
    this.horizontalGrid = hGrid;
  }

  drawWires() {
    this.canv.ctx.beginPath();
    this.canv.ctx.lineWidth = 21;
    let half = Math.floor(NUM.GRID_CELL_SIZE / 2);
    let extend = Math.floor(this.canv.ctx.lineWidth / 2);
    for(let coord of this.verticalGrid) {
      let posX = this.canv.grid.origin.x + NUM.GRID_CELL_SIZE * coord[0];
      let posY = this.canv.grid.origin.y + NUM.GRID_CELL_SIZE * coord[1] + half;

      this.canv.ctx.moveTo(posX - half + 0.5 - extend, posY + 0.5);
      this.canv.ctx.lineTo(posX + half + 0.5 + extend, posY + 0.5);
    }
    for(let coord of this.horizontalGrid) {
      let posX = this.canv.grid.origin.x + NUM.GRID_CELL_SIZE * coord[0] + half;
      let posY = this.canv.grid.origin.y + NUM.GRID_CELL_SIZE * coord[1];

      this.canv.ctx.moveTo(posX + 0.5, posY - half + 0.5 - extend);
      this.canv.ctx.lineTo(posX + 0.5, posY + half + 0.5 + extend);
    }
    this.canv.ctx.strokeStyle = COLOR.LIGHT_GRAY;
    this.canv.ctx.stroke();
    this.canv.ctx.lineWidth = 1;
  }
}
