"use strict";

import { NUM, DIR, COLOR } from "./consts.js";
import { Canvas } from "./canvas.js";
import { NodeContainer } from "./node_container.js";

(function() {
  let canv = new Canvas();

  let nodeManager = new NodeContainer(
    canv,
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
  );

  for(let i = 0; i < NUM.NODE_HEIGHT - 1; i++)
    nodeManager.nodes[0].mainTextBox.lines.strSet(i, "TESTING " + i);
  nodeManager.nodes[0].mainTextBox.lines
    .strSet(NUM.NODE_HEIGHT - 1, "MOV R#GHT RIGHT");

  nodeManager.nodes[1].mainTextBox.lines.strSet(0, "THE QUICK BROWN");
  nodeManager.nodes[1].mainTextBox.lines.strSet(1, "FOX JUMPS OVER THE");
  nodeManager.nodes[1].mainTextBox.lines.strSet(2, "LAZY DOG.");
  nodeManager.nodes[1].mainTextBox.lines.strSet(3, "1234567890");
  nodeManager.nodes[1].mainTextBox.lines.strSet(4, "!\"#$%&'()*+,-./:;");
  nodeManager.nodes[1].mainTextBox.lines.strSet(5, "<=>?@[\\]_`{|}~");
  nodeManager.nodes[1].codeBox.activeLine = 0;
  nodeManager.nodes[1].BAK = NUM.ACC_MIN;

  nodeManager.nodes[2].memoryBox.lines.strSet(0, "254");
  nodeManager.nodes[2].memoryBox.lines.strSet(1, "498");
  nodeManager.nodes[2].memoryBox.lines.strSet(2, "782");

  // Source: https://stackoverflow.com/a/17130415
  function getMousePos(evt) {
    let rect = canv.canvas.getBoundingClientRect();
    let scaleX = canv.canvas.width / rect.width / canv.canvasScale;
    let scaleY = canv.canvas.height / rect.height / canv.canvasScale;

    return {
      x: Math.floor((evt.clientX - rect.left) * scaleX),
      y: Math.floor((evt.clientY - rect.top) * scaleY),
    };
  }

  canv.canvas.addEventListener("mousemove", function(evt) {
    let mPos = getMousePos(evt);
    if(evt.buttons % 2 === 1) nodeManager.lmbDrag(mPos);
  });
  canv.canvas.addEventListener("mousedown", async function(evt) {
    let mPos = getMousePos(evt);
    if(evt.button === 0) {
      nodeManager.lmbDown(mPos);
    } else if(evt.button === 2) {
      await nodeManager.rmbDown(mPos);
    }
  });

  canv.canvas.addEventListener("keydown", function(evt) {
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

    if(nodeManager.select.nodeI === null) return;

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
  });
  canv.canvas.addEventListener("blur", function() {
    nodeManager.select.focusLost();
  });

  // Handle copying/cutting/pasting for code boxes
  window.addEventListener("copy", function(evt) {
    let copiedStr = nodeManager.attemptCopy();
    if(copiedStr !== null)
      evt.clipboardData.setData("text/plain", copiedStr);

    evt.preventDefault();
  });
  window.addEventListener("cut", function(evt) {
    let cutStr = nodeManager.attemptCut();
    if(cutStr !== null)
      evt.clipboardData.setData("text/plain", cutStr);

    evt.preventDefault();
  });
  window.addEventListener("paste", function(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    let pastedStr = evt.clipboardData.getData("text/plain");
    nodeManager.attemptPaste(pastedStr);
  });

  // Disable unwanted behaviors in canvas
  canv.canvas.addEventListener("contextmenu", function(evt) {
    evt.preventDefault();
  });
  canv.canvas.addEventListener("dragstart", function(evt) {
    evt.preventDefault();
  });

  function gameLoop() {
    canv.ctx.beginPath();

    canv.ctx.fillStyle = COLOR.BLACK;
    canv.ctx.fillRect(0, 0, canv.canvas.width, canv.canvas.height);

    nodeManager.drawNodes();

    canv.ctx.closePath();
    window.requestAnimationFrame(gameLoop);
  }
  window.requestAnimationFrame(gameLoop);
})();
