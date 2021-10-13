import { fromEvent, Subscription } from "rxjs";
import {VISOR_ID, Scry, Poke, Thread, SubscriptionRequestInterface, UrbitVisorAction, UrbitVisorRequest, UrbitVisorResponse} from "./types";
import { Messaging } from "./messaging";
import {inject, visorPromptModal, showPopup, promptUnlock, promptPerms} from "./modals"

const modal = visorPromptModal();
inject(modal);

export const urbitVisor = {
    isConnected: () => checkConnection(),
    promptConnection: () => promptUnlock(),
    authorizedPermissions: () => checkPermissions(),
    getShip: () => requestData("shipName"),
    getURL: () => requestData("shipURL"),
    requestPermissions: (permissions: UrbitVisorAction[]) => requestData("perms", permissions),
    scry: (payload: Scry) => requestData("scry", payload),
    poke: (payload: Poke<any>) => requestData("poke", payload),
    thread: (payload: Thread<any>) => requestData("thread", payload),
    subscribe: (payload: SubscriptionRequestInterface, once?: boolean) => requestData("subscribe", { payload: payload, once: once }),
    unsubscribe: (payload: number) => requestData("unsubscribe", payload),
    on: (eventType: string, keys: string[], callback: Function) => addListener(eventType, keys, callback),
    off: (subscription: Subscription) => subscription.unsubscribe()
};


function addListener(eventType: string, keys: string[], callback: Function) {
    const get_in = (object: any, array: string[]): any => {
        if (object && typeof object === "object" && array.length) return get_in(object[array[0]], array.slice(1))
        else return object
    }
    const messages = fromEvent<MessageEvent>(window, 'message');
    return messages.subscribe((message) => {
        const data = message?.data?.event?.data;
        if (message.data.app == "urbitVisorEvent" && message.data.event.action == eventType) {
            if (!data) callback()
            else {
                const result = get_in(data, keys);
                if (result) callback(result);
            }
        }
    });
}

function callVisor(action, data = null): Promise<any>{
    return new Promise((resolve, reject) => {
        const request = { app: "urbitVisor", action: action, data: data}; 
        chrome.runtime.sendMessage(VISOR_ID, request, response =>  resolve(response));
    });
}


async function requestData(action: UrbitVisorAction, data: any = null): Promise<any> {
    return new Promise(async (resolve, reject) => {
        let response;
        if (chrome.runtime) response = await callVisor(action, data);
        else response = await Messaging.callVisor({ app: "urbitVisor", action: action, data: data });
        if (response.status === "locked") promptUnlock(), resolve(response);
        else if (response.status == "noperms") promptPerms(), resolve(response);
        if (response.error) reject(response)
        else resolve(response)
    })
};

async function checkConnection(): Promise<UrbitVisorResponse> {
    let response;
    if (chrome.runtime) response = await callVisor("check_connection");
    else response = await Messaging.callVisor({ app: "urbitVisor", action: "check_connection"});
    return response
}

async function checkPermissions(): Promise<any> {
    let response;
    if (chrome.runtime) response = await callVisor("check_perms");
    else response = await Messaging.callVisor({ app: "urbitVisor", action: "check_perms"});
    return response
}
