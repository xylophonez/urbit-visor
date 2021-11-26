import * as React from "react";
import { useState, useEffect } from "react";
import Ship from "./Ship";
import { useHistory } from "react-router-dom";
import { EncryptedShipCredentials, Messaging } from "@dcspark/uv-core";
import { motion } from "framer-motion";
import "./list.css";

interface ShipListProps {
  active: EncryptedShipCredentials;
}
export default function ShipList({ active }: ShipListProps) {
  useEffect(() => {
    let isMounted = true;
    Messaging.sendToBackground({ action: "cache_form_url", data: { url: "" } });
    Messaging.sendToBackground({ action: "get_ships" }).then((res) => {
      if (isMounted) {
        setShips(res.ships);
        setActive(res.active)
      };
    });
    return () => {
      isMounted = false;
    };
  }, []);
  const history = useHistory();
  const [ships, setShips] = useState([]);
  const [aactive, setActive] = useState<EncryptedShipCredentials>(null);
  
  const inactive = ships.filter((s) => s.shipName != active?.shipName);

  const message = aactive ? "" : "No ship connected";
  let ordered = [];
  ordered = aactive ? [aactive, ...inactive] : inactive;
  const display = ordered.length ? (
    ordered.map((ship) => {
      return <Ship active={aactive} key={ship.shipName} ship={ship} />;
    })
  ) : (
    <p>Please add a ship</p>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="dashboard flex-grow-wrapper"
    >
      <h1 className="title-page">Your Ships</h1>
      <div className="ship-list flex-grow">{display}</div>
      <p className="ships-connected-msg"> {message}</p>
      <div className="padding">
        <button
          className="linear-button"
          onClick={() => history.push("/add_ship")}
        >
          + Add Ship
        </button>
      </div>
    </motion.div>
  );
}
