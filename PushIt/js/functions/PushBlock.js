function getBlockInDirection(x, y, direction) {
    switch (direction) {
      case 'up':
        return blocks.find(block => block.x === x && block.y === y - 30); 
        
      case 'down':
        return blocks.find(block => block.x === x && block.y === y + 30);
      case 'left':
        return blocks.find(block => block.x === x - 30 && block.y === y);
      case 'right':
        return blocks.find(block => block.x === x + 30 && block.y === y);
      default:
        return null;
    }
  }

function pushBlock(direction) {
    const block = getBlockInDirection(player.x, player.y, direction);
  
    if (block && block.value === 2) {
      const newBlock = getBlockInDirection(block.x, block.y, direction);
  
      if (newBlock && newBlock.value === 0) {
        block.value = 0;
        newBlock.value = 2;
      }
    }
  }
  

  