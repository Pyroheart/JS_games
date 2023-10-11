/**
 * Make the player move a block of value 2
 *
 * @param string The desired block
 * @returns Boolean false when overlaping, true when no overlaping
 */
function moveBlock(block) {
    const directions = ['up', 'down', 'left', 'right'];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    const nextBlockPosition = { x: block.x, y: block.y };
  
    switch (randomDirection) {
      case 'up':
        nextBlockPosition.y -= player.speed;
        break;
      case 'down':
        nextBlockPosition.y += player.speed;
        break;
      case 'left':
        nextBlockPosition.x -= player.speed;
        break;
      case 'right':
        nextBlockPosition.x += player.speed;
        break;
    }
  
    // Check if the next position would overlap with a block of value 0, 2, or 4
    const isNextPositionValid = blocks.every((b) => {
      if (b.value === 0 || b.value === 2 || b.value === 4) {
        if (b === block) {
          return true; // exclude the current block from overlap check
        }
        const isOverlap =
          nextBlockPosition.x < b.x + 30 &&
          nextBlockPosition.x + 30 > b.x &&
          nextBlockPosition.y < b.y + 30 &&
          nextBlockPosition.y + 30 > b.y;
        if (isOverlap) {
          return false; // block of value 0, 2, or 4 overlaps with the current block
        }
      }
      return true;
    });
  
    if (isNextPositionValid) {
      block.x = nextBlockPosition.x;
      block.y = nextBlockPosition.y;
    }
  }