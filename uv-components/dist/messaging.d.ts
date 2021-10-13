import { UrbitVisorRequest, UrbitVisorEvent, UrbitVisorResponse, UrbitVisorState, UrbitVisorInternalComms } from "uv-types/types";
export declare const Messaging: {
    sendToPopup: (message: {
        state: UrbitVisorState;
    }) => Promise<void>;
    sendToBackground: (request: UrbitVisorInternalComms) => Promise<any>;
    relayToBackground: (request: UrbitVisorRequest) => Promise<UrbitVisorResponse>;
    pushEvent: (event: UrbitVisorEvent, recipients: Set<any>) => void;
    callVisor: ({ app, action, data }: UrbitVisorRequest) => Promise<UrbitVisorResponse>;
    createProxyController: () => void;
};
