// import { levelOne } from './data/Level.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Define map
const map = {
  width: 10 * 32,
  height: 10 * 32
};

// Scale map to fit canvas
const scaleX = canvas.width / map.width;
const scaleY = canvas.height / map.height;
ctx.scale(scaleX, scaleY);

// Define game objects
const player = {
  x: 32,
  y: 32,
  speed: 2,
  direction: null
};

let level = 1;

const blocks = [];

// Generate blocks from levelOne
generateBlocks(level);


// Define game loop
function gameLoop() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.fillStyle = 'red';
  ctx.fillRect(player.x, player.y, 32, 32);

  // Draw blocks
  for (const block of blocks) {
    if (block.value === 3) {
      ctx.fillStyle = 'green';
      ctx.fillRect(block.x, block.y, 32, 32);
    } else if (block.value === 2) {
      ctx.fillStyle = 'purple';
      ctx.fillRect(block.x, block.y, 32, 32);
    } else if (block.value === 0) {
      ctx.fillStyle = 'blue';
      ctx.fillRect(block.x, block.y, 32, 32);
    } else if (block.value === 4) {
      ctx.fillStyle = 'orange';
      ctx.fillRect(block.x, block.y, 32, 32);
    }
  }

  // Define previous player position
  let prevPlayerPos = { x: player.x, y: player.y };
  let pushedBlock = null; // Variable to store the pushed block

  // Move player
  if (player.direction) {
    switch (player.direction) {
      case 'up':
        player.y -= player.speed;
        break;
      case 'down':
        player.y += player.speed;
        break;
      case 'left':
        player.x -= player.speed;
        break;
      case 'right':
        player.x += player.speed;
        break;
    }
  }

  for (const block of blocks) {
    if (player.x < block.x + 30 &&
        player.x + 30 > block.x &&
        player.y < block.y + 30 &&
        player.y + 30 > block.y) {
      // Collision detected, move player back to previous position
      if (block.value === 3) {
        level++;
        if (level > 3) {
          // End the game or display a message
          alert('Finished!');
        } else {
          generateBlocks(level);
        }
        // Teleport player back to starting position
        player.x = 32;
        player.y = 32;
      } else if (block.value === 2) {
      // Set the direction of the block based on the player's direction
      switch (player.direction) {
        case 'up':
          block.direction = 'up';
          break;
        case 'down':
          block.direction = 'down';
          break;
        case 'left':
          block.direction = 'left';
          break;
        case 'right':
          block.direction = 'right';
          break;
      }
      } else if (block.value === 0) {
        player.x = prevPlayerPos.x;
        player.y = prevPlayerPos.y;
      }
    }
  }

// Update the position of the block based on its direction
for (const block of blocks) {
  if (block.value === 2 && block.direction) {
    // Check for collision with other blocks
    let canMove = true;
    for (const otherBlock of blocks) {
      if (
        otherBlock !== block &&
        (otherBlock.value === 0 || otherBlock.value === 3 || otherBlock.value === 2)
      ) {
        if (
          block.x < otherBlock.x + 32 &&
          block.x + 32 > otherBlock.x &&
          block.y < otherBlock.y + 32 &&
          block.y + 32 > otherBlock.y
        ) {
          block.direction = null;
          break;
        }
      }
    }
    if (canMove) {
      switch (block.direction) {
        case 'up':
          block.y -= player.speed;
          break;
        case 'down':
          block.y += player.speed;
          break;
        case 'left':
          block.x -= player.speed;
          break;
        case 'right':
          block.x += player.speed ;
          break;
      }
    }
  }
}

// Check for collision with blocks of value 2
for (const block of blocks) {
  if (block.value === 2) {
    if (
      player.x < block.x + 30 &&
      player.x + 30 > block.x &&
      player.y < block.y + 30 &&
      player.y + 30 > block.y
    ) {
      // Collision detected, move player back to previous position
      player.x = prevPlayerPos.x;
      player.y = prevPlayerPos.y;
    }
  }
}


// Check for collisions between blocks of value 4 and 0 or 2
blocks.forEach(block => {
  if (block.value === 4) {
    const collidingBlock = blocks.find(b => (b.value === 0 || b.value === 2) && b.x + 32 >= block.x && b.x <= block.x + 32 && b.y + 32 >= block.y && b.y <= block.y + 28);
    if (collidingBlock) {
      // Remove the block of value 4
      blocks.splice(blocks.indexOf(block), 1);
      console.log("☠️")
    }
  }
});


  // Move the block of value 4
  const block4 = blocks.find((block) => block.value === 4);
  if (block4) {
    moveBlock(block4);
  }

  // Update previous player position
  prevPlayerPos = { x: player.x, y: player.y };

  // Request next frame
  requestAnimationFrame(gameLoop);
}

// Call game loop
gameLoop();


// ****************************TABLEAU****************************
// ****************************KEYS****************************
const keys = {
  z: {
      pressed: false
  },
  q: {
      pressed: false
  },
  d: {
      pressed: false
  },
  s: {
      pressed: false
  },
  ArrowUp: {
      pressed: false
  },
  ArrowLeft: {
      pressed: false
  },
  ArrowRight: {
      pressed: false
  },
  ArrowDown: {
      pressed: false
  },
  enter: {
      pressed: false
  }
};

// ****************************LISTENERS****************************
// ****************************& KEYS****************************

//mémoriser la dernière key enfoncée => passer de gauche à droite même si on maintient bas et qu'on appuie ensuite sur droite
let lastKey = '';

// Handle keyboard input
document.addEventListener('keydown', event => {
    switch (event.key) {
      case 'ArrowUp':
        keys.ArrowUp.pressed = true;
        lastKey ='ArrowUp';
        player.direction = 'up';
        break;
      case 'ArrowDown':
        keys.ArrowDown.pressed = true;
        lastKey ='ArrowDown';
        player.direction = 'down';
        break;
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true;
        lastKey ='ArrowLeft';
        player.direction = 'left';
        break;
      case 'ArrowRight':
        keys.ArrowRight.pressed = true;
        lastKey ='ArrowRight';
        player.direction = 'right';
        break;
      case 'Enter':
        keys.enter.pressed = true;
        lastKey ='Enter';
        destroyBlock();
        break;
    }
  });
  
//inverser l'écoute
window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowDown':
            keys.ArrowDown.pressed = false;
            break;
        case 'Enter':
            keys.enter.pressed = false;
            break;
    }
})

  document.addEventListener('keyup', event => {
    player.direction = null;
  });