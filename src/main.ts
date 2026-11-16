"use strict";

import { Canvas } from "./canvas.js";
import { NUM, DIR, COLOR } from "./consts.js";
import { NodeContainer } from "./node_container.js";
import { ComputeNode, StackMemNode } from "./nodes.js";

(function() {
  const canv = new Canvas();

  const nodeManager = new NodeContainer(canv,
    [
      [-6, -3, 1],
      [-3, -3, 1],
      [0, -3, 2],
      [3, -3, 0],
      [-6, 0, 0],
      [-3, 0, 1],
      [0, 0, 1],
      [3, 0, 2],
    ],
    {
      v: [
        [-7, 0],
        [-3, -2],
        [0, -2],
        [0, 1],
        [3, 1],
      ],
      h: [
        [-7, 0],
        [-2, 0],
        [1, 0],
      ],
    },
  );

  for(let i = 0; i < NUM.NODE_HEIGHT - 1; i++)
    nodeManager.nodes[0].mainTextBox.lines.strSet(i, "TESTING " + i);
  nodeManager.nodes[0].mainTextBox.lines
    .strSet(NUM.NODE_HEIGHT - 1, "MOV R#GHT RIGHT");

  const codeNode = nodeManager.nodes[1];
  if(codeNode instanceof ComputeNode) {
    codeNode.codeBox.lines.strSet(0, "THE QUICK BROWN");
    codeNode.codeBox.lines.strSet(1, "FOX JUMPS OVER THE");
    codeNode.codeBox.lines.strSet(2, "LAZY DOG.");
    codeNode.codeBox.lines.strSet(3, "1234567890");
    codeNode.codeBox.lines.strSet(4, "!\"#$%&'()*+,-./:;");
    codeNode.codeBox.lines.strSet(5, "<=>?@[\\]_`{|}~");
    codeNode.codeBox.activeLine = 0;
    codeNode.BAK = NUM.ACC_MIN;
  }

  const memNode = nodeManager.nodes[2];
  if(memNode instanceof StackMemNode) {
    memNode.memoryBox.lines.strSet(0, "254");
    memNode.memoryBox.lines.strSet(1, "498");
    memNode.memoryBox.lines.strSet(2, "782");
  }

  // Source: https://stackoverflow.com/a/17130415
  function getMousePos(evt: MouseEvent) {
    const rect = canv.canvas.getBoundingClientRect();
    const scaleX = canv.canvas.width / rect.width / canv.canvasScale;
    const scaleY = canv.canvas.height / rect.height / canv.canvasScale;

    return {
      x: Math.floor((evt.clientX - rect.left) * scaleX),
      y: Math.floor((evt.clientY - rect.top) * scaleY),
    };
  }

  canv.canvas.addEventListener("mousemove", function(evt: MouseEvent) {
    const mPos = getMousePos(evt);
    if(evt.buttons % 2 === 1) nodeManager.lmbDrag(mPos);
  });
  canv.canvas.addEventListener("mousedown", async function(evt: MouseEvent) {
    const mPos = getMousePos(evt);
    if(evt.button === 0) {
      nodeManager.lmbDown(mPos);
    } else if(evt.button === 2) {
      await nodeManager.rmbDown(mPos);
    }
  });

  canv.canvas.addEventListener("blur", function() {
    nodeManager.select.focusLost();
  });

  canv.canvas.addEventListener("keydown", function(evt: KeyboardEvent) {
    // Prevent space and arrow keys from causing unwanted scrolling
    // Prevent backspace causing the browser to navigate backwards
    // Prevent ' and / from opening quick find in Firefox
    if([
      " ", "ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown",
      "Backspace",
      "'", "/",
    ].indexOf(evt.key) > -1) {
      evt.preventDefault();
    }

    if(nodeManager.select.nodeI !== null) {
      if(!evt.ctrlKey) {
        switch(evt.key) {
          case "Enter":
            nodeManager.newLine();
            break;
          case "Backspace":
            nodeManager.bakChar();
            break;
          case "Delete":
            nodeManager.delChar();
            break;
          case "ArrowLeft":
            nodeManager.arrowKey(DIR.LEFT);
            break;
          case "ArrowUp":
            nodeManager.arrowKey(DIR.UP);
            break;
          case "ArrowRight":
            nodeManager.arrowKey(DIR.RIGHT);
            break;
          case "ArrowDown":
            nodeManager.arrowKey(DIR.DOWN);
            break;
          case "Home":
            nodeManager.toLineEdge(DIR.LEFT);
            break;
          case "End":
            nodeManager.toLineEdge(DIR.RIGHT);
            break;
          case "Escape":
            nodeManager.select.focusLost();
            break;
          default:
            nodeManager.addChar(evt.key);
        }
      } else if(evt.key.toUpperCase() === "A") {
        nodeManager.selectAll();
      }
    } else {
      switch(evt.key) {
        case "ArrowLeft":
          canv.grid.origin.x -= NUM.GRID_CELL_SIZE;
          break;
        case "ArrowUp":
          canv.grid.origin.y -= NUM.GRID_CELL_SIZE;
          break;
        case "ArrowRight":
          canv.grid.origin.x += NUM.GRID_CELL_SIZE;
          break;
        case "ArrowDown":
          canv.grid.origin.y += NUM.GRID_CELL_SIZE;
          break;
      }
    }
  });

  // Handle copying/cutting/pasting for code boxes
  window.addEventListener("copy", function(evt: ClipboardEvent) {
    evt.preventDefault();
    if(evt.clipboardData === null) return;

    const copiedStr = nodeManager.attemptCopy();
    if(copiedStr !== null)
      evt.clipboardData.setData("text/plain", copiedStr);
  });
  window.addEventListener("cut", function(evt: ClipboardEvent) {
    evt.preventDefault();
    if(evt.clipboardData === null) return;

    const cutStr = nodeManager.attemptCut();
    if(cutStr !== null)
      evt.clipboardData.setData("text/plain", cutStr);
  });
  window.addEventListener("paste", function(evt: ClipboardEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    if(evt.clipboardData === null) return;

    const pastedStr = evt.clipboardData.getData("text/plain");
    nodeManager.attemptPaste(pastedStr);
  });

  // Disable unwanted behaviors in canvas
  canv.canvas.addEventListener("contextmenu", function(evt: MouseEvent) {
    evt.preventDefault();
  });
  canv.canvas.addEventListener("dragstart", function(evt: DragEvent) {
    evt.preventDefault();
  });

  function gameLoop() {
    canv.ctx.fillStyle = COLOR.BLACK;
    canv.ctx.fillRect(0, 0, canv.canvas.width, canv.canvas.height);

    nodeManager.drawNodes();

    window.requestAnimationFrame(gameLoop);
  }
  window.requestAnimationFrame(gameLoop);
})();
