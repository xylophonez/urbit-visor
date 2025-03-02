import { UrbitVisorState, EncryptedShipCredentials } from './types';
import {
  getStorage,
  initStorage,
  storeCredentials,
  removeShip,
  setPopupPreference,
  reEncryptAll,
  savePassword,
  resetApp,
} from './storage';
import { connectToShip, grantPerms, deleteDomain, revokePerms, fetchAllPerms } from './urbit';
import create from 'zustand';

export const useStore = create<UrbitVisorState>((set, get) => ({
  airlock: null,
  first: true,
  ships: [],
  cached_url: '',
  cached_creds: null,
  popupPreference: 'modal',
  requestedPerms: null,
  selectedShip: null,
  activeShip: null,
  permissions: {},
  consumer_tabs: [],
  consumer_extensions: [],
  activeSubscriptions: [],
  init: async () => {
    const res = await getStorage(['popup', 'ships', 'password', 'permissions']);
    set(state => ({
      first: !('password' in res),
      popupPreference: res.popup || 'modal',
      ships: res.ships || [],
      permissions: res.permissions || {},
    }));
  },
  setMasterPassword: async password => {
    const res = await initStorage(password);
    set(state => ({ first: false }));
  },
  addShip: async (ship, url, code, pw) => {
    const creds = await storeCredentials(ship, url, code, pw);
    const airlock = await connectToShip(url, creds);
    set(state => ({ selectedShip: creds, activeShip: creds, airlock: airlock }));
  },
  cacheURL: (string: string) => set(state => ({ cached_url: string })),
  cacheCreds: (creds: EncryptedShipCredentials) => set(state => ({ cached_creds: creds })),
  removeShip: async ship => {
    const active = get().activeShip;
    if (active?.shipName === ship.shipName) {
      const airlock = (get() as any).airlock;
      airlock.reset();
      const ships = await removeShip(ship);
      console.log(ships);
      set(state => ({ ships: ships, activeShip: null, airlock: null, activeSubscriptions: [] }));
    } else {
      const ships = await removeShip(ship);
      set(state => {
        ships: ships;
      });
    }
  },
  selectShip: ship => set(state => ({ selectedShip: ship })),
  connectShip: async (url, ship) => {
    const airlock = await connectToShip(url, ship);
    const perms = await fetchAllPerms(airlock.url);
    // TODO some handling here...?
    console.log(perms, 'perms fetched');
    set(state => ({ activeShip: ship, airlock: airlock, permissions: perms.bucket }));
  },
  disconnectShip: async () => {
    const airlock = (get() as any).airlock;
    airlock.reset();
    set(state => ({ activeShip: null, airlock: null, activeSubscriptions: [], permissions: {} }));
  },
  requestPerms: request => set(state => ({ requestedPerms: request })),
  grantPerms: async perms => {
    const airlock = (get() as any).airlock;
    await grantPerms(airlock, perms);
    const newperms = await fetchAllPerms(airlock.url);
    set(state => ({ requestedPerms: null, permissions: newperms.bucket }));
  },
  denyPerms: () => set(state => ({ requestedPerms: null })),
  removeWholeDomain: async (url, ship, domain) => {
    const res = await deleteDomain(url, ship, domain);
    const airlock = (get() as any).airlock;
    if (airlock) {
      const newperms = await fetchAllPerms(airlock.url);
      set(state => ({ requestedPerms: null, permissions: newperms.bucket }));
    } else set(state => ({ requestedPerms: null }));
  },
  revokePerm: async (url, ship, permRequest) => {
    const res = await revokePerms(url, ship, permRequest);
    const airlock = (get() as any).airlock;
    if (airlock) {
      const newperms = await fetchAllPerms(airlock.url);
      set(state => ({ requestedPerms: null, permissions: newperms.bucket }));
    } else set(state => ({ requestedPerms: null }));
  },
  loadPerms: (permissions: any) => {
    set(state => ({ permissions: permissions }));
  },
  changePopupPreference: async preference => {
    await setPopupPreference(preference);
    set(state => ({ popupPreference: preference }));
  },
  changeMasterPassword: async (oldPassword, password) => {
    await reEncryptAll(oldPassword, password);
    await savePassword(password);
  },
  resetApp: async () => {
    const active = get().activeShip;
    if (active) {
      const airlock = (get() as any).airlock;
      airlock.reset();
    }
    await resetApp();
    set(state => ({
      first: true,
      ships: [],
      activeShip: null,
      airlock: null,
      activeSubscriptions: [],
    }));
  },
  addConsumerTab: newConsumer => {
    const match = get().consumer_tabs.find(consumer => newConsumer.tab == consumer.tab);
    if (!match) set(state => ({ consumer_tabs: [...state.consumer_tabs, newConsumer] }));
  },
  addConsumerExtension: newConsumer => {
    const match = get().consumer_extensions.find(consumer => newConsumer.id == consumer.id);
    if (!match)
      set(state => ({ consumer_extensions: [...state.consumer_extensions, newConsumer] }));
    else {
      const rest = get().consumer_extensions.filter(ext => ext.id !== match.id);
      const updated = {
        id: match.id,
        name: match.name,
        tabs: [...match.tabs, ...newConsumer.tabs],
      };
      set(state => ({ consumer_extensions: [...rest, updated] }));
    }
  },
  addSubscription: sub =>
    set(state => ({ activeSubscriptions: [...state.activeSubscriptions, sub] })),
  removeSubscription: subToDelete => {
    const filtered = get().activeSubscriptions.filter(sub => {
      return !(
        sub.airlockID === subToDelete.airlockID && sub.subscriber === subToDelete.subscriber
      );
    });
    set(state => ({ activeSubscriptions: filtered }));
  },
}));
