import ObjectStore, { ObjectType } from "./ObjectStore";

describe("objectstore", () => {
  it("create", () => {
    const storeName = "myStore";
    const store = new ObjectStore(storeName);
    expect(store.name).toEqual(storeName);

    // create
    let o1: ObjectType = {
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

    const storeB = new ObjectStore("B");
    storeB.import(jsonString);
    expect(storeB.items["o1"]).toHaveProperty("oid", "o1");
    expect(storeB.items["o2"]).toBeTruthy();
    expect(storeB.items["o3"]).toBeFalsy();
  });

  it("change items => change root.children", () => {
    const store = new ObjectStore("A2");

    // create first object
    const o1: ObjectType = {
      oid: "o1",
      props: { x: 10, _parent: ["root", "5"] }
    };
    const o2 = {
      oid: "o2",
      props: { x: 20, _parent: ["root", "4"] }
    };
    const o3 = {
      oid: "o3",
      props: { x: 30, _parent: ["root", "3"] }
    };
    store.create([o1, o2, o3]);

    expect(store.root.children).toEqual([o3, o2, o1]);
    expect(store.items).toEqual({
      o1: o1,
      o2: o2,
      o3: o3
    });
    o1.props.x = 100;
    // no change in the store
    expect(store.root.children).toEqual([
      o3,
      o2,
      { oid: "o1", props: { x: 10, _parent: ["root", "5"] } }
    ]);
    expect(store.getItem("o1")).toEqual({
      oid: "o1",
      props: { x: 10, _parent: ["root", "5"] }
    });

    // update
    store.update([{ oid: "o1", props: { x: 11 } }]);
    const newO1 = {
      oid: "o1",
      props: { x: 11, _parent: ["root", "5"] }
    };
    expect(store.items["o1"]).toEqual(newO1);
    expect(store.root.children).toEqual([o3, o2, newO1]);

    // remove
    store.remove(["o2"]);
    expect(store.items).toEqual({
      o1: newO1,
      o3: o3
    });
    expect(store.root.children).toEqual([o3, newO1]);
  });

  it("reparent insert into correct order", () => {
    const store = new ObjectStore("A");

    // create first object
    const o1 = {
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
    store.update([o1_a, o2_a]);

    expect(store.root.children).toEqual([
      {
        oid: "o1",
        props: { x: 10, _parent: ["root", "5"] }
      },
      {
        oid: "o2",
        props: { x: 20, _parent: ["root", "7"] }
      }
    ]);
    // reparent o3
    const o3_a = {
      oid: "o3",
      props: { _parent: ["root", "2"] }
    };
    store.update([o3_a]);
    expect(store.root.children).toHaveLength(3);
    if (store.root.children) {
      expect(store.root.children[0].oid).toEqual("o3");
      expect(store.root.children[1].oid).toEqual("o1");
      expect(store.root.children[2].oid).toEqual("o2");
    }
  });

  it("reparent 6 in 5,6", () => {
    const store = new ObjectStore("56");

    // create first object
    const o5 = {
      oid: "o5",
      props: { x: 5, _parent: ["root", "5"] }
    };
    const o6 = {
      oid: "o6",
      props: { x: 6, _parent: ["root", "5"] }
    };
    store.create([o5, o6]);
    expect(store.root.children).toEqual([
      {
        oid: "o5",
        props: { x: 5, _parent: ["root", "5"] }
      },
      {
        oid: "o6",
        props: { x: 6, _parent: ["root", "6"] }
      }
    ]);

    // no reparent
    const o6a = {
      oid: "o6",
      props: { x: 66, _parent: ["root", "6"] }
    };
    store.update([o6a]);
    expect(store.root.children).toEqual([
      {
        oid: "o5",
        props: { x: 5, _parent: ["root", "5"] }
      },
      {
        oid: "o6",
        props: { x: 66, _parent: ["root", "6"] }
      }
    ]);

    // do reparent
    const o6b = {
      oid: "o6",
      props: { x: 666, _parent: ["root", "4"] }
    };
    store.update([o6b]);
    expect(store.root.children).toEqual([
      {
        oid: "o6",
        props: { x: 666, _parent: ["root", "4"] }
      },
      {
        oid: "o5",
        props: { x: 5, _parent: ["root", "5"] }
      }
    ]);
  });

  it("reparent reassign findex", () => {
    const store = new ObjectStore("C");

    // create first object
    const objects = [
      {
        oid: "o1",
        props: {
          _parent: ["root", "5"],
          x: 10
        }
      },
      {
        oid: "o2",
        props: {
          _parent: ["root", "5"],
          x: 20
        }
      }
    ];
    store.create(objects);

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
    const o3 = {
      oid: "o3",
      props: {
        _parent: ["root", "5"],
        x: 30
      }
    };
    store.create([o3]);

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
    const o4 = {
      oid: "o4",
      props: {
        _parent: ["root", "5"],
        x: 40
      }
    };
    store.create([o4]);

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
