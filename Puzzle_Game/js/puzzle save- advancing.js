// import { drawPieces } from "./Functions/DrawPieces";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let pieces = [];
let start;
let end;

//We want either an imported image or one that is previously already set, maybe transform it into a random one among an array ?
const img = new Image();
const fileInput = document.getElementById('file-input');
const checkEarly = document.getElementById('ReStart');
checkEarly.addEventListener('click', (event) => {
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      img.src = reader.result;
      img.crossOrigin = "Anonymous";
      //Wait for the picture to be fully loaded in order not to have a double cclick to reload the image.
      img.addEventListener('load', () => {
        drawPieces();
      });
    }
  } 
  else {
      img.src = 'https://cloudinary-marketing-res.cloudinary.com/image/upload/f_auto,q_auto/v1667313676/website_2021/Guess_iPhone2';
      img.crossOrigin = "Anonymous";
      //Wait for the picture to be fully loaded in order not to have a double cclick to reload the image.
      img.addEventListener('load', () => {
        drawPieces();
      });
  }
});


//SCALING UP WORKING
function initPieces(rows, cols, imgSrc, canvasWidth, canvasHeight) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces = [];

  let img = new Image();
  img.src = imgSrc;
  img.crossOrigin = "Anonymous";
  img.addEventListener('load', () => {
    const aspectRatio = img.width / img.height;
    const canvasAspectRatio = canvasWidth / canvasHeight;
    let pieceWidth, pieceHeight;

    // Calculate the minimum size of an image that is 0.2% of the canvas's size
    const minSize = canvasWidth * canvasHeight * 0.5;

    // Check if the image is smaller than the minimum size
    if (img.width * img.height < minSize) {
      // Resize the image to twice its size
      const newWidth = img.width * 2;
      const newHeight = img.height * 2;
      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      img = new Image();
      img.src = canvas.toDataURL();
    }

    if (aspectRatio > canvasAspectRatio) {
      // The image is wider than the canvas
      pieceWidth = canvasWidth * aspectRatio;
      pieceHeight = img.height;
      console.log("wider")
    } else {
      // The image is taller than the canvas
      pieceHeight = canvasHeight / aspectRatio;
      pieceWidth = img.width;
      console.log("taller")
    } 

   

    // Draw the entire image on the canvas
    ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

    // Get the pixel data of the image
    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    const pixels = imageData.data;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const piece = {
          x: j * pieceWidth / cols,
          y: i * pieceHeight / rows,
          width: pieceWidth / cols,
          height: pieceHeight / rows,
          imageX: j * pieceWidth / cols,
          imageY: i * pieceHeight / rows,
          imageWidth: pieceWidth / cols,
          imageHeight: pieceHeight / rows,
          pixels: []
        };

        // Copy the pixel data of the piece from the image
        for (let y = i * pieceHeight / rows; y < (i + 1) * pieceHeight / rows; y++) {
          for (let x = j * pieceWidth / cols; x < (j + 1) * pieceWidth / cols; x++) {
            const index = y * canvasWidth * 4 + x * 4;
            const r = pixels[index];
            const g = pixels[index + 1];
            const b = pixels[index + 2];
            const a = pixels[index + 3];
            piece.pixels.push(r, g, b, a);
          }
        }

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
function shufflePieces(array) {
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
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
    
    //draw around the starting images to know where to place them
    ctx.beginPath();
    ctx.moveTo(piece.imageX, piece.imageY);
    ctx.lineTo(piece.imageX + piece.imageWidth, piece.imageY);
    ctx.lineTo(piece.imageX + piece.imageWidth, piece.imageY + piece.imageHeight);
    ctx.lineTo(piece.imageX, piece.imageY + piece.imageHeight);
    ctx.closePath();
    ctx.stroke();

    //Test if each pieces is randomly generated,and it IS indeed working, so my problem is somewhere else in the drawing area
    ctx.font = "12px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(index, piece.x + piece.width / 2, piece.y + piece.height / 2);
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



//piece  Selection

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
        const secondTime = (end - start) / 1000;
        const roundedSecondTime = parseFloat(secondTime.toFixed(1));
        alert(`Congratulations! You solved the puzzle in ${roundedSecondTime} seconds.`);
      } else {
      const roundedTime = parseFloat(time.toFixed(1));
      alert(`Congratulations! You solved the puzzle in ${roundedTime} minutes.`);
      }
    }
  }
});


// const buttonReStart = document.getElementById("ReStart");
// buttonReStart.addEventListener('click', restart);

function restart() {
  const select = document.getElementById('difficulty');
  const difficulty = select.options[select.selectedIndex].value;
  let imgSrc = 'https://cloudinary-marketing-res.cloudinary.com/image/upload/f_auto,q_auto/v1667313676/website_2021/Guess_iPhone2';
  img.crossOrigin = "Anonymous";

  canvasWidth = 1000;
  canvasHeight = 600;

  switch (difficulty) {
    case 'easy':
      initPieces(3, 3, imgSrc, canvasWidth, canvasHeight);
      break;
    case 'medium':
      initPieces(6, 6, imgSrc, canvasWidth, canvasHeight);
      break;
    case 'hard':
      initPieces(9, 9, imgSrc, canvasWidth, canvasHeight);
      break;
    case 'testFlemm':
      initPieces(2, 1, imgSrc, canvasWidth, canvasHeight);
      break;
  }
}