import * as React from "react";
import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import Sigil from "../ui/svg/Sigil";

import { EncryptedShipCredentials, Messaging } from "@dcspark/uv-core";
import { loginToShip } from "../../urbit";
import { decrypt } from "../../storage";
import { whatShip, processName } from "../../utils";
import Permissions from "../perms/Permissions";
import { motion } from "framer-motion";
import typeIcon from "../../icons/type-moon.svg";
import locationIcon from "../../icons/location-icon.svg";

import "./show.css";
import ManagerFooter from "./ManageFooter";
import ConnectFooter from "./ConnectFooter";

declare const window: any;

interface ShipProps {
  active: EncryptedShipCredentials;
  setActive: (ship: EncryptedShipCredentials) => void;
  saveActive?: (ship: EncryptedShipCredentials, url: string) => void;
  setThemPerms?: (pw: string) => void;
}

export default function ShipShow({ active, setActive, ...props }: ShipProps) {
  const dummyShip: EncryptedShipCredentials = {
    shipName: "~sampel-palnet",
    encryptedShipCode: "",
    encryptedShipURL: "http://localhost",
  };
  const history = useHistory();
  const [ship, setShip] = useState(dummyShip);
  const [shipURL, setURL] = useState("");
  const [showPerms, setShowPerms] = useState(false);
  const { patp }: any = useParams();
  const [showConnectionButtons, setShowConnectionButtons] = useState(false);
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const displayName = processName(ship.shipName);
  const shipname =
    whatShip(ship.shipName) === "moon" ? (
      <h1 className="ship-data-name">
        <span>~{displayName.slice(0, -14)}</span>
        <span>{displayName.slice(-14)}</span>
      </h1>
    ) : (
      <p className="shipname">~{displayName}</p>
    );
  useEffect(() => {
    let isMounted = true;
    Messaging.sendToBackground({ action: "cache_form_url", data: { url: "" } });
    Messaging.sendToBackground({ action: "get_ships" }).then((res) => {
      if (isMounted) {
        setShowPerms(false);
        const s = res.ships.find(
          (ur: EncryptedShipCredentials) => ur.shipName == patp
        );
        setShip(s);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [patp]);

  window.onkeypress = function (e: any) {
    if (e.key == "Enter" && ship.shipName !== active?.shipName) connect();
  };

  async function reconnect(url: string): Promise<void> {
    const code = decrypt(ship.encryptedShipCode, pw);
    setLoading(true);
    loginToShip(url, code)
      .then((res) => {
        if (res.statusText == "missing") {
          setError("Could not connect");
          setLoading(false);
        } else connect();
      })
      .catch((err) => {
        setError("Could not connect");
        setLoading(false);
      });
  }

  async function connect(): Promise<void> {
    setError("");
    if (pw === "") {
      setError("Password can't be empty.");
      return;
    }
    const url = decrypt(ship.encryptedShipURL, pw);
    if (url.length) {
      setLoading(true);
      Messaging.sendToBackground({
        action: "connect_ship",
        data: { url: url, ship: ship },
      })
        .then((res) => {
          if (res) setActive(ship);
          else setError("Could not connect");
          setLoading(false);
        })
        .catch((err) => {
          if (err.message == "Failed to PUT channel") reconnect(url);
          else setError("Could not connect");
          setLoading(false);
        });
    } else setError("Wrong password."), setLoading(false);
  }
  function disconnect(): void {
    Messaging.sendToBackground({ action: "disconnect_ship" }).then((res) => {
      setActive(null);
      setShowConnectionButtons(false);
      history.push("/ship_list");
    });
  }

  const connectButton = (
    <button
      className="single-button"
      onClick={() => setShowConnectionButtons(true)}
    >
      Connect
    </button>
  );
  const disconnectButton = (
    <button
      onClick={disconnect}
      className="single-button  connect-button red-bg"
    >
      Disconnect
    </button>
  );

  const confirmPassowordButton = (
    <button onClick={connect} className="single-button">
      Connect
    </button>
  );

  const connectionButton =
    ship?.shipName == active?.shipName ? disconnectButton : connectButton;

  function gotoHome() {
    setError("");
    const url = decrypt(ship.encryptedShipURL, pw);
    if (url.length) {
      chrome.tabs.create({ url: url });
    } else {
      setError("Wrong password.");
    }
  }
  function gotoPerms() {
    setError("");
    const url = decrypt(ship.encryptedShipURL, pw);
    if (url.length) {
      setURL(url);
      setShowPerms(true);
    } else {
      setError("Wrong password");
    }
  }
  function gotoDashboard() {
    chrome.tabs.create({ url: "https://urbitdashboard.com" });
  }
  if (!showPerms)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="ship-show flex-grow-wrapper"
      >
        <div>
          <div className="ship-data">
            <Sigil size={65} patp={ship.shipName} />
            {shipname}
          </div>
          <div className="ship-information">
            <div className="vertical">
              <span className="value">1075</span>
              <p className="label">contacts</p>
            </div>
            <div className="vertical">
              <span className="value">20</span>
              <p className="label">groups</p>
            </div>
            <div className="vertical">
              <span className="value">6</span>
              <p className="label">channels</p>
            </div>
          </div>
          <div className="flex">
            <div className="ship-location vertical">
              <div className="flex">
                <img src={locationIcon} className="ship-info-icon" />
                <p className="value">mars</p>
              </div>
              <p className="label">Location</p>
            </div>
            <div className="separator" />
            <div className="ship-type vertical">
              <div className="flex">
                <img src={typeIcon} className="ship-info-icon" />
                <p className="value">Moon</p>
              </div>
              <p className="label">Type</p>
            </div>
          </div>
        </div>
        <div className="block-footer">
          {showConnectionButtons ? (
            <ConnectFooter loading={loading} error={error} setPw={setPw}>
              {confirmPassowordButton}
            </ConnectFooter>
          ) : (
            <ManagerFooter
              gotoPerms={gotoPerms}
              gotoDashboard={gotoDashboard}
              gotoHome={gotoHome}
            >
              {connectionButton}
            </ManagerFooter>
          )}
        </div>
      </motion.div>
    );
  else return <Permissions ship={ship} shipURL={shipURL} />;
}
