import express = require("express");
import fs = require("fs");

import { getDataFileName } from "../util/getDataFileName";
import {
  createObjectStore,
  getObjectStore
} from "../ObjectStore/ObjectStoreList";

const router = express.Router();

router.get("/:name", (req, res) => {
  console.log("objectstore.get one");
  const name = req.params.name;

  try {
    const store = createObjectStore(name);
    store.load(name);
    res.json(store.root);
  } catch (ex) {
    console.log(ex);
    res.status(500).send();
  }
});

router.post("/:name", (req, res) => {
  console.log("objectstore.post one");
  const name = req.params.name;

  try {
    const store = getObjectStore(name);
    if (!store) {
      res.status(204).send();
    }
    store.save(name);
    res.send("ok");
  } catch (ex) {
    console.log(ex);
    res.status(500).send();
  }
});

export default router;
