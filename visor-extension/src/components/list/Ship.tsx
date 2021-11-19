import * as React from "react";
import Sigil from "../ui/svg/Sigil";
import { EncryptedShipCredentials, Messaging } from "@dcspark/uv-core";
import { whatShip, processName } from "../../utils";
import { useHistory } from "react-router-dom";
import icon from "../../icons/type-moon.svg";
import "./list.css";

interface ShipProps {
  active: EncryptedShipCredentials;
  ship: EncryptedShipCredentials;
}
export default function Ship(props: ShipProps) {
  const history = useHistory();
  const displayName = processName(props.ship.shipName);
  const shipname =
    whatShip(props.ship.shipName) === "moon" ? (
      <p onClick={select} className="moonname shipname">
        <span>~{displayName.slice(0, -14)}</span>
        <span>{displayName.slice(-14)}</span>
      </p>
    ) : (
      <p onClick={select} className="shipname">
        ~{displayName}
      </p>
    );

  function select(): void {
    Messaging.sendToBackground({
      action: "select_ship",
      data: { ship: props.ship },
    }).then((res) => history.push(`/ship/${props.ship.shipName}`));
  }

  return (
    <div
      onClick={select}
      className={
        props.active?.shipName == props.ship.shipName ? " ship active-ship" : "ship"
      }
    >
      <div className="sigil-wrapper">
        <Sigil
          size={props.active?.shipName == props.ship.shipName ? 40 : 40}
          patp={props.ship.shipName}
        />
      </div>
      <div className="vertical name-container">
        {shipname}
        <div className="type-label">
          <img src={icon} className="type-icon" />
          <p>moon</p>
        </div>
      </div>
    </div>
  );
}
