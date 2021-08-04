import React, { useEffect, useState } from 'react';
import Square from './Square';

const Grid = ({ width, height, totalMines, updateGameState, isEndGame, onMouseDown, onMouseUp, onFlag, activateGame, reset }) => {
  const [bombLocations, setBombLocations] = useState([]);
  const [isGridValuesSet, setIsGridValuesSet] = useState(false);

  useEffect(() => {
    // setting up grid dimensions
    const grid = [];
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        grid.push({ x: j, y: i, value: 0, isOpen: false, isFlag: false });
      }
    }
    
    setBombLocations(grid);
    setIsGridValuesSet(false);
  }, [height, width, totalMines, reset]);

  const setupGridValues = (selectedSquare) => {
    // putting in mines
    const grid = [...bombLocations];
    let currentMines = 0;
    while (currentMines < totalMines) {
      const x = Math.floor(Math.random()* width);
      const y = Math.floor(Math.random()* height);
      const randomSquare = grid.find(square => (square.x === x && square.y === y));
      if (randomSquare.value !== -1 && selectedSquare.x !== randomSquare.x && selectedSquare.y !== randomSquare.y) {
        randomSquare.value = -1;
        currentMines++;
      }
    }

    // setting # of adjacent bombs
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const currentSquare = grid.find(square => (square.x === j && square.y === i));
        
        if (currentSquare.value !== -1) {
          let totalAdjacents = 0;

          // get values of all surrounding squares
          const topLeft = grid.find(square => (square.x === j-1 && square.y === i-1));
          const topCenter = grid.find(square => (square.x === j && square.y === i-1));
          const topRight = grid.find(square => (square.x === j+1 && square.y === i-1));
          const sideLeft = grid.find(square => (square.x === j-1 && square.y === i));
          const sideRight = grid.find(square => (square.x === j+1 && square.y === i));
          const bottomLeft = grid.find(square => (square.x === j-1 && square.y === i+1));
          const bottomCenter = grid.find(square => (square.x === j && square.y === i+1));
          const bottomRight = grid.find(square => (square.x === j+1 && square.y === i+1));

          const surroundingSquares = [topLeft, topCenter, topRight, sideLeft, sideRight, bottomLeft, bottomCenter, bottomRight];
          
          // looking at each surround square,
          // if the surrounding square is a mine,
          // increment totalAdjacents
          surroundingSquares.forEach(s => {
            if (s?.value === -1) totalAdjacents++;
          });
  
          currentSquare.value = totalAdjacents;
        }
      }
    }
    
    setBombLocations(grid);
  }

  const checkGameState = (square) => {
    const grid = [...bombLocations];
    if (square.value === -1) {
      grid.map(s => {
        // unselected mines
        if (!s.isFlag && s.value === -1) {
          s.isOpen = true;
        }
        // incorrectly flagged square
        if (s.isFlag && s.value !== -1) {
          s.value = 'x';
          s.isOpen = true;
          s.isFlag = false;
        }
      });
      // selected mine
      const currentSquare = grid.find(s => s.x === square.x && s.y === square.y);
      currentSquare.value = 'o';

      setBombLocations(grid);
      return updateGameState('lose');
    } else {
      const numOpenedSquares = bombLocations.filter(s => s.isOpen).length;
      if ((width*height) - numOpenedSquares === totalMines) {
        // auto-flag all mines
        grid.map(s => {
          if (s.value === -1) {
            s.isFlag = true;
          }
        });

        setBombLocations(grid);
        return updateGameState('win');
      }
    }

    // set game to be active if not win/lose yet
    return activateGame();
  }

  const _clearAdjacentZeroes = (grid, currentSquare) => {
    // get values of all surrounding squares
    const topLeft = grid.find(square => (square.x === currentSquare.x-1 && square.y === currentSquare.y-1));
    const topCenter = grid.find(square => (square.x === currentSquare.x && square.y === currentSquare.y-1));
    const topRight = grid.find(square => (square.x === currentSquare.x+1 && square.y === currentSquare.y-1));
    const sideLeft = grid.find(square => (square.x === currentSquare.x-1 && square.y === currentSquare.y));
    const sideRight = grid.find(square => (square.x === currentSquare.x+1 && square.y === currentSquare.y));
    const bottomLeft = grid.find(square => (square.x === currentSquare.x-1 && square.y === currentSquare.y+1));
    const bottomCenter = grid.find(square => (square.x === currentSquare.x && square.y === currentSquare.y+1));
    const bottomRight = grid.find(square => (square.x === currentSquare.x+1 && square.y === currentSquare.y+1));

    const surroundingSquares = [topLeft, topCenter, topRight, sideLeft, sideRight, bottomLeft, bottomCenter, bottomRight];

    // looking at each surround square,
    // if it exists on the grid, isn't a mine, isn't opened yet, and isn't flagged
    // then set it to open
    // also, if it was a zero value square, check do the same with its surrounding squares too
    surroundingSquares.forEach(s => {
      if (s && s.value !== -1 && !s.isOpen && !s.isFlag) {
        s.isOpen = true;
        if (s.value === 0) {
          _clearAdjacentZeroes(grid, s);
        }
      }
    });
  }

  const clearAdjacentsZeroes = (currentSquare) => {
    const grid = [...bombLocations];
     _clearAdjacentZeroes(grid, currentSquare);
    setBombLocations(grid);
  }

  const handleClick = (e, square) => {
    const selectedSquare = bombLocations.find(s => (s.x === square.x && s.y === square.y));
    if (e.type === 'click' && !square.isFlag) { // left click: select square
      if (!isGridValuesSet) { // first square selection: set up values for each square
        setupGridValues(square);
        setIsGridValuesSet(true);
      }

      selectedSquare.isOpen = true;

      if (selectedSquare.value === 0) { // open all adjacent zero values
        clearAdjacentsZeroes(square);
      }

      setBombLocations([...bombLocations]);
      checkGameState(square); // check if user won, lost, or neither
    } else if (e.type === 'contextmenu' && !square.isOpen) { // right click: flag square
      selectedSquare.isFlag = !selectedSquare.isFlag;
      setBombLocations([...bombLocations]);
      onFlag(selectedSquare.isFlag);
    }
  }

  // TODO: alternative to <br/>
  // TODO*: no wrap on large custom #
  return (
    <div>
      {bombLocations.map((square, i) => {
        return (
          <React.Fragment key={`square-${i}`}>
            <Square self={square} onClick={handleClick} isEndGame={isEndGame} onMouseDown={onMouseDown} onMouseUp={onMouseUp} />
            {(bombLocations[i+1]?.y !== square.y) && <br />}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default Grid;
