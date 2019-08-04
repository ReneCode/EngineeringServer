import express = require("express");

const router = express.Router();

import projects from "./projects";
import symbolLibs from "./symbolLibs";

router.use("/projects", projects);
router.use("/symbollibs", symbolLibs);

export default router;
