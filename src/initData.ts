import fs = require("fs");
import path = require("path");

import projectList from "./ProjectList";
import createId from "./util/createId";
import getStorageDir from "./persistence/getStorageDir";
import ItemFactory from "./ItemFactory";
import symbolLibList from "./SymbolLibList";
import SymbolLib from "./SymbolLib";

const loadAllSymbolLibs = () => {
  const dir = getStorageDir("symbol-lib");
  const fileNames = fs.readdirSync(dir).map(fn => path.join(dir, fn));

  fileNames.forEach(fileName => {
    let jsonString = fs.readFileSync(fileName).toString();
    const json = JSON.parse(jsonString);

    const symbolLib = ItemFactory.fromJSON(json) as SymbolLib;

    symbolLibList.symbolLibs.push(symbolLib);
  });
};

const initData = () => {
  const id = createId();
  const project = projectList.createProject(id, "new project");
  project.createPage("new page A");
  project.createPage("new page B");
  // add new project & pages
  // new Page(this.id, "new page A"),
  // new Page(this.id, "new page B")

  loadAllSymbolLibs();
};

export default initData;
