const body = document.querySelector("body");
const H = 34;
const W = 20;
const wallColor = "rgb(22,41,63)";
let existField;
let shapeColor;
let shapePoint = [0, 0];
let nextShape, nextColorIndex;
let currentShape, currentColorIndex;
let movingTread, movingSpeed;
let createPoint = [1, parseInt(W / 2) - 2];

//블록 배열
const shapeArray = [
  //z블록
  [
    [2, 2],
    [1, 2],
    [1, 1],
    [0, 1],
  ],
  [
    [1, 1],
    [1, 0],
    [0, 2],
    [0, 1],
  ],
  [
    [2, 1],
    [1, 1],
    [1, 2],
    [0, 2],
  ],
  [
    [1, 2],
    [1, 1],
    [0, 1],
    [0, 0],
  ],
  //O 블록
  [
    [1, 2],
    [1, 1],
    [0, 2],
    [0, 1],
  ],
  //T블록
  [
    [2, 0],
    [1, 1],
    [1, 0],
    [0, 0],
  ],
  [
    [1, 1],
    [0, 2],
    [0, 1],
    [0, 0],
  ],
  [
    [2, 2],
    [1, 2],
    [1, 1],
    [0, 2],
  ],
  [
    [1, 2],
    [1, 1],
    [1, 0],
    [0, 1],
  ],
  //I블록
  [
    [3, 1],
    [2, 1],
    [1, 1],
    [0, 1],
  ],
  [
    [1, 3],
    [1, 2],
    [1, 1],
    [1, 0],
  ],
  //L블록
  [
    [2, 2],
    [2, 1],
    [1, 1],
    [0, 1],
  ],
  [
    [1, 0],
    [0, 2],
    [0, 1],
    [0, 0],
  ],
  [
    [2, 2],
    [1, 2],
    [0, 2],
    [0, 1],
  ],
  [
    [1, 2],
    [1, 1],
    [1, 0],
    [0, 2],
  ],
  //J블록
  [
    [2, 2],
    [2, 1],
    [1, 2],
    [0, 2],
  ],
  [
    [2, 2],
    [2, 1],
    [2, 0],
    [1, 0],
  ],
  [
    [2, 1],
    [1, 1],
    [0, 1],
    [0, 2],
  ],
  [
    [1, 2],
    [0, 2],
    [0, 1],
    [0, 0],
  ],
];
//회전 시 바뀌는 블록 인덱스
const shapeRotateMap = [
  1, 0, 3, 2, 4, 6, 7, 8, 5, 10, 9, 12, 13, 14, 11, 16, 17, 18, 15,
];
//블록 색상
const shapeColorArray = [
  "rgb(199,82,82)",
  "rgb(233,174,43)",
  "rgb(105,155,55)",
  "rgb(53,135,145)",
  "rgb(49,95,151)",
  "rgb(102,86,167)",
];

//블록 좌표 가져오기
function getLoc(x, y) {
  let loc = document.getElementById(String(x) + " " + String(y));
  return loc;
}

//게임판 그리기
function drawField() {
  let field = document.createElement("table");
  field.id = "gameTable";
  for (let i = 0; i < H; i++) {
    let row = document.createElement("tr");
    field.appendChild(row);
    for (let j = 0; j < W; j++) {
      let col = document.createElement("td");
      col.id = String(i) + " " + String(j);
      row.appendChild(col);
    }
  }
  body.appendChild(field);
}

//필드 초기화
function initExistField() {
  existField = new Array(H);
  for (let i = 0; i < H; i++) {
    existField[i] = new Array(W);
  }
  for (let i = 0; i < H; i++) {
    for (let j = 0; j < W; j++) {
      existField[i][j] = false;
    }
  }
}

//게임판 경계선 그리기
function setWall() {
  for (let i = 0; i < H; i++) {
    drawBlock(i, 0, wallColor);
    drawBlock(i, W - 1, wallColor);
    existField[i][0] = true;
    existField[i][W - 1] = true;
  }
  for (let i = 0; i < W; i++) {
    drawBlock(0, i, wallColor);
    drawBlock(H - 1, i, wallColor);
    existField[0][i] = true;
    existField[H - 1][i] = true;
  }
}

//랜덤 블록 뽑기
function chooseNextShape() {
  nextShape = parseInt(Math.random() * shapeArray.length);
}
//랜덤 블록 색상
function chooseNextColor() {
  if (++nextColorIndex == shapeColorArray.length) nextColorIndex = 0;
}

//블록 색입히기
function drawBlock(x, y, color) {
  getLoc(x, y).style.background = color;
}

//블록 생성하기
function createShape() {
  shapePoint[0] = createPoint[0];
  shapePoint[1] = createPoint[1];
  currentShape = nextShape;
  currentColorIndex = nextColorIndex;
  shapeColor = shapeColorArray[currentColorIndex];
  let shape = shapeArray[currentShape];
  chooseNextShape();
  chooseNextColor();
  displayNextShape();
  for (let i = 0; i < shape.length; i++) {
    let sx = shapePoint[0] + shape[i][0];
    let sy = shapePoint[1] + shape[i][1];
    if (!isValidPoint(sx, sy)) gameOver();
    drawBlock(parseInt(sy), parseInt(sx));
  }
}

function displayNextShape() {
  let shape = shapeArray[nextShape];
  let color = shapeColorArray[nextColorIndex];
  for (let i = 0; i < 4; i++) {
    let x = shape[i][0];
    let y = shape[i][1];
    drawBlock(x, y, color);
  }
}

function initTable() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      document.getElementById(String(i) + String(j)).style.background =
        "rgb(14,31,49)";
    }
  }
}

function isValidPoint(x, y) {
  return !(y <= 0 || y > H - 1 || x <= 0 || x > W - 1 || existField[x][y]);
}

function gameOver() {
  clearTimeout(movingTread);
  initExistField();
  alert("[Game Over]\nLevel: " + level + "\nScore: " + score);
  document.getElementById("gameField").style.visibility = "hidden";
  document.getElementById("gameover").style.visibility = "visible";
}

function init() {
  drawField();
  initExistField();
  setWall();
  nextColorIndex = -1;
  chooseNextShape();
  chooseNextColor();
  createShape();
}

init();
