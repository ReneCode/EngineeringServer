import ObjectStore from "./ObjectStore";
import Multiplayer from "./Multiplayer";
import pg from "../pg";
import pgUtil from "../postgre/pgUtil";

const objectStoreList: Record<string, ObjectStore> = {};

const getId = (type: string, name: string) => `${type}/${name}`;

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
  const id = message.store;
  let store = objectStoreList[id];
  if (!store) {
    console.log(`ObjectStore: ${id} not found`);
    return "reject";
  }

  return store.request(message);
};
