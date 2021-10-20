import Urbit from "@urbit/http-api";
import { Scry, Thread, Poke, SubscriptionRequestInterface } from "@urbit/http-api/src/types"

export { Scry, Thread, Poke, SubscriptionRequestInterface };
export const VISOR_ID = "gebdankfdnaihbffjhgenabgbdfmjmff";

export type DecryptedShipCredentials = {
    shipName: string;
    shipURL: string;
    shipCode: string;
};

export type EncryptedShipCredentials = {
    shipName: string;
    encryptedShipURL: string;
    encryptedShipCode: string;
};

type TabID = number;
type ExtensionID = string;

interface VisorSubscription {
    subscription: SubscriptionRequestInterface,
    subscriber: TabID | ExtensionID,
    airlockID: number,
    requestID: string
}


interface UrbitVisorConsumerWebsite {
    id: TabID,
    url: URL
}

interface UrbitVisorConsumerExtension {
    id: ExtensionID,
    name: string
}

export interface UrbitVisorState {
    airlock: Urbit,
    first: boolean,
    ships: EncryptedShipCredentials[],
    cached_url: string,
    popupPreference: PopupPreference,
    requestedPerms: PermissionRequest,
    selectedShip: EncryptedShipCredentials,
    activeShip: EncryptedShipCredentials,
    permissions: PermissionsGraph,
    consumers: Array<UrbitVisorConsumerWebsite | UrbitVisorConsumerExtension>,
    activeSubscriptions: VisorSubscription[],
    init: () => Promise<void>,
    setMasterPassword: (password: string) => Promise<void>,
    addShip: (ship: string, url: string, code: string, pw: string) => Promise<void>,
    cacheURL: (string: string) => void,
    removeShip: (ship: EncryptedShipCredentials) => Promise<void>,
    selectShip: (ship: EncryptedShipCredentials) => void,
    connectShip: (url: string, ship: EncryptedShipCredentials) => Promise<void>,
    disconnectShip: () => void,
    requestPerms: (request: PermissionRequest) => void,
    grantPerms: (perms: PermissionRequest) => Promise<void>,
    denyPerms: () => void,
    removeWholeDomain: (url: string, ship: string, domain: string) => Promise<void>,
    revokePerm: (url: string, ship: string, perms: PermissionRequest) => Promise<void>,
    loadPerms: (permissions: PermissionsGraph) => void,
    changePopupPreference: (preference: PopupPreference) => Promise<void>,
    changeMasterPassword: (oldPassword: string, newPassword: string) => Promise<void>
    resetApp: () => Promise<void>,
    addConsumer: (consumer: UrbitVisorConsumerWebsite | UrbitVisorConsumerExtension) => void
    addSubscription: (sub: VisorSubscription) => void,
    removeSubscription: (sub: VisorSubscription) => void
}

export type PopupPreference = "modal" | "window";

type Website = string;

export interface PermissionRequest {
    key: Website | ExtensionID,
    name?: string
    permissions: Permission[],
    existing?: Permission[]
}
export type Permission = "shipName" | "shipURL" | "scry" | "thread" | "poke" | "subscribe"
export interface PermissionsGraph {
    [key: string]: Permission[]
}

export type UrbitVisorAction = "on" | "check_connection" | "check_perms" | "shipURL" | "perms" | "shipName" | "scry" | "poke" | "subscribe" | "subscribeOnce" | "unsubscribe" | "thread";
export type UrbitVisorInternalAction = "state" | "connected" | "cache_form_url" | "end_url_caching" | "dismiss_perms";
type UrbitVisorRequestType = Scry | Thread<any> | Poke<any> | SubscriptionRequestInterface | UrbitVisorAction[]

export interface UrbitVisorRequest {
    app: "urbitVisor",
    action: UrbitVisorAction,
    data?: UrbitVisorRequestType
}
export interface UrbitVisorResponse {
    id: string,
    status: "locked" | "noperms" | "ok"
    response?: any
    error?: any
}

export interface UrbitVisorInternalComms {
    action: UrbitVisorInternalAction | string,
    data?: any
}

export interface UrbitVisorEvent {
    action: UrbitVisorEventType
    requestID?: string,
    data?: any
}
export type UrbitVisorEventType = UrbitVisorInternalEvent | UrbitEvent

type UrbitVisorInternalEvent = "connected" | "disconnected" | "permissions_granted" | "permissions_revoked"
type UrbitEvent = "sse" | "poke_success" | "poke_error" | "subscription_error"

export interface PermissionGraph{
    [key: string]: {
        permissions: Permission[]
    }
}

type UrbitAction = "scry" | "thread" | "poke" | "subscribe"

// export interface Permission{
//   date: number,
//   capability: UrbitAction[]
//   caveats: Caveat[]
// }

// interface Caveat{
//     name: string,
//     type: string,
//     value: any
    
// }