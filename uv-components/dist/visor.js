var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fromEvent } from "rxjs";
import { VISOR_ID } from "uv-types";
import { Messaging } from "./messaging";
import { inject, visorPromptModal, promptUnlock, promptPerms } from "./modals";
const modal = visorPromptModal();
inject(modal);
function callVisor(action, data = null) {
    return new Promise((resolve, reject) => {
        const request = { app: "urbitVisor", action: action, data: data };
        chrome.runtime.sendMessage(VISOR_ID, request, response => resolve(response));
    });
}
export const urbitVisor = {
    isConnected: () => checkConnection(),
    promptConnection: () => promptUnlock(),
    authorizedPermissions: () => checkPermissions(),
    getShip: () => requestData("shipName"),
    getURL: () => requestData("shipURL"),
    requestPermissions: (permissions) => requestData("perms", permissions),
    scry: (payload) => requestData("scry", payload),
    poke: (payload) => requestData("poke", payload),
    thread: (payload) => requestData("thread", payload),
    subscribe: (payload, once) => requestData("subscribe", { payload: payload, once: once }),
    unsubscribe: (payload) => requestData("unsubscribe", payload),
    on: (eventType, keys, callback) => addListener(eventType, keys, callback),
    off: (subscription) => subscription.unsubscribe()
};
function addListener(eventType, keys, callback) {
    const get_in = (object, array) => {
        if (object && typeof object === "object" && array.length)
            return get_in(object[array[0]], array.slice(1));
        else
            return object;
    };
    const messages = fromEvent(window, 'message');
    return messages.subscribe((message) => {
        var _a, _b;
        const data = (_b = (_a = message === null || message === void 0 ? void 0 : message.data) === null || _a === void 0 ? void 0 : _a.event) === null || _b === void 0 ? void 0 : _b.data;
        if (message.data.app == "urbitVisorEvent" && message.data.event.action == eventType) {
            if (!data)
                callback();
            else {
                const result = get_in(data, keys);
                if (result)
                    callback(result);
            }
        }
    });
}
function requestData(action, data = null) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let response;
            if (chrome.runtime)
                response = yield callVisor(action, data);
            else
                response = yield Messaging.callVisor({ app: "urbitVisor", action: action, data: data });
            if (response.status === "locked")
                promptUnlock(), resolve(response);
            else if (response.status == "noperms")
                promptPerms(), resolve(response);
            if (response.error)
                reject(response);
            else
                resolve(response);
        }));
    });
}
;
function checkConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        let response;
        if (chrome.runtime)
            response = yield callVisor("check_connection");
        else
            response = yield Messaging.callVisor({ app: "urbitVisor", action: "check_connection" });
        return response;
    });
}
function checkPermissions() {
    return __awaiter(this, void 0, void 0, function* () {
        let response;
        if (chrome.runtime)
            response = yield callVisor("check_perms");
        else
            response = yield Messaging.callVisor({ app: "urbitVisor", action: "check_perms" });
        return response;
    });
}
//# sourceMappingURL=visor.js.map