import express = require("express");
import fs = require("fs");
import path = require("path");
import HttpStatus = require("http-status");

import rootValue from "../rootValue";
import symbolLibList from "../SymbolLibList";
import ItemFactory from "../ItemFactory";
import getStorageDir from "./getStorageDir";
import getStorageFileName from "./getStorageFileName";
import SymbolLib from "../SymbolLib";

const router = express.Router();

const storageDir = getStorageDir("symbol-lib");

router.post("/", (req, res) => {
  const symbolLibName = req.body.name;
  console.log("persistence-symbolLib.POST:", symbolLibName);

  let symbolLib = rootValue.symbolLibs().find(sl => sl.name === symbolLibName);
  if (symbolLib) {
    const fileName = getStorageFileName(storageDir, symbolLibName);
    fs.writeFileSync(fileName, JSON.stringify(symbolLib));
    res.send();
  } else {
    res.status(HttpStatus.BAD_REQUEST);
    res.send();
  }
});

router.get("/:name", (req, res) => {
  console.log("persistence-symbolLib.GET/:name");
  const symbolLibName = req.params.name;

  // remove old project with the same name
  symbolLibList.symbolLibs = symbolLibList.symbolLibs.filter(
    p => p.name !== symbolLibName
  );

  try {
    const fileName = getStorageFileName(storageDir, symbolLibName);
    let jsonString = fs.readFileSync(fileName).toString();
    const json = JSON.parse(jsonString);

    const symbolLib = ItemFactory.fromJSON(json) as SymbolLib;

    symbolLibList.symbolLibs.push(symbolLib);
    res.json(symbolLib);
  } catch (ex) {
    console.log(ex);
    res.status(HttpStatus.BAD_REQUEST);
    res.send();
  }
});

// list all project names
router.get("", (req, res) => {
  console.log("persistence-symbolLib.GET/:name");
  let fileNames = fs
    .readdirSync(storageDir)
    .map(f => path.basename(f, path.extname(f)));

  res.send(fileNames);
});

export default router;
