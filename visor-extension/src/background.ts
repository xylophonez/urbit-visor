import { Messaging } from "@dcspark/uv-core";
import { SubscriptionRequestInterface } from "@urbit/http-api/src/types";
import { EncryptedShipCredentials, UrbitVisorAction, UrbitVisorInternalAction, UrbitVisorInternalComms, UrbitVisorState } from "./types";

import { fetchAllPerms } from "./urbit"
import { useStore } from "./store";
import { EventEmitter } from 'events';

export const Pusher = new EventEmitter();


async function init() {
  const state = useStore.getState();
  await state.init();
  // listen to changes in popup preference in storage
  storageListener();
  messageListener();
  extensionListener();
};
init();

function storageListener() {
  chrome.storage.onChanged.addListener(function (changes, namespace) {
    const state = useStore.getState();
    if (changes.popup) state.changePopupPreference(changes.popup.newValue);
    if (changes.permissions) state.loadPerms(changes.permissions.newValue);
    if (changes.ships) {
      if (state.activeShip && deletedWasActive(state.activeShip, changes.ships.newValue, changes.ships.oldValue)) {
        state.disconnectShip();
      }
      state.init().then(res => console.log(""))
    }
  });
}

function deletedWasActive(activeShip: EncryptedShipCredentials, newShips: EncryptedShipCredentials[], oldShips: EncryptedShipCredentials[]) {
  if (newShips.length < oldShips.length) {
    const deletedShip = oldShips.find(ship => !newShips.map(newships => newships.shipName).includes(ship.shipName));
    if (activeShip.shipName == deletedShip.shipName) return true
    else return false
  }
  else return false
}

function messageListener() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.app == "urbit-visor-internal") handleInternalMessage(request, sender, sendResponse);
    else if (request.app == "urbitVisor") handleVisorCall(request, sender, sendResponse, "website");
    else sendResponse("ng")
    return true
  });
}
function extensionListener() {
  chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
    /* check whitelist here against sender.id */
    handleVisorCall(request, sender, sendResponse, "extension");
  });
}


