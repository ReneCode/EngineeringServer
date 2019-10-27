import ObjectStore from "./ObjectStore";
import Multiplayer from "./Multiplayer";
import { createObjectStore } from "./ObjectStoreList";

describe("objectstore", () => {
  it("create", () => {
    const storeName = "myStore";
    const store = new ObjectStore(storeName);
    expect(store.name).toEqual(storeName);

    // create
    let message: Multiplayer.ClientMessage = {
      store: storeName,
      type: "create",
      obj: {
        oid: "o1",
        props: { x: 50 }
      }
    };
    expect(store.request(message)).toEqual("ok");
    expect(store.items).toHaveProperty("o1", message.obj);
    expect(store.root.children).toHaveLength(0);

    // update
    message = {
      store: storeName,
      type: "update",
      obj: {
        oid: "o1",
        props: {
          y: 100
        }
      }
    };
    expect(store.request(message)).toEqual("ok");
    message.obj.props = {};
    expect(store.items["o1"].props).toHaveProperty("x", 50);
    expect(store.items["o1"].props).toHaveProperty("y", 100);

    // reparent
    message = {
      store: storeName,
      type: "update",
      obj: {
        oid: "o1",
        props: {
          _parent: ["root", "0.5"],
          x: 66
        }
      }
    };

    expect(store.request(message)).toEqual("ok");
    message.obj.props = {};
    expect(store.items["o1"].props).toHaveProperty("x", 66);
    expect(store.items["o1"].props).toHaveProperty("y", 100);
    expect(store.items["o1"].props).toHaveProperty("_parent", ["root", "0.5"]);
    expect(store.root.children).toHaveLength(1);

    // create second object
    message = {
      store: storeName,
      type: "create",
      obj: {
        oid: "o2",
        props: {}
      }
    };
    expect(store.request(message)).toEqual("ok");

    // reparent o2 as child of o1
    message = {
      store: storeName,
      type: "update",
      obj: {
        oid: "o2",
        props: {
          name: "object-2",
          x: 123,
          y: 234,
          _parent: ["o1", "5"]
        }
      }
    };
    expect(store.request(message)).toEqual("ok");
    expect(store.items["o1"].children).toHaveLength(1);
    const jsonString = store.export();

    // reload json
    const storeB = createObjectStore("type", "B");
    storeB.import(jsonString);
    expect(storeB.items["o1"]).toBeTruthy();
    expect(storeB.items["o2"]).toBeTruthy();
    expect(storeB.items["o3"]).toBeFalsy();
  });

  it("reparent insert into correct order", () => {
    const storeName = "A";
    const store = createObjectStore("type", storeName);

    // create first object
    let message: Multiplayer.ClientMessage = {
      store: storeName,
      type: "create",
      obj: {
        oid: "o1",
        props: { x: 10 }
      }
    };
    expect(store.request(message)).toEqual("ok");

    // create second object
    message = {
      store: storeName,
      type: "create",
      obj: {
        oid: "o2",
        props: { x: 20 }
      }
    };
    expect(store.request(message)).toEqual("ok");

    // create third object
    message = {
      store: storeName,
      type: "create",
      obj: {
        oid: "o3",
        props: { x: 30 }
      }
    };
    expect(store.request(message)).toEqual("ok");

    // reparent o1
    message = {
      store: storeName,
      type: "update",
      obj: {
        oid: "o1",
        props: { _parent: ["root", "5"] }
      }
    };
    expect(store.request(message)).toEqual("ok");

    // reparent o2
    message = {
      store: storeName,
      type: "update",
      obj: {
        oid: "o2",
        props: { _parent: ["root", "7"] }
      }
    };
    expect(store.request(message)).toEqual("ok");
    expect(store.root.children).toHaveLength(2);
    if (store.root.children) {
      expect(store.root.children[0].oid).toEqual("o1");
      expect(store.root.children[1].oid).toEqual("o2");
    }

    // reparent o3
    message = {
      store: storeName,
      type: "update",
      obj: {
        oid: "o3",
        props: { _parent: ["root", "2"] }
      }
    };
    expect(store.request(message)).toEqual("ok");
    expect(store.root.children).toHaveLength(3);
    if (store.root.children) {
      expect(store.root.children[0].oid).toEqual("o3");
      expect(store.root.children[1].oid).toEqual("o1");
      expect(store.root.children[2].oid).toEqual("o2");
    }
  });
});
