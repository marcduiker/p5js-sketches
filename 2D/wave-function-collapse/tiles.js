const nrOfImages = 12;
let tiles = [];

function loadTiles() {
  tiles[0] = new Tile(tileImages[0], ["A", "A", "A", "A"], 3);
  tiles[1] = new Tile(tileImages[1], ["B", "A", "B", "A"], 2);
  tiles[2] = new Tile(tileImages[2], ["B", "B", "B", "B"]);
  tiles[3] = new Tile(tileImages[3], ["A", "B", "A", "B"],2);
  tiles[4] = new Tile(tileImages[4], ["B", "B", "A", "A"]);
  tiles[5] = new Tile(tileImages[5], ["B", "C", "B", "A"]);
  tiles[6] = new Tile(tileImages[6], ["B", "DE", "ED", "A"]);
  tiles[7] = new Tile(tileImages[7], ["B", "A", "DE", "ED"]);
  tiles[8] = new Tile(tileImages[8], ["DE", "F", "ED", "A"]);
  tiles[9] = new Tile(tileImages[9], ["B", "B", "B", "A"]);
  tiles[10] = new Tile(tileImages[10], ["B", "A", "A", "A"]);
  tiles[11] = new Tile(tileImages[11], ["A", "C", "A", "B"]);

  for (let i = 0; i < nrOfImages; i++) {
    tiles[i].index = i;
  }

  // Only rotate tiles 4-8
  for (let i = 4; i < nrOfImages + 1; i++) {
    let tempTiles = [];
    for (let j = 0; j < 4; j++) {
      tempTiles.push(tiles[i].rotate(j));
    }
    tempTiles = removeDuplicatedTiles(tempTiles);
    tiles = tiles.concat(tempTiles);
  }

  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    tile.analyze(tiles);
  }
}

function removeDuplicatedTiles(tiles) {
  const uniqueTilesMap = {};
  for (const tile of tiles) {
    const key = tile.edges.join(","); // ex: "ABB,BCB,BBA,AAA"
    uniqueTilesMap[key] = tile;
  }
  return Object.values(uniqueTilesMap);
}