function handleInternalMessage(request: UrbitVisorInternalComms, sender: any, sendResponse: any) {
  const state = useStore.getState();
  let recipients: Set<number | string>;
  const tabs = new Set(state.consumer_tabs.map(consumer => consumer.tab));
  const extensions = new Set(state.consumer_extensions.map(consumer => consumer.id));
  const extension_tabs = new Set(state.consumer_extensions.map(consumer => consumer.tabs).flat())
  recipients = new Set([...tabs, ...extensions, ...extension_tabs]);

  switch (request.action) {
    case "get_initial_state":
      sendResponse({ first: state.first, ships: state.ships, activeShip: state.activeShip, cachedURL: state.cached_url, cachedCreds: state.cached_creds, requestedPerms: state.requestedPerms })
      break;
    case "get_ships":
      sendResponse({ airlock: state.airlock, ships: state.ships, active: state.activeShip })
      break;
    case "get_selected":
      sendResponse({ selected: state.selectedShip, active: state.activeShip })
      break;
    case "get_cached_url":
      sendResponse({ cached_url: state.cached_url, cached_creds: state.cached_creds })
      break;
    case "get_perms":
      sendResponse({ selectedShip: state.selectedShip })
      break;
    case "get_settings":
      sendResponse({ popupPreference: state.popupPreference })
      break;
    case "set_master_password":
      state.setMasterPassword(request.data.password)
        .then(res => sendResponse("ok"));
      break;
    case "add_ship":
      state.addShip(request.data.ship, request.data.url, request.data.code, request.data.pw)
        .then(res => sendResponse("ok"));
      break;
    case "remove_ship":
      state.removeShip(request.data.ship)
        .then(res => sendResponse("ok"))
      break;
    case "select_ship":
      state.selectShip(request.data.ship);
      sendResponse("ok");
      break;
    case "connect_ship":
      if (state.activeShip) {
        state.disconnectShip();
        Messaging.pushEvent({ action: "disconnected", data: { ship: state.activeShip.shipName } }, recipients)
      };
      state.connectShip(request.data.url, request.data.ship)
        .then(res => {
          chrome.browserAction.setBadgeText({ text: "" });
          Messaging.pushEvent({ action: "connected" }, recipients);
          sendResponse("ok");
        })
        .catch(err => sendResponse(null));
      break;
    case "get_data":
      state.airlock.subscribe({
        app: "graph-store",
        path: "/keys",
        event: (data) => {
          sendResponse(data)
        }
      })
      break;
    case "disconnect_ship":
      state.disconnectShip();
      Messaging.pushEvent({ action: "disconnected" }, recipients)
      sendResponse("ok");
      break;
    case "grant_perms":
      state.grantPerms(request.data.request)
        .then(res => {
          chrome.browserAction.setBadgeText({ text: "" });
          const tbs = new Set(state.consumer_tabs.filter(tab => tab.url.origin === request.data.request.key).map(tab => tab.tab));
          const xtns = new Set(state.consumer_extensions.filter(ext => ext.id === request.data.request.key).map(ext => ext.id));
          const xtns_tabs = new Set(state.consumer_extensions.filter(ext => ext.id === request.data.request.key).map(ext => ext.tabs).flat());
          recipients = new Set([...tbs, ...xtns, ...xtns_tabs]);
          Messaging.pushEvent({ action: "permissions_granted", data: request.data.request }, recipients)
          sendResponse("ok")
        })
      break;
    case "deny_perms":
      state.denyPerms();
      chrome.browserAction.setBadgeText({ text: "" });
      sendResponse("ok");
      break;
    case "remove_whole_domain":
      state.removeWholeDomain(request.data.url, request.data.ship, request.data.domain)
        .then(res => {
          const tbs = new Set(state.consumer_tabs.filter(tab => tab.url.origin === request.data.domain).map(tab => tab.tab));
          const xtns = new Set(state.consumer_extensions.filter(ext => ext.id === request.data.domain).map(ext => ext.id));
          const xtns_tabs = new Set(state.consumer_extensions.filter(ext => ext.id === request.data.domain).map(ext => ext.tabs).flat());
          recipients = new Set([...tbs, ...xtns, ...xtns_tabs]);
          Messaging.pushEvent({ action: "permissions_revoked", data: request.data }, recipients);
          sendResponse("ok");
        })
      break;
    case "revoke_perm":
      state.revokePerm(request.data.url, request.data.ship, request.data.request)
        .then(res => {
          const tbs = new Set(state.consumer_tabs.filter(tab => tab.url.origin === request.data.request.key).map(tab => tab.tab));
          const xtns = new Set(state.consumer_extensions.filter(ext => ext.id === request.data.request.key).map(ext => ext.id));
          const xtns_tabs = new Set(state.consumer_extensions.filter(ext => ext.id === request.data.request.key).map(ext => ext.tabs).flat());
          recipients = new Set([...tbs, ...xtns, ...xtns_tabs]);
          Messaging.pushEvent({ action: "permissions_revoked", data: request.data.request }, recipients)
          sendResponse("ok")
        })
      break;
    case "change_popup_preference":
      state.changePopupPreference(request.data.preference)
        .then(res => sendResponse("ok"));
      break;
    case "change_master_password":
      state.changeMasterPassword(request.data.oldPw, request.data.newPw)
        .then(res => sendResponse("ok"))
      break;
    case "reset_app":
      state.resetApp()
        .then(res => sendResponse("ok"))
      break;
    case "connect_to_ship":
      state.connectShip(request.data.url, request.data.ship)
        .then(res => {
          chrome.browserAction.setBadgeText({ text: "" });
          sendResponse("ok")
        })
      break;
    case "cache_form_url":
      state.cacheURL(request.data.url);
      sendResponse("ok");
      break;
    case "cache_form_creds":
      state.cacheCreds(request.data.creds);
      sendResponse("ok");
      break;
  }
}
type visorCallType = "website" | "extension"

function handleVisorCall(request: any, sender: any, sendResponse: any, callType: visorCallType) {
  const state = useStore.getState();
  if (callType !== "website") state.addConsumerExtension({ tabs: [sender.tab.id], id: sender.id, name: request?.data?.consumerName || "" });
  else state.addConsumerTab({ tab: sender.tab.id, url: new URL(sender.tab.url) });
  if (request.action == "register_name") sendResponse({ status: "ok" })
  else if (request.action == "check_connection") sendResponse({ status: "ok", response: !!state.activeShip })
  else if (request.action == "unsubscribe") unsubscribe(state, request, sender, sendResponse)
  else if (!state.activeShip) notifyUser(state, "locked", sendResponse)
  else checkPerms(state, callType, request, sender, sendResponse);
}


function openWindow() {
  chrome.windows.create({
    url: chrome.runtime.getURL("popup.html"),
    type: "popup",
    focused: true,
    height: 600,
    width: 357,
  });
}
type Lock = "locked" | "noperms";

function notifyUser(state: UrbitVisorState, type: Lock, sendResponse: any) {
  if (state.popupPreference == "window") {
    openWindow();
    sendResponse("ng")
  }
  else {
    chrome.browserAction.setBadgeText({ text: "1" });
    chrome.browserAction.setBadgeBackgroundColor({ color: "#FF0000" });
    sendResponse({ status: type, response: null });
  }
}

function checkPerms(state: UrbitVisorState, callType: visorCallType, request: any, sender: any, sendResponse: any) {
  let id: string;
  if (callType === "extension") id = sender.id;
  else if (callType === "website") id = sender.origin;
  const extension = state.consumer_extensions.find(sumer => sumer.id === id);
  const name = extension ? extension.name : "";
  const existingPerms = state.permissions[id] || [];
  if (request.action === "check_perms") sendResponse({ status: "ok", response: existingPerms });
      else if (request.action === "perms") bulkRequest(state, id, name, existingPerms, request, sender, sendResponse)
      else if (!existingPerms || !existingPerms.includes(request.action)) {
        state.requestPerms({ key: id, name: name, permissions: [request.action], existing: existingPerms })
        notifyUser(state, "noperms", sendResponse);
      }
      else {
        if (request.action == "poke" || request.action == "subscribe") pubsub(state, callType, request, sender, sendResponse);
        else reqres(state, request, sendResponse)
      }
};

