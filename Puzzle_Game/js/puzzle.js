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

//can't return since it's an event => need callback / promise
checkEarly.addEventListener('click', (event) => {
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      img.crossOrigin = "Anonymous";
      img.src = reader.result;
    }
  } 
  else {   
      img.crossOrigin = "Anonymous";
      img.src = 'https://cloudinary-marketing-res.cloudinary.com/image/upload/f_auto,q_auto/v1667313676/website_2021/Guess_iPhone2';
  }
});


img.onload = function() {
  const canvasRatio = canvas.width / canvas.height;
  const imgRatio = img.width / img.height;
  let width, height, x, y;
  if (imgRatio > canvasRatio * (2/3)) {
    width = canvas.width * (2/3);
    height = width / imgRatio;
    // console.log("la ");
  } else {
    height = canvas.height;
    width = height * imgRatio;
    // console.log("ici ");
  }
  x = (canvas.width - width) / 2;
  y = (canvas.height - height) / 2;

  ctx.drawImage(img, x, y, width, height);

  // console.log("New width: " + width);
  // console.log("New height: " + height);

  let newWidth = width;
  let newHeight = height;
  // console.log(newWidth + "la")


  //n'est plus une image et necessite des changements
  // const imgURL = canvas.toDataURL();

  // Call the restart function with newWidth and newHeight
  restart(newHeight, newWidth);
};



//test 2nd canvas
const canvas2 = document.getElementById('mycanvas');
const ctx2 = canvas2.getContext('2d');
let img2 = new Image();
img2.src = "https://t4.ftcdn.net/jpg/05/25/11/11/360_F_525111136_6sZp5DQKBXr53m6MCwdkOVE0rV0Gl67c.jpg";
// img2.src = "images/Quokka2.png";
img2.crossOrigin = "Anonymous";
img2.onload = function() {
  const canvasRatio = canvas2.width / canvas2.height;
  const imgRatio = img2.width / img2.height;
  let width, height, x, y;
  if (imgRatio > canvasRatio * (2/3)) {
    width = canvas2.width * (2/3);
    height = width / imgRatio;
  } else {
    height = canvas2.height;
    width = height * imgRatio;
  }
  x = (canvas2.width - width) / 2;
  y = (canvas2.height - height) / 2;
  ctx2.drawImage(img2, x, y, width, height);
};


// Shuffle the pieces
function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  drawPieces();
  return array;
}



// Draw the pieces on the canvas
function drawPieces() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    if (!piece.solved) {
      //draw initial pieces places
      ctx.strokeRect(piece.imageX, piece.imageY, piece.width, piece.height);
      //draw pieces
      ctx.drawImage(piece.image, piece.imageX, piece.imageY, piece.width, piece.height, piece.x, piece.y, piece.width, piece.height);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      //draw around the pieces 
      ctx.strokeRect(piece.x, piece.y, piece.width, piece.height);
      // console.log(piece.imageX);
      // console.log(piece.x);
    }
  }
}


function initPieces(rows, cols, newWidth, newHeight) {
  // Empty the pieces array
  pieces.length = 0;

  img.width = newWidth;
  img.height = newHeight;

  // console.log(newWidth + "la3")
  console.log(img.width)

  const pieceWidth = newWidth / cols;
  const pieceHeight = newHeight/ rows;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const piece = {
        imageX: j * pieceWidth,
        imageY: i * pieceHeight,
        x: Math.random() * (canvas.width - pieceWidth),
        y: Math.random() * (canvas.height - pieceHeight),
        width: pieceWidth,
        height: pieceHeight,
        image: img,
        solved: false
      };
      pieces.push(piece);
    }
  }
  pieces = shuffle(pieces);
  drawPieces();
  start = new Date();
}



// Check if the puzzle is solved
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


//****************************************************************************************//
//*********************************piece  Selection Mouse*********************************//
//****************************************************************************************//

// Select a piece when the user clicks on it
let selectedPiece = null;
let offsetX = 0;
let offsetY = 0;


