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
      case "create": {
        const object = obj as Multiplayer.ObjectType;
        const oid = object.oid;
        console.log(`WS: create: ${oid}`);
        if (!oid) {
          throw new Error("ObjectStore.request create: oid missing");
        }
        if (this.items[oid]) {
          console.log(`oid: ${oid} already exists`);
          return "reject";
        }
        this.items[oid] = object;
        this.reparent(object);
        return "ok";
      }

      case "update": {
        const object = obj as Multiplayer.ObjectType;
        const oid = object.oid;

        if (!oid) {
          throw new Error("ObjectStore.request update: oid missing");
        }
        const foundObject = this.items[oid];
        if (!foundObject) {
          console.log(`object with oid: ${oid} not found`);
          return "reject";
        }
        const newParent = object.props[PARENT_PROP];
        let reparent = false;
        if (newParent && foundObject.props[PARENT_PROP] !== newParent) {
          reparent = true;
        }
        foundObject.props = { ...foundObject.props, ...object.props };
        if (reparent) {
          this.reparent(foundObject);
        }
        return "ok";
      }

      case "remove": {
        console.log("remove:", obj);
        const oids = obj as string[];
        for (let oid of oids) {
          const obj = this.items[oid];
          delete this.items[oid];
          const parent = this.getParent(obj);
          if (parent && parent.children) {
            parent.children = parent.children.filter(i => i !== obj);
          }
          // TODO remove child items
        }

        return "ok";
      }

      default:
        throw new Error(`ObjectStore.request: bad message type:${type}`);
    }
  }

  getParent(obj: Multiplayer.ObjectType): Multiplayer.ObjectType | null {
    const parentProp = obj.props[PARENT_PROP];
    if (!parentProp) {
      return null;
    }
    const [parentId, fIndex] = parentProp;
    if (parentId === ROOT_OID) {
      return this.root;
    } else {
      return this.items[parentId];
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
