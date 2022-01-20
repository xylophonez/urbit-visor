import React from "react";
import * as CSS from 'csstype';
import { useEffect, useState } from "react";

interface MenuOptionProps {
  handleSelection: (textContent: String) => void;
  keyDown: React.KeyboardEvent;
}

const options = ['bitcoin', 'poke', 'scry', 'subscribe', 'thread'];
 
const MenuOptions = (props: MenuOptionProps) => {
  const [clickedIndex, setClickedIndex] = useState(-1);

  useEffect(() => {
    if (!props.keyDown) {return}
    else if (props.keyDown.key === 'ArrowDown' && clickedIndex < options.length-1)
      {setClickedIndex(clickedIndex + 1); props.handleSelection(options[clickedIndex+1])}
    else {return}},
    [props.keyDown])
  useEffect(() => {
    if (!props.keyDown) {return}
    else if (props.keyDown.key === 'ArrowUp' && clickedIndex > 0)
      {setClickedIndex(clickedIndex - 1); props.handleSelection(options[clickedIndex-1])}
    else {return}},
    [props.keyDown])

  return (
    <div /*style={listStyle}*/>
      {options.map((option, index) => <div style={(index == clickedIndex) ? {...listItemStyle, border:'outset'} : {...listItemStyle, border:'none'}} key={option}>{option}</div>)}
    </div>
  )
};

/*
const listStyle: CSS.Properties = {
  color: 'gray',
}
*/
const listItemStyle: CSS.Properties = {
  margin: '12px',
  fontSize: '18px'
}

export default MenuOptions;
