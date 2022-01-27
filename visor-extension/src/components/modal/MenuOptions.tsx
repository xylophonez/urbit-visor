import React from 'react';
import * as CSS from 'csstype';
import { useEffect, useState } from 'react';

interface MenuOptionProps {
  handleSelection: (textContent: String) => void;
  keyDown: React.KeyboardEvent;
}

const options = ['bitcoin', 'poke', 'scry', 'subscribe', 'thread', 'terminal'];

const MenuOptions = (props: MenuOptionProps) => {
  const [clickedIndex, setClickedIndex] = useState(-1);

  useEffect(() => {
    if (!props.keyDown) {
      return;
    } else if (props.keyDown.key === 'ArrowDown' && clickedIndex < options.length - 1) {
      setClickedIndex(clickedIndex + 1);
      props.handleSelection(options[clickedIndex + 1]);
    } else {
      return;
    }
  }, [props.keyDown]);
  useEffect(() => {
    if (!props.keyDown) {
      return;
    } else if (props.keyDown.key === 'ArrowUp' && clickedIndex > 0) {
      setClickedIndex(clickedIndex - 1);
      props.handleSelection(options[clickedIndex - 1]);
    } else {
      return;
    }
  }, [props.keyDown]);

  return (
    <div /*style={listStyle}*/ className="command-launcher-menu-list">
      {options.map((option, index) => (
        <div
          className="command-launcher-menu-option"
          style={
            index == clickedIndex
              ? { ...listItemStyle, border: 'outset' }
              : { ...listItemStyle, border: 'none' }
          }
          key={option}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

const listItemStyle: CSS.Properties = {
  margin: '12px',
  fontSize: '18px',
};

export default MenuOptions;
