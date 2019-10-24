const path = require("path");
const fs = require("fs");

import { getDataDir } from "./getDataDir";

export const getDataFileName = (subDir: string, name: string) => {
  const dir = path.join(getDataDir(), subDir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const fileName: string = path.format({
    dir: dir,
    name: name,
    ext: ".json"
  });
  return fileName;
};
