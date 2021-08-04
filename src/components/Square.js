import React, { useEffect, useState } from 'react';

const VALUE_COLOR = {
  1: 'blue',
  2: 'green',
  3: 'red',
  4: 'indigo',
  5: 'maroon',
  6: 'teal',
  7: 'black',
  8: 'gray',
  o: 'black',
  x: 'red',
  F: 'pink'
}

const Square = ({ self, onClick, isEndGame, onMouseDown, onMouseUp }) => {
  const [display, setDisplay] = useState(null);

  useEffect(() => {
    if (self.isOpen) {
      if (self.value === -1) {
        setDisplay('o');
      } else if (self.value === 0) {
        setDisplay('-');
      } else {
        setDisplay(self.value);
      }
    } else if (self.isFlag) {
      setDisplay('F');
    } else {
      setDisplay('-');
    }
  }, [self.value, self.isOpen, self.isFlag]);

  return (
    <button 
      style={{
        width: '32px', 
        backgroundColor: self.value === 'o' && self.isOpen ? 'red' : self.isOpen ? null : 'gray', 
        color: VALUE_COLOR[display] || 'transparent'
      }} 
      onClick={(e) => onClick(e, self)}
      onContextMenu={(e) => { e.preventDefault(); onClick(e, self); }}
      disabled={isEndGame || self.isOpen || self.isFlag}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      {display}
    </button>
  );
}

export default Square;
