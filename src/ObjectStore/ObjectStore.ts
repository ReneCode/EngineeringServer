import Multiplayer from "./Multiplayer";
import { findexAfter, findexBetween } from "./findex";
import { truncate } from "fs";

const PARENT_PROP = "_parent";
const ROOT_OID = "root";

export type ObjectType = {
  oid: string;
  props: Record<string, any>;
  children?: ObjectType[];
};

class ObjectStore {
  name: string;
  root: ObjectType;
  items: Record<string, ObjectType> = {};

  constructor(name: string) {
    this.name = name;
    this.root = { oid: "root", props: {}, children: [] };
  }

  public import(jsonString: string) {
    const json: ObjectType = JSON.parse(jsonString);
    if (json) {
      const addToItemsRecursive = (object: ObjectType) => {
        if (!object) {
          return;
        }
        if (object.children) {
          for (let child of object.children) {
            addToItemsRecursive(child);
          }
        }
        this.items[object.oid] = object;
      };

      this.root = json;
      addToItemsRecursive(this.root);
    }
  }

  public export() {
    const data = JSON.stringify(this.root);
    return data;
  }

  public request(message: Multiplayer.ClientMessage): Multiplayer.ResultType {
    try {
      const { type, data } = message;
      switch (type) {
        case "create": {
          this.create(data as ObjectType[]);
          return "ok";
        }

        case "update":
          this.update(data as ObjectType[]);
          return "ok";

        case "remove":
          this.remove(data as string[]);
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
  }

  public create(objects: ObjectType[]) {
    // check if oids are ok
    for (let object of objects) {
      const oid = object.oid;
      if (this.items[oid]) {
        throw new Error(`create: oid: ${oid} already exists`);
      }
    }

    for (let object of objects) {
      const oid = object.oid;
      this.items[oid] = object;
      this.reparent(object);
    }
  }

  public update(items: ObjectType[]) {
    // check if all oids are ok
    for (let item of items) {
      const oid = item.oid;
      if (!oid) {
        throw new Error("update: oid missing");
      }
      const foundObject = this.items[oid];
      if (!foundObject) {
        throw new Error(`update: object with oid: ${oid} not found`);
      }
    }

    for (let item of items) {
      const foundObject = this.items[item.oid];
      const oldParent = foundObject.props[PARENT_PROP];
      const newParent = item.props[PARENT_PROP];
      let reparent = this.parentPropChanged(oldParent, newParent);
      foundObject.props = { ...foundObject.props, ...item.props };
      if (reparent) {
        const parent = this.getParent(foundObject);
        this.removeFromChildren(parent, item.oid);
        this.reparent(foundObject);
      }
    }
  }

  public remove(oids: string[]) {
    for (let oid of oids) {
      const obj = this.items[oid];
      delete this.items[oid];
      // remove from parent.children
      const parent = this.getParent(obj);
      this.removeFromChildren(parent, oid);
      // TODO remove child items
    }
  }

  private getParent(obj: ObjectType): ObjectType | null {
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

  private reparent(obj: ObjectType): boolean {
    const parentProp = obj.props[PARENT_PROP];
    if (!parentProp) {
      return true;
    }
    const [parentId, fIndex] = parentProp;
    let parentItem: ObjectType;
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
      let insertAfterIdx = -1;
      let lastFIndex = null;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        lastFIndex = child.props[PARENT_PROP][1];
        if (fIndex <= lastFIndex) {
          insertAfterIdx = i;
          break;
        }
      }
      if (insertAfterIdx >= 0) {
        if (fIndex === lastFIndex) {
          // same fIndex found
          let newFIndex;
          if (insertAfterIdx + 1 === parentItem.children.length) {
            newFIndex = findexAfter(fIndex);
          } else {
            const nextFIndex =
              parentItem.children[insertAfterIdx + 1].props[PARENT_PROP][1];
            newFIndex = findexBetween(fIndex, nextFIndex);
          }
          // correct fIndex
          obj.props[PARENT_PROP][1] = newFIndex;
          insertAfterIdx++;
        }
        parentItem.children.splice(insertAfterIdx, 0, obj);
      } else {
        parentItem.children = children.concat(obj);
      }
    }

    return true;
  }

  private parentPropChanged(a1: string[], a2: string[]) {
    if ((!a1 && !a2) || (a1 && a2 && a1[0] === a2[0] && a1[1] === a2[1])) {
      return false;
    }
    return true;
  }

  private removeFromChildren(parent: ObjectType | null, childOid: string) {
    if (parent && parent.children) {
      parent.children = parent.children.filter(i => i.oid !== childOid);
    }
  }
}

export default ObjectStore;
