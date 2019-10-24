import ObjectStore from "./ObjectStore";
import Multiplayer from "./Multiplayer";

const objectStoreList: Record<string, ObjectStore> = {};

export const createObjectStore = (id: string) => {
  if (objectStoreList[id]) {
    throw new Error(`createObjectStore: id: ${id} already exists`);
  }
  const store = new ObjectStore(id);
  objectStoreList[id] = store;
  return store;
};

export const getObjectStore = (id: string) => {
  return objectStoreList[id];
};

export const objectStoreRequest = (
  message: Multiplayer.ClientMessage
): Multiplayer.ResultType => {
  let store = getObjectStore(message.store);
  if (!store) {
    return "reject";
  }

  return store.request(message);
};
