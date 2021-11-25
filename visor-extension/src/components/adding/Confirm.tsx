import * as React from "react";
import { useState } from "react";
import { initPerms } from "../../urbit";
import { getStorage, decrypt } from "../../storage";
import Spinner from "../ui/svg/Spinner";
import { motion } from "framer-motion";
import icon from "../../icons/success-icon.svg";
import "./adding.css";

interface ConfirmProps {
  url: string;
  code: string;
  ship: string;
  goBack: () => void;
  save: (url: string, code: string, pw: string) => void;
}
export default function Confirm(props: ConfirmProps) {
  const [loading, setLoading] = useState(false);
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const spinner = (
    <div className="spinner">
      <Spinner width="24" height="24" innerColor="white" outerColor="black" />
    </div>
  );

  function addShip(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    getStorage("password").then((res) => {
      const string = decrypt(res.password, pw);
      if (string === "urbit_visor") {
        saveShip();
      } else {
        setError("Wrong password.");
      }
    });
  }
  function saveShip() {
    setLoading(true);
    initPerms(props.ship, props.url)
      .then((res) => {
        props.save(props.url, props.code, pw);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError("Error adding the ship, please try again.");
      });
  }
  const hidden = { display: "none" };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="padding flex-grow-wrapper"
    >
      <div>
        <div className="container-progress">
          <div className="progress-bar" style={{ width: "100%" }} />
          <span className="progress-step">Step 3/3</span>
        </div>
        <div  className="image-container" >

        <img src={icon} className="image-success" />
        </div>
        <h1 className="center-title">Connection Success To</h1>
        <div className="container-shipname">
          <p className="confirm-shipname">~{props.ship} </p>
        </div>
      </div>
      <form onSubmit={addShip} className="form">
        <label className="label-input" htmlFor="">
          Confirm master password
        </label>
        <input type="submit" style={hidden} />
        <div className="flex-grow">
          <input
            value={pw}
            onChange={(e) => setPw(e.currentTarget.value)}
            type="password"
            placeholder="Master Password"
          />
          {loading && spinner}
          <p className="errorMessage">{error}</p>
        </div>
        <div className="two-buttons">
          <button className="red-bg left" onClick={props.goBack}>
            Cancel
          </button>
          <button disabled={!pw} type="submit" className="single-button right">
            Submit
          </button>
        </div>
      </form>
    </motion.div>
  );
}
