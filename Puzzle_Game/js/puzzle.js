const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let pieces = [];
let start;
let end;

const img = new Image();
img.src = 'images/puzzle.jpg';


function initPieces(rows, cols) {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas
  pieces = []; // reset the pieces array
  const img = new Image();
  img.src = 'images/puzzle.jpg';
  img.addEventListener('load', () => {
    const pieceWidth = img.width / cols;
    const pieceHeight = img.height / rows;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const piece = {
          x: j * pieceWidth,
          y: i * pieceHeight,
          width: pieceWidth,
          height: pieceHeight,
          imageX: (cols - j - 1) * pieceWidth,
          imageY: (rows - i - 1) * pieceHeight,
          imageWidth: pieceWidth,
          imageHeight: pieceHeight
        };
        pieces.push(piece);
      }
    }
    shufflePieces();

    start = new Date();
    const currentHour = start.getHours();
    const currentMinute = start.getMinutes();
    const currentSecond = start.getSeconds();
    const formattedTime = `${currentHour}h${currentMinute}m${currentSecond}s`;
    document.getElementById("start").innerText = formattedTime;

    drawPieces();
  });
}

//Fisher-Yates shuffle algorithm
function shufflePieces() {
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
}


function drawPieces() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces.forEach((piece, index) => {
    ctx.drawImage(img, piece.imageX, piece.imageY, piece.imageWidth, piece.imageHeight, piece.x, piece.y, piece.width, piece.height);
    ctx.beginPath();
    ctx.moveTo(piece.imageX, piece.imageY);
    ctx.lineTo(piece.imageX + piece.imageWidth, piece.imageY);
    ctx.lineTo(piece.imageX + piece.imageWidth, piece.imageY + piece.imageHeight);
    ctx.lineTo(piece.imageX, piece.imageY + piece.imageHeight);
    ctx.closePath();
    ctx.stroke();
    //Test if each pieces is indeed randomly generated
    // ctx.font = "12px Arial";
    // ctx.fillStyle = "black";
    // ctx.fillText(index, piece.x + piece.width / 2, piece.y + piece.height / 2);
  });
}

function checkSolved() {
  const tolerance = 5;
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    if (Math.abs(piece.x - piece.imageX) > tolerance || Math.abs(piece.y - piece.imageY) > tolerance) {
      return false;
    }
  }
  return true;
}

let selectedPiece = null;
let offsetX = 0;
let offsetY = 0;

canvas.addEventListener('mousedown', e => {
  const mouseX = e.clientX - canvas.offsetLeft;
  const mouseY = e.clientY - canvas.offsetTop;
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    if (mouseX > piece.x && mouseX < piece.x + piece.width && mouseY > piece.y && mouseY < piece.y + piece.height) {
      selectedPiece = piece;
      offsetX = mouseX - piece.x;
      offsetY = mouseY - piece.y;
      break;
    }
  }
});

canvas.addEventListener('mousemove', e => {
  if (selectedPiece !== null) {
    selectedPiece.x = e.clientX - canvas.offsetLeft - offsetX;
    selectedPiece.y = e.clientY - canvas.offsetTop - offsetY;
    drawPieces();
  }
});

canvas.addEventListener('mouseup', e => {
  if (selectedPiece !== null) {
    selectedPiece = null;
    if (checkSolved()) {
      end = new Date();
      const time = (end - start) / 60000;
      if (time < 1){
        const secondTime = (end - start) / 10000;
        const roundedSecondTime = parseFloat(secondTime.toFixed(1));
        alert(`Congratulations! You solved the puzzle in ${secondTime} seconds.`);
      } else {
      const roundedTime = parseFloat(time.toFixed(1));
      alert(`Congratulations! You solved the puzzle in ${roundedTime} minutes.`);
      }
    }
  }
});


function restart() {
  const select = document.getElementById('difficulty');
  const difficulty = select.options[select.selectedIndex].value;
  switch (difficulty) {
    case 'easy':
      initPieces(3, 3);
      break;
    case 'medium':
      initPieces(6, 6);
      break;
    case 'hard':
      initPieces(9, 9);
      break;
  }
}
