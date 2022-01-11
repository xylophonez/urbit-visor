import React from "react";
import { useEffect, useState } from "react";
import Inputbox from "./Inputbox"
import Body from "./Body"

const Modal = () => {
  const [selected, setSelected] = useState(null);
  const [selectedToInput, setSelectedToInput] = useState(null);
  const [keyDown, setKeyDown] = useState(null);
  const [nextArg, setNextArg] = useState(null);

  useEffect(() => {setNextArg(null)}, [nextArg])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key == 'Enter') {
      event.preventDefault();
      setSelectedToInput(selected)
    }
    else if (event.key == ' ' && selected == selectedToInput) {
      event.preventDefault();
      setNextArg(true)
    }
    else {
    setKeyDown(event);
    return
    }
  }
  return (
  <div onKeyDown={(event: React.KeyboardEvent) => handleKeyDown(event)} tabIndex={-1}>
    <Inputbox selected={selectedToInput} nextArg={nextArg} />
    <Body handleSelection={(i: String) => setSelected(i)} selected={selected} keyDown={keyDown} />
  </div>
  )
};

export default Modal;
