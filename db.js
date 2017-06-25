var mongodb = require('mongodb');

function dbConnect(callback){
  mongodb.MongoClient.connect(
    process.env.MONGODB_URI,
    function(err, database) {
      if (err) throw err;
      console.log("connected to db");
      callback(database);
    }
  );
}

function dbInsertSquare(square){
  dbConnect(function(db){
    var squaresCol = db.collection('squares');
    squaresCol.insertOne(square);
  });
}

function dbInsertGrid(grid){
  dbConnect(function(db){
    var gridsCol = db.collection('grids');
    gridsCol.insertOne(newGrid); 
  })
}

function dbUpdateGrid(grid){
  dbConnect(function(db){
    var gridsCol = db.collection('grids');
    gridsCol.updateOne({_id: new mongodb.ObjectId(grid._id)}, {}, grid);
  })
}

function dbGetGrid(gridName, cb){
  dbConnect(function(db){
    var gridsCol = db.collection('grids');
    gridsCol.findOne({name: gridName}).then(cb);
  });
}

function createSquare(){
  var newSquare = {
    topMargin: [],
    bottomMargin: [],
    leftMargin: [],
    rightMargin: [], 
    center: [],
  };
  dbInsertSquare(newSquare);
}

// initialize grid with empty squares object
function createGrid(gridName){
  var newGrid = {
    name: gridName,
    bounds: {
      xMin: 0,
      xMax: 0,
      yMin: 0,
      yMax: 0
    }
    squares: {
      0: {
        0: { reservedUntil: -1 }
      }
    }
  };
  dbInsertGrid(newGrid);
}

// get a free square or create a new one
function getSquare(gridName, cb){
  dbGetGrid(gridName, function(res){
      var freeSquare = findFreeSquare(res);
      if (typeof(freeSquare) === 'undefined'){
        freeSquare = allocateMoreSquares(res);
      }
      reserveSquare(res, freeSquare[0], freeSquare[1]);
      dbUpdateGrid(res);
    }
  );
}

// reservedUntil = 0 just a boilerplate
function reserveSquare(res, x, y){
  if (typeof(res.squares[x]) === 'undefined' || typeof(res.squares[x][y]) === 'undefined') return false;
  res.squares[x][y].reservedUntil = 0;
  if (typeof(res.squares[x][y+1]) !== 'undefined'){
    res.squares[x][y+1].reservedUntil = 0;
  }
  if (typeof(res.squares[x][y-1]) !== 'undefined'){
    res.squares[x][y-1].reservedUntil = 0;
  }
  if (typeof(res.squares[x+1]) !== 'undefined' && typeof(res.squares[x+1][y]) !== 'undefined'){
    res.squares[x+1][y].reservedUntil = 0;
  }
  if (typeof(res.squares[x-1]) !== 'undefined' && typeof(res.squares[x-1][y]) !== 'undefined'){
    res.squares[x-1][y] = 0;
  }
}

function findFreeSquare(grid){
  var freeSquare = undefined;
  for (var xRow in grid.squares){
    for (var yCol in grid.squares[xRow]){
      var square = grid.squares[xRow][yCol];
      if (typeof(square.id) === 'undefined' && square.reservedUntil === -1){
        freeSquare = [xRow, yCol];
        break;
      }
    }
    if (freeSquare !== undefined) break;
  }
  return freeSquare;
}

function allocateMoreSquares(grid){
  grid.bounds.xMin++;
  grid.bounds.yMin++;
  grid.bounds.xMax++;
  grid.bounds.yMax++;
  for (var x=grid.bounds.xMin; x<=grid.bounds.xMax; x++){
    grid.squares[x][grid.bounds.yMax] = { reservedUntil: -1 };
    grid.squares[x][grid.bounds.yMin] = { reservedUntil: -1 };
  }
  for (var y=grid.bounds.yMin+1; y<=grid.bounds.yMax-1; y++){
    grid.squares[grid.bounds.xMin][y] = { reservedUntil: -1 };
    grid.squares[grid.bounds.xMax][y] = { reservedUntil: -1 };
  }
  return [grid.bounds.xMin, grid.bounds.yMin];
}