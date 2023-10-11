// Function to generate blocks from a level map
function generateBlocks(level) {
    blocks.length = 0;
    let levelMap;
    switch (level) {
      case 1:
        levelMap = levelOne;
        break;
      case 2:
        levelMap = levelTwo;
        break;
      case 3:
        levelMap = levelThree;
        break;
      // Add more cases for additional levels
    }
    for (let i = 0; i < levelMap.length; i++) {
      for (let j = 0; j < levelMap[i].length; j++) {
        if (levelMap[i][j] === 0) {
          blocks.push({ x: j * 32, y: i * 32, value: 0 });
        } else if (levelMap[i][j] === 3) {
          blocks.push({ x: j * 32, y: i * 32, value: 3 });
        } else if (levelMap[i][j] === 2) {
          blocks.push({ x: j * 32, y: i * 32, value: 2 });
        } else if (levelMap[i][j] === 4) {
          blocks.push({ x: j * 32, y: i * 32, value: 4 });
        }
      }
    }
  }