// Select a piece when the user clicks on it
//+300 to adjust with another canvas2 try
canvas.addEventListener('mousedown', e => {
  const mouseX = e.clientX - canvas.offsetLeft;
  const mouseY = e.clientY - canvas.offsetTop + 300;
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


// Move the selected piece when the user drags it
//+300 to adjust with another canvas2 try
canvas.addEventListener('mousemove', e => {
  if (selectedPiece !== null) {
    selectedPiece.x = e.clientX - canvas.offsetLeft - offsetX;
    selectedPiece.y = e.clientY - canvas.offsetTop - offsetY + 300 ;
    drawPieces();
  }
});



// Deselect the piece when the user releases it
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


//****************************************************************************************//
//*********************************piece  Selection Touch*********************************//
//****************************************************************************************//

canvas.addEventListener('touchstart', e => {
  const touchX = e.touches[0].clientX - canvas.offsetLeft;
  const touchY = e.touches[0].clientY - canvas.offsetTop + 300;
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    if (touchX > piece.x && touchX < piece.x + piece.width && touchY > piece.y && touchY < piece.y + piece.height) {
      selectedPiece = piece;
      offsetX = touchX - piece.x;
      offsetY = touchY - piece.y;
      break;
    }
  }
});

canvas.addEventListener('touchmove', e => {
  if (selectedPiece !== null) {
    selectedPiece.x = e.touches[0].clientX - canvas.offsetLeft - offsetX;
    selectedPiece.y = e.touches[0].clientY - canvas.offsetTop - offsetY + 300;
    drawPieces();
  }
});

canvas.addEventListener('touchend', e => {
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


// canvas.addEventListener('touchmove', e => {
//   e.preventDefault();
//   // rest of the code
// });



function restart(newHeight, newWidth) {
  img.addEventListener('load', () => {
    // console.log(newWidth + "la2")
    const select = document.getElementById('difficulty');
    const difficulty = select.options[select.selectedIndex].value;
    switch (difficulty) {
      case 'easy':
        initPieces(3, 3, newWidth, newHeight);
        break;
      case 'medium':
        initPieces(6, 6, newWidth, newHeight);
        break;
      case 'hard':
        initPieces(9, 9, newWidth, newHeight);
        break;
      case 'testFlemm':
        initPieces(2, 1, newWidth, newHeight); 
        break;
    }
  });
}







// //ORIGINAL GAME without scaling
// function initPieces(rows, cols) {
//   ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas
//   pieces = []; // reset the pieces array
//   // const img = new Image();
//   // img.src = 'images/puzzle.jpg';

//     const pieceWidth = img.width / cols;
//     const pieceHeight = img.height / rows;
//     for (let i = 0; i < rows; i++) {
//       for (let j = 0; j < cols; j++) {
//         const piece = {
//           x: j * pieceWidth,
//           y: i * pieceHeight,
//           width: pieceWidth,
//           height: pieceHeight,
//           imageX: (cols - j - 1) * pieceWidth,
//           imageY: (rows - i - 1) * pieceHeight,
//           imageWidth: pieceWidth,
//           imageHeight: pieceHeight
//         };
//         pieces.push(piece);
//       }
//     }
//     shufflePieces();

//     start = new Date();
//     const currentHour = start.getHours();
//     const currentMinute = start.getMinutes();
//     const currentSecond = start.getSeconds();
//     const formattedTime = `${currentHour}h${currentMinute}m${currentSecond}s`;
//     document.getElementById("start").innerText = "Starting time: " + formattedTime;

//     drawPieces();
//   };

// //Fisher-Yates shuffle algorithm
// function shufflePieces() {
//   for (let i = pieces.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
//   }
// }


// function drawPieces() {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   pieces.forEach((piece, index) => {
//     ctx.drawImage(img, piece.imageX, piece.imageY, piece.imageWidth, piece.imageHeight, piece.x, piece.y, piece.width, piece.height);
    
    // //draw around the starting images to know where to place them
    // ctx.beginPath();
    // ctx.moveTo(piece.imageX, piece.imageY);
    // ctx.lineTo(piece.imageX + piece.imageWidth, piece.imageY);
    // ctx.lineTo(piece.imageX + piece.imageWidth, piece.imageY + piece.imageHeight);
    // ctx.lineTo(piece.imageX, piece.imageY + piece.imageHeight);
    // ctx.closePath();
    // ctx.stroke();

//     //Test if each pieces is randomly generated,and it IS indeed working, so my problem is somewhere else in the drawing area
//     ctx.font = "12px Arial";
//     ctx.fillStyle = "black";
//     ctx.fillText(index, piece.x + piece.width / 2, piece.y + piece.height / 2);
//   });
// }