import { Subscription } from "rxjs";
import { Scry, Poke, Thread, SubscriptionRequestInterface, UrbitVisorAction, UrbitVisorResponse } from "uv-types";
export declare const urbitVisor: {
    isConnected: () => Promise<UrbitVisorResponse>;
    promptConnection: () => void;
    authorizedPermissions: () => Promise<any>;
    getShip: () => Promise<any>;
    getURL: () => Promise<any>;
    requestPermissions: (permissions: UrbitVisorAction[]) => Promise<any>;
    scry: (payload: Scry) => Promise<any>;
    poke: (payload: Poke<any>) => Promise<any>;
    thread: (payload: Thread<any>) => Promise<any>;
    subscribe: (payload: SubscriptionRequestInterface, once?: boolean) => Promise<any>;
    unsubscribe: (payload: number) => Promise<any>;
    on: (eventType: string, keys: string[], callback: Function) => Subscription;
    off: (subscription: Subscription) => void;
};
