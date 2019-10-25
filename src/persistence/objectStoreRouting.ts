import express = require("express");
import fs = require("fs");
import path = require("path");

import {
  createObjectStore,
  getObjectStore,
  getObjectStoreId
} from "../ObjectStore/ObjectStoreList";
import { getDataDir } from "../util/getDataDir";

const router = express.Router();

router.get("/:type", (req, res) => {
  console.log("objectstore.get list");
  const type = req.params.type;
  const dir = path.join(getDataDir(), type);
  let fileNames = fs
    .readdirSync(dir)
    .map(f => path.basename(f, path.extname(f)));

  res.send(fileNames);
});

router.get("/:type/load", (req, res) => {
  console.log("objectstore.get one");
  const type = req.params.type;
  const name = req.query.name;

  try {
    // const store = createObjectStore(getObjectStoreId(type, name));
    // store.load(type, name);
    // res.json(store.root);
  } catch (ex) {
    console.log(ex);
    res.status(500).send();
  }
});

router.post("/save", (req, res) => {
  console.log("objectstore.post one");
  const type = req.params.type;
  const name = req.query.name;

  try {
    const store = getObjectStore(getObjectStoreId(type, name));
    if (!store) {
      res.status(204).send();
    }
    // store.save(type, name);
    res.send("ok");
  } catch (ex) {
    console.log(ex);
    res.status(500).send();
  }
});

export default router;
