const nrOfImages = 17;
let tiles = [];

function loadTiles() {
  tiles[0] = new Tile(tileImages[0], ["A", "A", "A", "A"]); // white dot
  tiles[1] = new Tile(tileImages[1], ["B", "A", "B", "A"], 2); // vertical chain
  tiles[2] = new Tile(tileImages[2], ["B", "B", "B", "B"], 0.5); // cross
  tiles[3] = new Tile(tileImages[3], ["A", "B", "A", "B"], 2); // horizontal chain
  tiles[4] = new Tile(tileImages[4], ["B", "B", "A", "A"]); // elbow
  tiles[5] = new Tile(tileImages[5], ["B", "C", "B", "A"]); // white connector
  tiles[6] = new Tile(tileImages[6], ["B", "DE", "ED", "A"], 3); // blue connector
  tiles[7] = new Tile(tileImages[7], ["B", "A", "DE", "ED"]); // blue connector hor mirror
  tiles[8] = new Tile(tileImages[8], ["DE", "F", "ED", "A"]); // blue middle
  tiles[9] = new Tile(tileImages[9], ["B", "B", "B", "A"], 0.5); // T
  tiles[10] = new Tile(tileImages[10], ["B", "A", "A", "A"]); // large white dot
  tiles[11] = new Tile(tileImages[11], ["A", "C", "A", "B"]); // pink connector
  tiles[12] = new Tile(tileImages[12], ["A", "C", "B", "A"], 2); // white/black elbow
  tiles[13] = new Tile(tileImages[13], ["A", "C", "A", "C"], 2); // white/ black hor
  tiles[14] = new Tile(tileImages[14], ["B", "GH", "HG", "A"], 3); // black connector
  tiles[15] = new Tile(tileImages[15], ["B", "A", "GH", "HG"]); // black connector hor mirror
  tiles[16] = new Tile(tileImages[16], ["GH", "I", "HG", "A"]); // black middle

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
