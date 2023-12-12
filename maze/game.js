document.addEventListener('DOMContentLoaded', () => {
	const maze = document.getElementById('maze');
	const cells = [];
	let mazeWidth = getRandomNumber(5, 20); // Set the width of the maze
	let mazeHeight = getRandomNumber(5, 20); // Set the height of the maze
	console.log(mazeWidth);
	console.log(mazeHeight);
	
	// Calculate the cell size based on the maze dimensions
	const cellSize = Math.min((maze.offsetWidth * 0.8) / mazeWidth, (maze.offsetHeight * 0.8) / mazeHeight);

	// Set the grid template columns and rows using the calculated cell size
	maze.style.gridTemplateColumns = `repeat(${mazeWidth}, ${cellSize}px)`;
	maze.style.gridTemplateRows = `repeat(${mazeHeight}, ${cellSize}px)`;

	// Generate the maze layout and create the cells
	const mazeLayout = generateMaze(mazeWidth, mazeHeight);
	for (let i = 0; i < mazeLayout.length; i++) {
	  const cell = document.createElement('div');
	  cell.className = mazeLayout[i] === 1 ? 'cell wall' : 'cell';
	  cell.style.width = `${cellSize}px`;
	  cell.style.height = `${cellSize}px`;
	  maze.appendChild(cell);
	  cells.push(cell);
	}

	let playerPosition = 0; // Starting position of the player
	let enemyPosition = cells.length - 1;
	
	// Update player position to ensure it is not a wall cell
	while (mazeLayout[playerPosition] === 1) {
	  playerPosition++;
	}

	// Update enemy position to ensure it is not a wall cell
	while (mazeLayout[enemyPosition] === 1) {
	  enemyPosition--;
	}
	
	cells[playerPosition].classList.add('player');
	cells[enemyPosition].classList.add('enemy');
	

	document.addEventListener('keydown', (e) => {
		const newPosition = getNewPosition(e.key, playerPosition);
		if (isValidMove(playerPosition, newPosition)) {
			cells[playerPosition].classList.remove('player');
			playerPosition = newPosition;
			cells[playerPosition].classList.add('player');
			checkCollision();
		}
	});
	
	
	let mazeSize = mazeHeight * mazeWidth;
	// Set the interval (movespeed)for moveEnemy based on mazeSize
	let interval;
	if (mazeSize >= 80) {
	  interval = 100;
	} else if (mazeSize >= 50) {
	  interval = 200;
	} else if (mazeSize < 50){
	  interval = 500;
	}
	setTimeout(() => {
	  setInterval(moveEnemy, interval);
	}, 2000);
	
	
	// Function to generate a random maze layout
	function generateRandomLayout(width, height) {
		const mazeLayout = [];
		for (let i = 0; i < width * height; i++) {
			const randomNumber = Math.random();
			mazeLayout.push(randomNumber < 0.3 ? 1 : 0); // 30% chance of wall
		}
		return mazeLayout;
	}

	//This newPosition teleport to the opposite side when walking in a side wall
		// function getNewPosition(key, currentPosition) {
			// let newPosition;
			// switch (key) {
				// case 'ArrowUp':
					// newPosition = currentPosition - mazeWidth; // Move up one row
					// if (newPosition < 0) {
						// newPosition += mazeLayout.length; // Wrap to the bottom row
					// }
					// return newPosition;
				// case 'ArrowDown':
					// newPosition = currentPosition + mazeWidth; // Move down one row
					// if (newPosition >= mazeLayout.length) {
						// newPosition -= mazeLayout.length; // Wrap to the top row
					// }
					// return newPosition;
				// case 'ArrowLeft':
					// return currentPosition - 1 >= 0 ? currentPosition - 1 : currentPosition;
				// case 'ArrowRight':
					// return currentPosition + 1 < mazeLayout.length ? currentPosition + 1 : currentPosition;
			// }
		// }
		
	//this getNewPosition locks the player in the grid
	function getNewPosition(key, currentPosition) {
		switch (key) {
			case 'ArrowUp':
				return currentPosition - mazeWidth >= 0 ? currentPosition - mazeWidth : currentPosition;
			case 'ArrowDown':
				return currentPosition + mazeWidth < cells.length ? currentPosition + mazeWidth : currentPosition;
			case 'ArrowLeft':
				return currentPosition % mazeWidth !== 0 ? currentPosition - 1 : currentPosition;
			case 'ArrowRight':
				return (currentPosition + 1) % mazeWidth !== 0 ? currentPosition + 1 : currentPosition;
			default:
				return currentPosition;
		}
	}

	// Function to check if a move is valid
	function isValidMove(currentPosition, newPosition) {
		return !cells[newPosition].classList.contains('wall');
	}
	
	function checkCollision() {
		if (playerPosition === enemyPosition) {
			alert('Game Over! Enemy caught you.');
			resetGame();
		}
	}

	function resetGame() {
		cells[playerPosition].classList.remove('player');
		cells[enemyPosition].classList.remove('enemy');

		playerPosition = 0;
		enemyPosition = cells.length - 1;

		cells[playerPosition].classList.add('player');
		cells[enemyPosition].classList.add('enemy');
	}

	 function moveEnemy() {
	   const possibleMoves = getAdjacentCells(enemyPosition);
	   
	   // Check if there are available moves
	   if (possibleMoves.length === 0) {
		   // console.log("stuck");
		  return;
	   }
	   
	   const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
	   cells[enemyPosition].classList.remove('enemy');
	   enemyPosition = randomMove;
	   cells[enemyPosition].classList.add('enemy');
	   checkCollision();
	}

	function getAdjacentCells(position) {
	   const row = Math.floor(position / mazeWidth);
	   const col = position % mazeWidth;
	   const adjacentCells = [];

	   if (row > 0) adjacentCells.push(position - mazeWidth); // Up
	   if (row < mazeHeight - 1) adjacentCells.push(position + mazeWidth); // Down
	   if (col > 0) adjacentCells.push(position - 1); // Left
	   if (col < mazeWidth - 1) adjacentCells.push(position + 1); // Right

	   // Filter out walls
	   return adjacentCells.filter(cell => {
		  return !cells[cell].classList.contains('wall');
	   });
	}
	});

	
	
