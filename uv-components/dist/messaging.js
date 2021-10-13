var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const Messaging = {
    sendToPopup: function (message) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => chrome.runtime.sendMessage(message, (response) => res(response)));
        });
    },
    sendToBackground: function (request) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => chrome.runtime.sendMessage(Object.assign(Object.assign({}, request), { app: "urbit-visor-internal" }), (response) => res(response)));
        });
    },
    relayToBackground: function (request) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => chrome.runtime.sendMessage(request, (response) => res(response)));
        });
    },
    pushEvent: function (event, recipients) {
        for (let id of recipients) {
            if (typeof id == "number")
                chrome.tabs.sendMessage(id, { app: "urbitVisorEvent", event: event });
            if (typeof id == "string")
                chrome.runtime.sendMessage(id, { app: "urbitVisorEvent", event: event });
        }
    },
    callVisor: function ({ app, action, data }) {
        return new Promise((res, rej) => {
            const requestId = Math.random().toString(36).substr(2, 9);
            // first add listener for the eventual response
            window.addEventListener('message', function responseHandler(e) {
                const response = e.data;
                // ignore messages with the wrong request app name, wrong id, or null
                if (response.app !== "urbitVisorResponse" || response.id !== requestId)
                    return;
                // remove listener else they keep stacking up
                window.removeEventListener('message', responseHandler);
                // reject promise if there's an error
                if (response.error)
                    rej(response.error);
                // resolve if fine
                else
                    res(response);
            });
            window.postMessage({ action, data, app, id: requestId }, window.origin);
        });
    },
    createProxyController: () => {
        //listen to function calls from webpage
        window.addEventListener('message', function (e) {
            return __awaiter(this, void 0, void 0, function* () {
                const request = e.data;
                if (request && request.app !== "urbitVisor")
                    return;
                // relay message to background script
                request.origin = e.origin;
                Messaging.relayToBackground(request).then((response) => {
                    // relay back responses to webpage
                    window.postMessage({ app: "urbitVisorResponse", id: request.id, status: response === null || response === void 0 ? void 0 : response.status, response: response === null || response === void 0 ? void 0 : response.response }, window.origin);
                });
                return;
            });
        });
        // listen to events from the background script
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            // relay events to webpage
            if (request.app == "urbitVisorEvent") {
                window.postMessage(request, window.origin);
                sendResponse("ok");
            }
            else
                sendResponse("ng");
            return true;
        });
    }
};
//# sourceMappingURL=messaging.js.map