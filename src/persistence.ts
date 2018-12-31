import express = require("express");
import fs = require("fs");
import path = require("path");
import os = require("os");

import rootValue from "./rootValue";
import projectList from "./projectList";
import ItemFactory from "./ItemFactory";
import Project from "./project";

const router = express.Router();

const getFullDir = () => {
  let dir = process.env.FILE_ROOT || "data";
  // dir = path.join(os.tmpdir(), dir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  return dir;
};

const getFullFileName = (name: string) => {
  const fileName = path.format({
    dir: getFullDir(),
    name: name,
    ext: ".json"
  });
  return fileName;
};

router.post("/projects/:name", (req, res) => {
  console.log("persistence.post");
  const projectName = req.params.name;

  let project = rootValue.projects().find(p => p.name === projectName);
  if (project) {
    console.log(project);
    const fileName = getFullFileName(projectName);
    fs.writeFileSync(fileName, JSON.stringify(project));
    res.send();
  } else {
    res.status(204);
    res.send();
  }
});

router.get("/projects/:name", (req, res) => {
  console.log("persistence.get one");
  const projectName = req.params.name;

  // remove old project with the same name
  projectList.projects = projectList.projects.filter(
    p => p.name !== projectName
  );

  try {
    const fileName = getFullFileName(projectName);
    let jsonString = fs.readFileSync(fileName).toString();
    const json = JSON.parse(jsonString);

    const project = ItemFactory.fromJSON(json);

    projectList.projects.push(project as Project);
    res.json(project);
  } catch (ex) {
    console.log(ex);
    res.status(204);
    res.send();
  }
});

// list all project names
router.get("/projects", (req, res) => {
  console.log("persistence.get all");
  let dir = getFullDir();
  let fileNames = fs
    .readdirSync(dir)
    .map(f => path.basename(f, path.extname(f)));

  res.send(fileNames);
});

router.get("/symbols", (req, res) => {
  res.send("symbols");
});

router.post("/symbols/:name", (req, res) => {
  const name = req.params.name;

  // const symbols = rootValue.elements.filter(e => e.type === "symbol");
  res.send("smybols-post:" + req.body);
});

export default router;
