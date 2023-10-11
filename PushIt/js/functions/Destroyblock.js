/**
 * Make the player break a block of value 2
 *
 * @param none
 * @returns nothing
 */
function destroyBlock() {
    for (const block of blocks) {
      if (player.x < block.x + 32 && player.x + 32 > block.x && player.y < block.y + 32 && player.y + 32 > block.y && block.value === 2) {
        blocks.splice(blocks.indexOf(block), 1);
        console.log("Block destroyed!");
        break; // Exit the loop after destroying one block
      }
    }
  }