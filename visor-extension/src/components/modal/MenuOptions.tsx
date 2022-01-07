import React from "react";
import * as CSS from 'csstype';
import { useEffect, useState } from "react";

interface MenuOptionProps {
  handleSelection: (textContent: String) => void;
  keyDown: React.KeyboardEvent;
}

const options = ['bitcoin', 'poke', 'peek'];
 
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
    <ul style={listStyle}>
      {options.map((option, index) => <li style={(index == clickedIndex) ? {border:'outset'} : {border:'none'}} key={option}>{option}</li>)}
    </ul>
  )
};

const listStyle: CSS.Properties = {
  listStyleType: 'none',
}

export default MenuOptions;
