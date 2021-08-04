import React, { useEffect, useState } from 'react';
import Grid from './Grid';
import Square from './Square';
import NumberDisplay from './NumberDisplay';

const BTN_STATE = {
  default: ':)',
  selecting: ':O',
  game_over: ':(',
  win: '8)'
}

const Board = ({ setup }) => {
  const [numMinesLeft, setNumMinesLeft] = useState(setup.mines);
  const [timer, setTimer] = useState(0);
  const [btnEmotion, setBtnEmotion] = useState(BTN_STATE.default);
  const [isActive, setIsActive] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [isLose, setIsLose] = useState(false);
  const [reset, setReset] = useState(0);
  
  useEffect(() => {
    setTimer(0);
    setBtnEmotion(BTN_STATE.default);
    setIsActive(false);
    setIsWin(false);
    setIsLose(false);
    setNumMinesLeft(setup.mines);
  }, [setup])

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    } else if (!isActive && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const resetBoard = () => {
    setTimer(0);
    setBtnEmotion(BTN_STATE.default);
    setIsActive(false);
    setIsWin(false);
    setIsLose(false);
    setNumMinesLeft(setup.mines);
    setReset(reset === 1 ? 0 : 1);
  }

  const updateGameState = (result) => {
    if (result === 'win') {
      setIsWin(true);
      setBtnEmotion(BTN_STATE.win);
      setNumMinesLeft(0);
    } else if (result === 'lose') {
      setIsLose(true);
      setBtnEmotion(BTN_STATE.game_over);
    }
    setIsActive(false);
  }

  const onFlag = (isFlag) => {
    if (isFlag) {
      setNumMinesLeft(numMinesLeft - 1);
    } else {
      setNumMinesLeft(numMinesLeft + 1);
    }
  }

  const onMouseDown = () => {
    setBtnEmotion(BTN_STATE.selecting);
  }

  const onMouseUp = () => {
    setBtnEmotion(BTN_STATE.default);
    if (timer === 0) setTimer(1);
  }

  return (
    <React.Fragment>
      <div style={{display: 'inline-block', backgroundColor: 'lightgray', padding: '.25rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <NumberDisplay value={numMinesLeft} />
          <button onClick={resetBoard} style={{height: 'fit-content', padding: '.25rem .5rem'}}>{btnEmotion}</button>
          <NumberDisplay value={timer} />
        </div>
        <Grid 
          reset={reset}
          height={setup.height} 
          width={setup.width} 
          totalMines={setup.mines} 
          updateGameState={updateGameState} 
          isEndGame={isWin || isLose} 
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onFlag={onFlag}
          activateGame={() => setIsActive(true)}
        />
      </div>
      <div>
        {isWin && <p style={{fontSize: '3rem'}}>YOU WIN!</p>}
        {isLose && <p style={{fontSize: '3rem'}}>GAME OVER</p>}
        {isLose && (
          <div style={{border: '1px solid black', marginTop: '1rem', padding: '.5rem', width: 'fit-content', textAlign: 'initial', margin: '0 auto'}}>
            <span style={{fontWeight: 600}}>Key: </span>
            <div style={{marginTop: '.5rem'}}>
              <Square self={{value: 'o', isOpen: true}} isEndGame={true} />
              <span style={{marginLeft: '.75rem'}}>selected mine</span>
            </div>
            <div>
              <Square self={{value: -1, isOpen: true}} isEndGame={true} />
              <span style={{marginLeft: '.75rem'}}>untouched mine</span>
            </div>
            <div>
              <Square self={{value: 'x', isOpen: true}} isEndGame={true} />
              <span style={{marginLeft: '.75rem'}}>flagged incorrectly</span>
            </div>
            <div>
              <Square self={{isFlag: true}} isEndGame={true} />
              <span style={{marginLeft: '.75rem'}}>flagged correctly</span>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

export default Board;
