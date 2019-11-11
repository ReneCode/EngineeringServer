import ObjectStore, { ObjectType } from "./ObjectStore";
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

  try {
    const { type, data } = message;
    switch (type) {
      case "create":
        store.create(data as ObjectType[]);
        return "ok";

      case "update":
        store.update(data as ObjectType[]);
        return "ok";

      case "remove":
        store.remove(data as string[]);
        return "ok";

      default:
        throw new Error(`ObjectStore.request: bad message type:${type}`);
    }
  } catch (err) {
    console.error("--------------");
    console.error(err);
    console.error("--------------");
    return "reject";
  }
};