function bulkRequest(state: UrbitVisorState, requester: string, name: string, existingPerms: any, request: any, sender: any, sendResponse: any) {
  if (existingPerms && request.data.every((el: UrbitVisorAction) => existingPerms.includes(el))) sendResponse("perms_exist");
  else {
    state.requestPerms({ key: requester, name: name, permissions: request.data, existing: existingPerms });
    notifyUser(state, "noperms", sendResponse);
  }
}

function unsubscribe(state: UrbitVisorState, request: any, sender: any, sendResponse: any) {
  state.airlock.unsubscribe(request.data)
    .then(res => {
      const sub = state.activeSubscriptions.find(sub => sub.airlockID === request.data && sub.subscriber === sender.tab.id)
      state.removeSubscription(sub);
      sendResponse({ status: "ok", response: `unsubscribed to ${request.data}` });
    })
    .catch(err => sendResponse({ status: "error", response: err }))
}

function reqres(state: UrbitVisorState, request: any, sendResponse: any): void {
  switch (request.action) {
    case "perms":
      sendResponse({ status: "ok", response: "perms_exist" });
      break;
    case "shipName":
      sendResponse({ status: "ok", response: state.activeShip.shipName })
      break;
    case "shipURL":
      sendResponse({ status: "ok", response: state.airlock })
      break;
    case "scry":
      state.airlock.scry(request.data)
        .then(res => sendResponse({ status: "ok", response: res }))
        .catch(err => sendResponse({ status: "error", response: err }))
      break;
    case "thread":
      state.airlock.thread(request.data)
        .then(res => sendResponse({ status: "ok", response: res }))
        .catch(err => sendResponse({ status: "error", response: err }))
      break;
    default:
      sendResponse({ status: "error", response: "invalid_request" })
      break;
  }
}

function pubsub(state: UrbitVisorState, callType: visorCallType, request: any, sender: any, sendResponse: any): void {
  const eventRecipient = sender.tab.id;
  switch (request.action) {
    case "poke":
      const pokePayload = Object.assign(request.data, {
        onSuccess: () => handlePokeSuccess(request.data, eventRecipient, request.id),
        onError: (e: any) => handlePokeError(e, request.data, eventRecipient, request.id)
      });
      state.airlock.poke(pokePayload)
        .then(res => sendResponse({ status: "ok", response: res }))
        .catch(err => sendResponse({ status: "error", response: err }))
      break;
    case "subscribe":
      const existing = state.activeSubscriptions.find(sub => {
        return (
          sub.subscription.app == request.data.payload.app &&
          sub.subscription.path == request.data.payload.path)
      });
      if (!existing) {
        const payload = Object.assign(request.data.payload, {
          event: (event: any) => handleEvent(event, request.data.payload, request.id),
          err: (error: any) => handleSubscriptionError(error, request.data, eventRecipient, request.id)
        });
        state.airlock.subscribe(payload)
          .then(res => {
            state.addSubscription({ subscription: request.data.payload, subscriber: eventRecipient, airlockID: res, requestID: request.id });
            sendResponse({ status: "ok", response: res });
          })
          .catch(err => sendResponse({ status: "error", response: err }))
      } else if (existing.subscriber !== eventRecipient) {
        state.addSubscription({ subscription: request.data.payload, subscriber: eventRecipient, airlockID: existing.airlockID, requestID: request.id });
        sendResponse({ status: "ok", response: "piggyback" })
      } else sendResponse({ status: "ok", response: "noop" })
      break;
  }
}


function handlePokeSuccess(poke: any, id: number | string, requestID: string) {
  Messaging.pushEvent({ action: "poke_success", data: poke, requestID: requestID }, new Set([id]))
}

function handleEvent(event: any, subscription: SubscriptionRequestInterface, requestID: string) {
  setTimeout(() => {
    const state = useStore.getState();
    const recipients =
      state.activeSubscriptions
        .filter(sub => sub.subscription.app === subscription.app && sub.subscription.path === subscription.path)
        .map(sub => sub.subscriber)
    Messaging.pushEvent({ action: "sse", data: event, requestID: requestID }, new Set(recipients))
  }, 2000)
}
function handlePokeError(error: any, poke: any, id: number | string, requestID: string) {
  Messaging.pushEvent({ action: "poke_error", data: poke, requestID: requestID }, new Set([id]))
}
function handleSubscriptionError(error: any, subscription: any, id: number | string, requestID: string) {
  Messaging.pushEvent({ action: "subscription_error", data: subscription, requestID: requestID }, new Set([id]))
}