import * as React from "react";
import { useState, useEffect } from "react";
import NavBar from "./components/ui/NavBar";
import Welcome from "./components/setup/Welcome";
import Setup from "./components/setup/Setup";
import AddShip from "./components/adding/AddShip"
import ShipList from "./components/list/ShipList";
import ShipShow from "./components/show/ShipShow";
import PermissionsPrompt from "./components/perms/PermissionsPrompt";
import Settings from "./components/settings/Settings";
import About from "./components/ui/About";
import { AnimatePresence } from "framer-motion";
import { EncryptedShipCredentials, UrbitVisorState, PermissionRequest } from "./types/types";
import { Messaging } from "./messaging";
import {
  MemoryRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory
} from "react-router-dom";
import { LocationDescriptor } from "history";
import { useStore } from "./store";


import "./App.css";

export default function App() {
  useEffect(() => {
    Messaging.sendToBackground({ action: "get_initial_state" })
      .then(state => {
        console.log(state, "state")
        setFirst(state.first);
        setShips(state.ships)
        setActive(state.activeShip);
        setPermsRequest(state.requestedPerms);
        setInteracting(state.requestedPerms != undefined || state.first);
        // setCachedURL(state.cached_url);
        // setRequestedInput(state.requestedPerms);
        route(state);
      })
  }, [])
  // chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  //   console.log(message, "message received!")
  //   if (message.state) setState(message.state);
  // // });
  // const [first, setFirst] = useState(true);
  const [active, setActive] = useState<EncryptedShipCredentials>(null);
  const [interacting, setInteracting] = useState(false);
  const [ships, setShips] = useState([]);
  const [first, setFirst] = useState(false);
  const [permsRequest, setPermsRequest] = useState(null);
  console.log(permsRequest, "perm request")
  // const [cachedURL, setCachedURL] = useState("http://localhost");
  // const [requested, setRequestedInput] = useState(null);
  // const first = useStore(state => state.first);
  // console.log(first, "first")
  // const active = useStore(state => state.activeShip);
  // const ships = useStore(state => state.ships);

  const history = useHistory();

  async function readState(): Promise<any> {
    return Messaging.sendToBackground({ action: "state" });
  };

  function route(state: any): void{
    if (state.first)  history.push("/welcome")
    else if (state.cachedURL?.length) history.push("/add_ship")
    else if (state.requestedPerms) history.push("/ask_perms")
    else if (state.activeShip)  {
      Messaging.sendToBackground({action: "select_ship", data: {ship: state.activeShip}})
        .then(res => history.push(`/ship/${state.activeShip.shipName}`))
    }
    else if (state.ships.length)  history.push("/ship_list")
    else  history.push("/add_ship")
  }


  function redirect(): LocationDescriptor {
    console.log(first, "routing");
    if (first) return "/welcome"
    else if (active) return "/ship"
    else if (ships.length) return "/ship_list"
    else return "/add_ship"
  }

  return (
    <div className="App">
      <NavBar active={active} interacting={interacting}/>
      <div className="App-content">
        <AnimatePresence>
        <Switch>
          <Route exact path="/">
            <Redirect to={redirect()} />
          </Route>
          <Route path="/welcome">
            <Welcome />
          </Route>
          <Route path="/setup">
            <Setup />
          </Route>
          <Route path="/add_ship">
            <AddShip />
          </Route>
          <Route path="/ship_list">
            <ShipList active={active}/>
          </Route>
          <Route key={Date.now()} path="/ship/:patp">
            <ShipShow active={active} setActive={setActive}/>
          </Route>
          <Route path="/ask_perms">
            <PermissionsPrompt perms={permsRequest}/>
          </Route>
          <Route path="/settings">
            <Settings />
          </Route>
          <Route path="/about">
            <About />
          </Route>
        </Switch>
        </AnimatePresence>
      </div>
    </div>
  );
}