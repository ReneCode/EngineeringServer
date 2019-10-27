import fs = require("fs");
import Multiplayer from "./Multiplayer";
import { getDataFileName } from "../util/getDataFileName";
import { ok } from "assert";
import pgUtil from "../postgre/pgUtil";

const PARENT_PROP = "_parent";
const ROOT_OID = "root";

class ObjectStore {
  root: Multiplayer.ObjectType;
  items: Record<string, Multiplayer.ObjectType> = {};
  name: string;

  constructor(name: string) {
    this.name = name;
    this.root = { oid: "root", props: {}, children: [] };
  }

  private addItem(object: Multiplayer.ObjectType) {
    if (!object) {
      return;
    }
    if (object.children) {
      for (let child of object.children) {
        this.addItem(child);
      }
    }
    this.items[object.oid] = object;
  }

  public import(jsonString: string) {
    const json: Multiplayer.ObjectType = JSON.parse(jsonString);
    if (json) {
      this.root = json;
      this.addItem(this.root);
    }
  }

  public export() {
    const data = JSON.stringify(this.root);
    return data;
  }

  public request(message: Multiplayer.ClientMessage): Multiplayer.ResultType {
    const { type, obj } = message;
    switch (type) {
      case "create":
        console.log(`WS: create: ${obj.oid}`);
        if (!obj.oid) {
          throw new Error("ObjectStore.request create: oid missing");
        }
        if (this.items[obj.oid]) {
          console.log(`oid: ${obj.oid} already exists`);
          return "reject";
        }
        this.items[obj.oid] = obj;
        this.reparent(obj);
        return "ok";

      case "update":
        {
          if (!obj.oid) {
            throw new Error("ObjectStore.request update: oid missing");
          }
          const foundObject = this.items[obj.oid];
          if (!foundObject) {
            console.log(`object with oid: ${obj.oid} not found`);
            return "reject";
          }
          const newParent = obj.props[PARENT_PROP];
          let reparent = false;
          if (newParent && foundObject.props[PARENT_PROP] !== newParent) {
            reparent = true;
          }
          foundObject.props = { ...foundObject.props, ...obj.props };
          if (reparent) {
            this.reparent(foundObject);
          }
        }
        return "ok";

      case "remove":
        if (!obj.oid) {
          throw new Error("ObjectStore.request remove: oid missing");
        }
        delete this.items[obj.oid];
        // TODO remove child items
        return "ok";

      default:
        throw new Error(`ObjectStore.request: bad message type:${type}`);
    }
  }

  reparent(obj: Multiplayer.ObjectType): boolean {
    const parentProp = obj.props[PARENT_PROP];
    if (!parentProp) {
      return true;
    }
    const [parentId, fIndex] = parentProp;
    let parentItem: Multiplayer.ObjectType;
    if (parentId === ROOT_OID) {
      parentItem = this.root;
    } else {
      parentItem = this.items[parentId];
    }
    if (!parentItem) {
      return false;
    }

    if (!parentItem.children || parentItem.children.length === 0) {
      parentItem.children = [obj];
    } else {
      const children = parentItem.children;
      let insertIdx = -1;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const [_, idx] = child.props[PARENT_PROP];
        if (fIndex < idx) {
          insertIdx = i;
          break;
        }
      }
      if (insertIdx >= 0) {
        parentItem.children.splice(insertIdx, 0, obj);
      } else {
        parentItem.children = children.concat(obj);
      }
    }

    return true;
  }
}

export default ObjectStore;
