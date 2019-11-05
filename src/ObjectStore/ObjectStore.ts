import Multiplayer from "./Multiplayer";
import { findexAfter, findexBetween } from "./findex";

const PARENT_PROP = "_parent";
const ROOT_OID = "root";

class ObjectStore {
  name: string;
  root: Multiplayer.ObjectType;
  items: Record<string, Multiplayer.ObjectType> = {};

  constructor(name: string) {
    this.name = name;
    this.root = { oid: "root", props: {}, children: [] };
  }

  public import(jsonString: string) {
    const json: Multiplayer.ObjectType = JSON.parse(jsonString);
    if (json) {
      const addToItemsRecursive = (object: Multiplayer.ObjectType) => {
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
          this.create(data as Multiplayer.ObjectType[]);
          return "ok";
        }

        case "update":
          this.update(data as Multiplayer.ObjectType[]);
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

  public create(objects: Multiplayer.ObjectType[]) {
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

  public update(objects: Multiplayer.ObjectType[]) {
    // check if all oids are ok
    for (let object of objects) {
      const oid = object.oid;
      if (!oid) {
        throw new Error("update: oid missing");
      }
      const foundObject = this.items[oid];
      if (!foundObject) {
        throw new Error(`update: object with oid: ${oid} not found`);
      }
    }

    for (let object of objects) {
      const foundObject = this.items[object.oid];
      const newParent = object.props[PARENT_PROP];
      let reparent = false;
      if (newParent && foundObject.props[PARENT_PROP] !== newParent) {
        reparent = true;
      }
      foundObject.props = { ...foundObject.props, ...object.props };
      if (reparent) {
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
      if (parent && parent.children) {
        parent.children = parent.children.filter(i => i !== obj);
      }
      // TODO remove child items
    }
  }

  private getParent(
    obj: Multiplayer.ObjectType
  ): Multiplayer.ObjectType | null {
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

  private reparent(obj: Multiplayer.ObjectType): boolean {
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
}

export default ObjectStore;
