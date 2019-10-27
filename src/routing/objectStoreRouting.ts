import express = require("express");
import HttpStatus = require("http-status-codes");

import {
  getObjectStore,
  createObjectStore
} from "../ObjectStore/ObjectStoreList";
import pgUtil from "../postgre/pgUtil";

const router = express.Router();

// list all objectstores
router.get("/:type/", async (req, res) => {
  try {
    const type = req.params.type;
    const names = await pgUtil.selectObjectStores(type);
    res.json(names);
  } catch (err) {
    console.error(err);
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

// create project
// => {id, name} of created project
router.post("/:type", async (req, res) => {
  try {
    const type = req.params.type;
    const name = req.body.name;
    if (!type || !name) {
      res.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    const id = await pgUtil.createObjectStore(type, name);
    res.json({ id, name });
  } catch (ex) {
    console.log(ex);
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

// delete project
// =>
router.delete("/:type/:id", async (req, res) => {
  try {
    const { type, id } = req.params;
    if (!type || !id) {
      res.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    await pgUtil.deleteObjectStore(type, id);
    res.send(HttpStatus.OK);
  } catch (ex) {
    console.log(ex);
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

// load objectstore localy
router.get("/:type/:id", async (req, res) => {
  try {
    const { type, id } = req.params;
    if (!type || !id) {
      res.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    const project = await pgUtil.selectObjectStore(type, id);
    let store = getObjectStore(id);
    if (!store) {
      store = createObjectStore(id);
      store.import(project.data);
    }
    res.json(store.root);
  } catch (ex) {
    console.log(ex);
    res.sendStatus(500);
  }
});

router.post("/:type/:id", async (req, res) => {
  try {
    const { type, id } = req.params;
    if (!type || !id) {
      res.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    const store = getObjectStore(id);
    if (!store) {
      res.sendStatus(HttpStatus.NO_CONTENT);
      return;
    }

    const data = JSON.stringify(store.root);
    await pgUtil.updateObjectStoreData(type, id, data);

    res.sendStatus(HttpStatus.OK);
  } catch (ex) {
    console.log(ex);
    res.status(500).send();
  }
});

export default router;
