import React from 'react';
import * as CSS from 'csstype';
import { useEffect, useState, useRef } from 'react';
import ReactJson from 'react-json-view';

interface DisplayProps {
  selected: String;
  airlockResponse: any;
}

const Display = (props: DisplayProps) => {
  // Define variable for content which will be held in the display area
  let displayContent;

  // Perform checks to know what to fill the content area with.
  // If airlock response exists
  if (props.airlockResponse) {
    // If the response is an array
    if (Array.isArray(props.airlockResponse)) {
      displayContent = (
        <AirlockSubscriptionResponse
          selected={props.selected}
          airlockResponse={props.airlockResponse}
        />
      );
    }
    // If the response is an object
    else if (typeof props.airlockResponse == 'object') {
      displayContent = (
        <ReactJson
          style={{ padding: '15px' }}
          src={props.airlockResponse}
          enableClipboard={false}
        />
      );
    }
    // Otherwise
    else {
      displayContent = (
        <div style={{ textAlign: 'center' }}>{JSON.stringify(props.airlockResponse)}</div>
      );
    }
  }
  // If no response, display empty
  else {
    displayContent = <div></div>;
  }

  // Return the html to be rendered for Display with the content inside
  return <div className="command-launcher-display">{displayContent}</div>;
};

// Display the airlock subscription response UI
const AirlockSubscriptionResponse = (props: DisplayProps) => {
  return (
    <div className="airlock-subscription-display">
      {props.airlockResponse.map((line: any, index: number) => (
        <div
          key={index}
          style={{ textAlign: 'left' }}
          className="airlock-subscription-display-line"
        >
          {JSON.stringify(line)}
        </div>
      ))}
    </div>
  );
};

export default Display;
