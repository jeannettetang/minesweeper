// TODO: scoreboard?
// TODO: make it beautiful! including fonts and actual emojis
import React, { useState } from 'react';
import Board from './Board';

const DIFFICULTY = {
  beginner: {
    height: 9,
    width: 9,
    mines: 10
  },
  intermediate: {
    height: 16,
    width: 16,
    mines: 40
  },
  expert: {
    height: 16,
    width: 30,
    mines: 99
  },
  custom: {
    height: 20,
    width: 30,
    mines: 145
  }
}

const Game = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('beginner');
  const [difficulty, setDifficulty] = useState(DIFFICULTY.beginner);
  const [customDifficulty, setCustomDifficulty] = useState({height: 20, width: 30, mines: 145});

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedDifficulty === 'custom') {
      const newCustomDifficulty = {...customDifficulty};
      if (newCustomDifficulty.mines > newCustomDifficulty.height * newCustomDifficulty.width) {
        newCustomDifficulty.mines = newCustomDifficulty.height * newCustomDifficulty.width - 1;
      }
      setCustomDifficulty(newCustomDifficulty);
      setDifficulty(newCustomDifficulty);
    } else {
      setDifficulty(DIFFICULTY[selectedDifficulty]);
    }
  }

  const handleChangeSelection = (event) => {
    setSelectedDifficulty(event.target.value);
  }

  const handleChangeNumber = (event, type) => {
    setCustomDifficulty({...customDifficulty, [type]: +event.target.value});
  }

  return (
    <div style={{padding: '1rem', margin: '0 auto', textAlign: 'center'}}>
      <form onSubmit={handleSubmit} style={{marginBottom: '1rem'}}>
        <div style={{marginBottom: '.5rem'}}>
          <label htmlFor="difficulty-select" style={{marginRight: '.5rem'}}>Choose difficulty:</label>
          <select name="difficulty" id="difficulty-select" onChange={handleChangeSelection}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        {selectedDifficulty === 'custom' && (
          <div style={{marginBottom: '.5rem'}}>
            <label htmlFor="height-input" style={{marginRight: '.5rem'}}>Height:</label>
            <input 
              type="number" 
              id="height-input" 
              value={customDifficulty.height} 
              name="height" 
              min="0" 
              max="50" 
              onChange={(e) => handleChangeNumber(e, 'height')} 
              style={{marginRight: '.75rem'}} 
            />
            <label htmlFor="width-input" style={{marginRight: '.5rem'}}>Width:</label>
            <input 
              type="number" 
              id="width-input" 
              value={customDifficulty.width} 
              name="width" 
              min="0" 
              max="50" 
              onChange={(e) => handleChangeNumber(e, 'width')} 
              style={{marginRight: '.75rem'}} 
            />
            <label htmlFor="mines-input" style={{marginRight: '.5rem'}}>Mines:</label>
            <input 
              type="number" 
              id="mines-input" 
              value={customDifficulty.mines} 
              name="mines" 
              min="0" 
              max={customDifficulty.height * customDifficulty.width - 1} 
              onChange={(e) => handleChangeNumber(e, 'mines')} 
              style={{marginRight: '.75rem'}} 
            />
          </div>
        )}
        <input type="submit" value="Select" />
      </form>
      <Board setup={difficulty} height={difficulty.height} width={difficulty.width} mines={difficulty.mines} />
    </div>
  );
}

export default Game;
