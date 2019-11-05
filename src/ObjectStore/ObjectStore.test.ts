import ObjectStore from "./ObjectStore";
import Multiplayer from "./Multiplayer";
import { createObjectStore } from "./ObjectStoreList";

describe("objectstore", () => {
  it("create", () => {
    const storeName = "myStore";
    const store = new ObjectStore(storeName);
    expect(store.name).toEqual(storeName);

    // create
    let o1: Multiplayer.ObjectType = {
      oid: "o1",
      props: { x: 50 }
    };
    store.create([o1]);
    expect(store.items).toHaveProperty("o1", o1);
    expect(store.root.children).toHaveLength(0);

    // update
    o1 = {
      oid: "o1",
      props: {
        y: 100
      }
    };
    store.update([o1]);
    expect(store.items["o1"].props).toHaveProperty("x", 50);
    expect(store.items["o1"].props).toHaveProperty("y", 100);

    // reparent
    o1 = {
      oid: "o1",
      props: {
        _parent: ["root", "5"],
        x: 66
      }
    };

    store.update([o1]);
    expect(store.items["o1"].props).toHaveProperty("x", 66);
    expect(store.items["o1"].props).toHaveProperty("y", 100);
    expect(store.items["o1"].props).toHaveProperty("_parent", ["root", "5"]);
    expect(store.root.children).toHaveLength(1);

    // create second object
    let o2 = {
      oid: "o2",
      props: {}
    };
    store.create([o2]);

    // reparent o2 as child of o1
    o2 = {
      oid: "o2",
      props: {
        x: 123,
        _parent: ["o1", "5"]
      }
    };
    store.update([o2]);
    expect(store.items["o1"].children).toHaveLength(1);
    expect(store.items["o1"].children).toEqual([o2]);
    const jsonString = store.export();

    // reload json
    const storeB = createObjectStore("B");
    storeB.import(jsonString);
    expect(storeB.items["o1"]).toHaveProperty("oid", "o1");
    expect(storeB.items["o2"]).toBeTruthy();
    expect(storeB.items["o3"]).toBeFalsy();
  });

  it("reparent insert into correct order", () => {
    const storeName = "A";
    const store = createObjectStore(storeName);

    // create first object
    const o1: Multiplayer.ObjectType = {
      oid: "o1",
      props: { x: 10 }
    };
    const o2 = {
      oid: "o2",
      props: { x: 20 }
    };
    const o3 = {
      oid: "o3",
      props: { x: 30 }
    };
    store.create([o1, o2, o3]);

    // reparent o1
    const o1_a = {
      oid: "o1",
      props: { _parent: ["root", "5"] }
    };
    // reparent o2
    const o2_a = {
      oid: "o2",
      props: { _parent: ["root", "7"] }
    };
    store.update([o1, o2]);

    expect(store.root.children).toHaveLength(2);
    if (store.root.children) {
      expect(store.root.children[0].oid).toEqual("o1");
      expect(store.root.children[1].oid).toEqual("o2");
    }
    // reparent o3
    const o3_a = {
      oid: "o3",
      props: { _parent: ["root", "2"] }
    };
    store.update([o3]);
    expect(store.root.children).toHaveLength(3);
    if (store.root.children) {
      expect(store.root.children[0].oid).toEqual("o3");
      expect(store.root.children[1].oid).toEqual("o1");
      expect(store.root.children[2].oid).toEqual("o2");
    }
  });

  it("reparent reassign findex", () => {
    const storeName = "C";
    const store = createObjectStore(storeName);

    // create first object
    let message: Multiplayer.ClientMessage = {
      store: storeName,
      type: "create",
      data: [
        {
          oid: "o1",
          props: {
            _parent: ["root", "5"],
            x: 10
          }
        }
      ]
    };
    expect(store.request(message)).toEqual("ok");

    // create second object
    message = {
      store: storeName,
      type: "create",
      data: [
        {
          oid: "o2",
          props: {
            _parent: ["root", "5"],
            x: 20
          }
        }
      ]
    };
    expect(store.request(message)).toEqual("ok");

    expect(store.root.children).toHaveLength(2);
    if (store.root.children) {
      expect(store.root.children[0].props).toHaveProperty("x", 10);
      expect(store.root.children[0].props).toHaveProperty("_parent", [
        "root",
        "5"
      ]);
      expect(store.root.children[1].props).toHaveProperty("x", 20);
      expect(store.root.children[1].props).toHaveProperty("_parent", [
        "root",
        "6"
      ]);
    }

    // create third object
    message = {
      store: storeName,
      type: "create",
      data: [
        {
          oid: "o3",
          props: {
            _parent: ["root", "5"],
            x: 30
          }
        }
      ]
    };
    expect(store.request(message)).toEqual("ok");

    expect(store.root.children).toHaveLength(3);
    if (store.root.children) {
      expect(store.root.children[0].props).toHaveProperty("x", 10);
      expect(store.root.children[0].props).toHaveProperty("_parent", [
        "root",
        "5"
      ]);
      expect(store.root.children[1].props).toHaveProperty("x", 30);
      expect(store.root.children[1].props).toHaveProperty("_parent", [
        "root",
        "55"
      ]);
      expect(store.root.children[2].props).toHaveProperty("x", 20);
      expect(store.root.children[2].props).toHaveProperty("_parent", [
        "root",
        "6"
      ]);
    }

    // create fourth object
    message = {
      store: storeName,
      type: "create",
      data: [
        {
          oid: "o4",
          props: {
            _parent: ["root", "5"],
            x: 40
          }
        }
      ]
    };
    expect(store.request(message)).toEqual("ok");

    expect(store.root.children).toHaveLength(4);
    if (store.root.children) {
      expect(store.root.children[0].props).toHaveProperty("x", 10);
      expect(store.root.children[0].props).toHaveProperty("_parent", [
        "root",
        "5"
      ]);
      expect(store.root.children[1].props).toHaveProperty("x", 40);
      expect(store.root.children[1].props).toHaveProperty("_parent", [
        "root",
        "52"
      ]);
      expect(store.root.children[2].props).toHaveProperty("x", 30);
      expect(store.root.children[2].props).toHaveProperty("_parent", [
        "root",
        "55"
      ]);
      expect(store.root.children[3].props).toHaveProperty("x", 20);
      expect(store.root.children[3].props).toHaveProperty("_parent", [
        "root",
        "6"
      ]);
    }
  });
});