// Function to generate a random number between min and max (inclusive)
function getRandomNumber(min, max) {
	const randomNumber = Math.random() * (max - min + 1) + min;
	const roundedNumber = Math.round(randomNumber);
	
	return roundedNumber;
}








function generateMaze(rows, columns) {
  // Create an empty maze grid
  const maze = [];
  for (let i = 0; i < rows; i++) {
    maze.push([]);
    for (let j = 0; j < columns; j++) {
      maze[i].push(1); // 1 represents walls
    }
  }

  // Randomized depth-first search algorithm to build the maze
function buildMaze(row, column) {
  maze[row][column] = 0; // 0 represents paths

  const directions = ["up", "down", "left", "right"];
  directions.sort(() => Math.random() - 0.5); // Randomize the order

  for (let direction of directions) {
    let [newRow, newColumn] = [row, column];

    if (direction === "up") {
      newRow -= 2;
      if (newRow >= 0 && maze[newRow][newColumn] === 1) {
        if (Math.random() < 0.7) {
          maze[newRow + 1][newColumn] = 0; // Remove wall
        }
        buildMaze(newRow, newColumn); // Recursive call
      }
    }

    if (direction === "down") {
      newRow += 2;
      if (newRow < rows && maze[newRow][newColumn] === 1) {
        if (Math.random() < 0.7) {
          maze[newRow][newColumn] = 0; // Remove wall
        }
        buildMaze(newRow, newColumn); // Recursive call
      }
    }

    if (direction === "left") {
      newColumn -= 2;
      if (newColumn >= 0 && maze[newRow][newColumn] === 1) {
        if (Math.random() < 0.7) {
          maze[newRow][newColumn + 1] = 0; // Remove wall
        }
        buildMaze(newRow, newColumn); // Recursive call
      }
    }

    if (direction === "right") {
      newColumn += 2;
      if (newColumn < columns && maze[newRow][newColumn] === 1) {
        if (Math.random() < 0.7) {
          maze[newRow][newColumn - 1] = 0; // Remove wall
        }
        buildMaze(newRow, newColumn); // Recursive call
      }
    }
  }
}


	// Start building the maze from the multiple entrances
	const entranceRows = [0, rows - 1];
	for (let entranceRow of entranceRows) {
	  for (let entranceColumn = 0; entranceColumn < columns; entranceColumn++) {
		if (maze[entranceRow][entranceColumn] === 1) {
		  if (Math.random() < 0.2) {
			maze[entranceRow][entranceColumn] = 0; // Remove wall
		  }
		  buildMaze(entranceRow, entranceColumn);
		}
	  }
	}

  // Add dead ends and loops randomly
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (maze[i][j] === 1) {
        if (Math.random() < 0.1) {
          maze[i][j] = 0; // Remove wall to create a dead end
        } else if (Math.random() < 0) {
          buildMaze(i, j); // Create a loop
        }
      }
    }
  }

  return maze.flat(); 
}
// Usage example
const maze = generateMaze(10, 10);
console.log(maze);